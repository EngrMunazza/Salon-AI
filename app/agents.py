import json
import os
from typing import TypedDict, Literal, List, Dict

from langgraph.graph import StateGraph, END

from app.llm import generate

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

LANGUAGE_INSTRUCTION = {
    "en": "Reply in English.",
    "ur": "Reply in Urdu script.",
    "roman_ur": "Reply in Roman Urdu (Urdu written in English letters).",
}


class AgentState(TypedDict, total=False):
    session_id: str
    message: str
    history: List[Dict[str, str]]  

    intent: Literal["general", "services"]
    language: Literal["en", "ur", "roman_ur"]

    response: str


SUPERVISOR_SYSTEM_PROMPT = """You are a routing classifier for a beauty salon chatbot.
Given the latest customer message, output STRICT JSON only, no extra text:

{"intent": "general" | "services", "language": "en" | "ur" | "roman_ur"}

Rules:
- "general" = greetings, questions about location/address/map/timings/contact, or the customer ending the conversation (thanks, bye).
- "services" = anything about services offered, prices, discounts, promotions, packages.
- "language": "en" for English, "ur" for Urdu script, "roman_ur" for Urdu written in Roman/English letters (e.g. "aap ka time kya hai").
If unsure of intent, default to "general". If unsure of language, default to "en".
"""


def supervisor_node(state: AgentState) -> AgentState:
    raw = generate(SUPERVISOR_SYSTEM_PROMPT, state["message"])
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

{language_instruction}
"""


def _load_salon_info() -> dict:
    with open(os.path.join(DATA_DIR, "salon_info.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def general_node(state: AgentState) -> AgentState:
    salon_info = _load_salon_info()
    system_prompt = GENERAL_SYSTEM_PROMPT_TEMPLATE.format(
        salon_info=json.dumps(salon_info, ensure_ascii=False),
        language_instruction=LANGUAGE_INSTRUCTION[state["language"]],
    )
    state["response"] = generate(system_prompt, state["message"])
    return state



SERVICES_SYSTEM_PROMPT_TEMPLATE = """You are a salon assistant answering questions about
services, pricing, discounts, and promotions. Only use the data provided
below: never invent a service or price that isn't listed. If something
isn't in the data, say it's not available right now. Keep replies short
and clear, and mention relevant discounts/promotions when applicable.

Services data:
{services_data}

{language_instruction}
"""


def _load_services() -> dict:
    with open(os.path.join(DATA_DIR, "services.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def services_node(state: AgentState) -> AgentState:
    services_data = _load_services()
    system_prompt = SERVICES_SYSTEM_PROMPT_TEMPLATE.format(
        services_data=json.dumps(services_data, ensure_ascii=False),
        language_instruction=LANGUAGE_INSTRUCTION[state["language"]],
    )
    state["response"] = generate(system_prompt, state["message"])
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
