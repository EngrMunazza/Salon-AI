import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

_client: Groq | None = None


def _get_client() -> Groq:
    global _client

    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"])

    return _client


def generate(
    system_prompt: str,
    user_prompt: str,
    model: str = "openai/gpt-oss-20b"
) -> str:
    client = _get_client()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    return response.choices[0].message.content