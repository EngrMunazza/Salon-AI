from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional

from app.agents import get_graph, AgentState
from app.review_tools import add_review, get_reviews

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
    MAX_HISTORY_MESSAGES = 20
    history = _sessions.get(req.session_id, [])[-MAX_HISTORY_MESSAGES:]

    state: AgentState = {"session_id": req.session_id, "message": req.message, "history": history}
    result = graph.invoke(state)

    hist = _sessions.setdefault(req.session_id, [])
    hist.append({"role": "user", "content": req.message})
    hist.append({"role": "assistant", "content": result["response"]})

    return ChatResponse(response=result["response"], intent=result["intent"], language=result["language"])


@router.delete("/chat")
def delete_chat(req: DeleteChatRequest):
    deleted = _sessions.pop(req.session_id, None) is not None
    return {"deleted": deleted}


class ReviewRequest(BaseModel):
    customer_name: str
    rating: int = Field(ge=1, le=5)
    comment: str
    service: Optional[str] = None


@router.post("/reviews")
def submit_review(req: ReviewRequest):
    result = add_review(req.customer_name, req.rating, req.comment, req.service)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["reason"])
    return result


@router.get("/reviews")
def list_reviews():
    return get_reviews()