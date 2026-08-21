import json
import os
from typing import TypedDict, Literal, List, Dict
from datetime import datetime

from langgraph.graph import StateGraph, END

from app.llm import generate, generate_with_tools
from app.booking_tools import check_availability, create_booking

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

LANGUAGE_INSTRUCTION = {
    "en": "Reply in English.",
    "ur": "Reply in Urdu script.",
    "roman_ur": "Reply in Roman Urdu (Urdu written in English letters).",
}

PLAIN_TEXT_INSTRUCTION = (
    "Reply in plain text only. Never use markdown formatting — no asterisks "
    "for bold, no pipe tables, no bullet dashes, no headings. Write prices "
    "and lists as simple sentences or numbered lines like \"1. Haircut - 1500\"."
)

CURRENCY_INSTRUCTION = "All prices are in Pakistani Rupees. Always write prices as 'Rs. 1500', never use ₹, $, ₱, or any other currency symbol."

class AgentState(TypedDict, total=False):
    session_id: str
    message: str
    history: List[Dict[str, str]]

    intent: Literal["general", "services"]
    language: Literal["en", "ur", "roman_ur"]

    response: str


SUPERVISOR_SYSTEM_PROMPT = """You are a routing classifier for a beauty salon chatbot.
Given the conversation so far and the latest customer message, output STRICT
JSON only, no extra text:

{"intent": "general" | "services", "language": "en" | "ur" | "roman_ur"}

Rules:
- "general" = greetings, questions about location/address/map/timings/contact, or the customer ending the conversation (thanks, bye).
- "services" = anything about services offered, prices, discounts, promotions, packages, OR booking/scheduling an appointment — including short follow-ups like "yes", "book mine", or confirming details when the conversation history shows a booking/service topic already in progress.
- "language": "en" for English, "ur" for Urdu script, "roman_ur" for Urdu written in Roman/English letters (e.g. "aap ka time kya hai").
If unsure of intent, default to "general". If unsure of language, default to "en".
"""


def supervisor_node(state: AgentState) -> AgentState:
    raw = generate(SUPERVISOR_SYSTEM_PROMPT, state["message"], history=state.get("history"))
    try:
        parsed = json.loads(raw)
        intent = parsed.get("intent", "general")
        language = parsed.get("language", "en")
    except (json.JSONDecodeError, AttributeError):
        intent, language = "general", "en"

    if intent not in ("general", "services"):
        intent = "general"
    if language not in ("en", "ur", "roman_ur"):
        language = "en"

    state["intent"] = intent
    state["language"] = language
    return state


def route_from_supervisor(state: AgentState) -> str:
    return state["intent"]


GENERAL_SYSTEM_PROMPT_TEMPLATE = """You are a friendly front-desk assistant for a beauty salon.
Handle greetings, questions about the salon's location, address, map link,
timings, and contact info, and gracefully close the conversation when the
customer says thanks/bye. Only use the salon info provided below, do not
invent details. Keep replies short and warm.

Salon info:
{salon_info}

This is a ladies-only salon. If asked whether men can book, or about
services for men, politely explain this is a women's salon and we don't
offer services to male customers.

{plain_text_instruction}

{currency_instruction}

{language_instruction}
"""


def _load_salon_info() -> dict:
    with open(os.path.join(DATA_DIR, "salon_info.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def general_node(state: AgentState) -> AgentState:
    salon_info = _load_salon_info()
    system_prompt = GENERAL_SYSTEM_PROMPT_TEMPLATE.format(
        salon_info=json.dumps(salon_info, ensure_ascii=False),
        plain_text_instruction=PLAIN_TEXT_INSTRUCTION,
        currency_instruction=CURRENCY_INSTRUCTION,
        language_instruction=LANGUAGE_INSTRUCTION[state["language"]],
    )
    state["response"] = generate(system_prompt, state["message"], history=state.get("history"))
    return state



SERVICES_SYSTEM_PROMPT_TEMPLATE = """You are a salon assistant. You handle two things:

1. Questions about services, pricing, discounts, and promotions — answer
   only from the services data below, never invent a service or price.

2. Booking appointments. When a customer wants to book:
   - Use the conversation history to remember details already given (service,
     date, time, name, phone) — never ask again for something already provided.
   - Figure out the service, date (convert to YYYY-MM-DD; today is {today}),
     and time (convert to 24-hour HH:MM).
   - If you don't have the customer's name or phone number yet, ask for them
     before calling create_booking.
   - Call check_availability first if you're unsure a slot is free.
   - Call create_booking to actually reserve it once you have all details.
   - If a slot is taken or outside business hours, apologize and offer the
     alternative_times returned by the tool — never make up times yourself.
   - After a successful booking, confirm the booking_id, service, date and time back to the customer.

Services data:
{services_data}

This is a ladies-only salon. If asked whether men can book, or about
services for men, politely explain this is a women's salon and we don't
offer services to male customers.

{plain_text_instruction}

{currency_instruction}

{language_instruction}
"""

BOOKING_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "check_availability",
            "description": "Check if a given date and time slot is available for booking.",
            "parameters": {
                "type": "object",
                "properties": {
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                    "time": {"type": "string", "description": "Time in 24-hour HH:MM format"},
                },
                "required": ["date", "time"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_booking",
            "description": "Create a confirmed booking. Only call this once you have the customer's name, phone, service, date, and time, and the slot is available.",
            "parameters": {
                "type": "object",
                "properties": {
                    "customer_name": {"type": "string"},
                    "phone": {"type": "string"},
                    "service": {"type": "string"},
                    "date": {"type": "string", "description": "YYYY-MM-DD"},
                    "time": {"type": "string", "description": "24-hour HH:MM"},
                },
                "required": ["customer_name", "phone", "service", "date", "time"],
            },
        },
    },
]

TOOL_FUNCTIONS = {
    "check_availability": check_availability,
    "create_booking": create_booking,
}


def _load_services() -> dict:
    with open(os.path.join(DATA_DIR, "services.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def services_node(state: AgentState) -> AgentState:
    services_data = _load_services()
    system_prompt = SERVICES_SYSTEM_PROMPT_TEMPLATE.format(
        today=datetime.now().strftime("%Y-%m-%d"),
        services_data=json.dumps(services_data, ensure_ascii=False),
        plain_text_instruction=PLAIN_TEXT_INSTRUCTION,
        currency_instruction=CURRENCY_INSTRUCTION,
        language_instruction=LANGUAGE_INSTRUCTION[state["language"]],
    )
    
    state["response"] = generate_with_tools(
        system_prompt, state["message"], BOOKING_TOOLS, TOOL_FUNCTIONS, history=state.get("history")
    )
    return state


def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("supervisor", supervisor_node)
    graph.add_node("general", general_node)
    graph.add_node("services", services_node)

    graph.set_entry_point("supervisor")
    graph.add_conditional_edges(
        "supervisor",
        route_from_supervisor,
        {"general": "general", "services": "services"},
    )
    graph.add_edge("general", END)
    graph.add_edge("services", END)

    return graph.compile()


_compiled_graph = None


def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()
    return _compiled_graph