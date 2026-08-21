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

// --- Reviews ---

export type Review = {
  review_id: string;
  customer_name: string;
  service: string | null;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
};

export type ReviewsResponse = {
  reviews: Review[];
  total_reviews: number;
  average_rating: number;
};

export type SubmitReviewPayload = {
  customer_name: string;
  rating: number;
  comment: string;
  service?: string | null;
};

export type ReviewValidationReason = 'name_required' | 'comment_required' | 'invalid_rating';

export async function getReviews(): Promise<ReviewsResponse> {
  const res = await fetch(`${API_URL}/reviews`);
  if (!res.ok) {
    throw new Error(`Fetching reviews failed: ${res.status}`);
  }
  return res.json();
}

export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<{ success: true; review: Review } | { success: false; reason: ReviewValidationReason }> {
  const res = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.status === 400 || res.status === 422) {
    const data = await res.json().catch(() => ({}));
    const reason: ReviewValidationReason = data.detail ?? 'comment_required';
    return { success: false, reason };
  }

  if (!res.ok) {
    throw new Error(`Submitting review failed: ${res.status}`);
  }

  return res.json();
}