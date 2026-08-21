import json
import os
import uuid
from datetime import datetime

BASE_DIR = os.path.dirname(__file__)
REVIEWS_FILE = os.path.join(BASE_DIR, "data", "reviews.json")

MIN_RATING = 1
MAX_RATING = 5


def _load_reviews() -> list:
    with open(REVIEWS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["reviews"]


def _save_reviews(reviews: list) -> None:
    with open(REVIEWS_FILE, "w", encoding="utf-8") as f:
        json.dump({"reviews": reviews}, f, ensure_ascii=False, indent=2)


def add_review(customer_name: str, rating: int, comment: str, service: str | None = None) -> dict:
    customer_name = customer_name.strip()
    comment = comment.strip()

    if not customer_name:
        return {"success": False, "reason": "name_required"}
    if not comment:
        return {"success": False, "reason": "comment_required"}
    if not isinstance(rating, int) or not (MIN_RATING <= rating <= MAX_RATING):
        return {"success": False, "reason": "invalid_rating"}

    reviews = _load_reviews()
    review = {
        "review_id": f"RV-{uuid.uuid4().hex[:6].upper()}",
        "customer_name": customer_name,
        "service": service,
        "rating": rating,
        "comment": comment,
        "approved": True,  # auto-approved for now; field kept for future moderation
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    reviews.append(review)
    _save_reviews(reviews)
    return {"success": True, "review": review}


def get_reviews() -> dict:
    """Returns only approved reviews, newest first, plus an average rating."""
    reviews = [r for r in _load_reviews() if r.get("approved", True)]
    reviews.sort(key=lambda r: r["created_at"], reverse=True)

    total = len(reviews)
    average = round(sum(r["rating"] for r in reviews) / total, 1) if total else 0.0

    return {"reviews": reviews, "total_reviews": total, "average_rating": average}