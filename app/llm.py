import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"])
    return _client


def _build_messages(system_prompt: str, user_prompt: str, history: list[dict] | None) -> list[dict]:
    messages = [{"role": "system", "content": system_prompt}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user_prompt})
    return messages


def generate(system_prompt: str, user_prompt: str, history: list[dict] | None = None, model: str = "openai/gpt-oss-120b") -> str:
    client = _get_client()
    response = client.chat.completions.create(
        model=model,
        messages=_build_messages(system_prompt, user_prompt, history),
    )
    return response.choices[0].message.content


def generate_with_tools(
    system_prompt: str,
    user_prompt: str,
    tools: list[dict],
    tool_functions: dict,
    history: list[dict] | None = None,
    model: str = "openai/gpt-oss-120b",
    max_tool_rounds: int = 3,
) -> str:
    """
    tools: Groq/OpenAI-format tool schemas (list of {"type": "function", "function": {...}})
    tool_functions: {"tool_name": python_callable} — actually executes the tool
    Returns the final plain-text reply after the model has used tools as needed.
    """
    client = _get_client()
    messages = _build_messages(system_prompt, user_prompt, history)

    for _ in range(max_tool_rounds):
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )
        message = response.choices[0].message

        if not message.tool_calls:
            return message.content

        messages.append(message)
        for tool_call in message.tool_calls:
            func_name = tool_call.function.name
            func_args = json.loads(tool_call.function.arguments)
            func = tool_functions.get(func_name)
            result = func(**func_args) if func else {"error": f"unknown tool {func_name}"}
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result, ensure_ascii=False),
            })

    # Fallback: force a final plain-text answer if it looped too many times
    final = client.chat.completions.create(model=model, messages=messages)
    return final.choices[0].message.content