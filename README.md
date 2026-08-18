## Structure

```
agents.py          The whole agentic AI part: state, all 3 nodes, graph
                    supervisor -> (general | services) -> END
api.py              Both endpoints: POST /chat, DELETE /chat
llm.py               Single Groq wrapper
main.py              FastAPI entrypoint, mounts api.py
data/
  salon_info.json    Edit this: address, map_url, phone, timings
  services.json       Edit this: your real services/prices/discounts
requirements.txt
.env.example
```

## Run locally

```bash
pip install -r requirements.txt
cp .env.example .env   # then fill in GROQ_API_KEY
uvicorn main:app --reload
```

## Test it

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-1", "message": "what are your timings?"}'

curl -X DELETE http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-1"}'
```

## Before showing this to anyone

- Replace the placeholder data in `data/salon_info.json` and
  `data/services.json` with real salon details.
- Restrict CORS `allow_origins` in `main.py` to the real frontend domain
  instead of `"*"`.

## Explicitly out of scope (do not add without supervisor approval)

Booking/appointments, WhatsApp integration, Supabase/database persistence,
Pinecone/RAG, human-in-the-loop review, multi-page frontend.
