from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List

from app.agents import get_graph, AgentState

router = APIRouter()

_sessions: Dict[str, List[dict]] = {}


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
    intent: str
    language: str


class DeleteChatRequest(BaseModel):
    session_id: str


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    graph = get_graph()
    history = _sessions.get(req.session_id, [])

    state: AgentState = {
        "session_id": req.session_id,
        "message": req.message,
        "history": history,
    }
    result = graph.invoke(state)

    history.append({"role": "user", "content": req.message})
    history.append({"role": "assistant", "content": result["response"]})
    _sessions[req.session_id] = history

    return ChatResponse(
        response=result["response"],
        intent=result["intent"],
        language=result["language"],
    )


@router.delete("/chat")
def delete_chat(req: DeleteChatRequest):
    deleted = _sessions.pop(req.session_id, None) is not None
    return {"deleted": deleted}
