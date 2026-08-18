// Talks to the FastAPI backend (main.py / app/api.py).
// Set VITE_API_URL in .env.local — see .env.local.example.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type ChatResponse = {
  response: string;
  intent: 'general' | 'services';
  language: 'en' | 'ur' | 'roman_ur';
};

export async function sendChatMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`);
  }

  return res.json();
}

export async function clearChatSession(sessionId: string): Promise<void> {
  await fetch(`${API_URL}/chat`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  });
}
