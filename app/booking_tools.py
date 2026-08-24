import json
import os
import re
import uuid
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
BOOKINGS_FILE = os.path.join(DATA_DIR, "bookings.json")
SALON_INFO_FILE = os.path.join(DATA_DIR, "salon_info.json")

SLOT_STEP_MINUTES = 30  # granularity for suggesting alternative times


def _load_bookings() -> list:
    with open(BOOKINGS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["bookings"]


def _save_bookings(bookings: list) -> None:
    with open(BOOKINGS_FILE, "w", encoding="utf-8") as f:
        json.dump({"bookings": bookings}, f, ensure_ascii=False, indent=2)


def _load_salon_hours() -> dict:
    with open(SALON_INFO_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["timings"]


def _parse_hours_range(hours_str: str) -> tuple[str, str] | None:
    """'11:00 AM - 8:00 PM' -> ('11:00', '20:00'). Returns None if closed."""
    if hours_str.strip().lower() == "closed":
        return None
    start_str, end_str = [p.strip() for p in hours_str.split("-")]
    start = datetime.strptime(start_str, "%I:%M %p").strftime("%H:%M")
    end = datetime.strptime(end_str, "%I:%M %p").strftime("%H:%M")
    return start, end


_WEEKDAY_NAMES = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def _hours_for_date(date_str: str) -> tuple[str, str] | None:
    weekday = datetime.strptime(date_str, "%Y-%m-%d").weekday()  # 0=Mon ... 6=Sun
    hours = _load_salon_hours()
    day_key = _WEEKDAY_NAMES[weekday]
    return _parse_hours_range(hours[day_key])

def check_availability(date: str, time: str) -> dict:
    """
    date: "YYYY-MM-DD", time: "HH:MM" (24-hour)
    Returns {"available": bool, "reason": str|None, "alternative_times": [..]}
    """
    hours = _hours_for_date(date)
    if hours is None:
        return {"available": False, "reason": "closed_that_day", "alternative_times": []}

    open_time, close_time = hours
    if not (open_time <= time <= close_time):
        return {
            "available": False,
            "reason": "outside_business_hours",
            "alternative_times": _suggest_alternative_times(date, open_time, close_time),
        }

    bookings = _load_bookings()
    is_taken = any(
        b["date"] == date and b["time"] == time and b["status"] == "confirmed"
        for b in bookings
    )
    if is_taken:
        return {
            "available": False,
            "reason": "slot_taken",
            "alternative_times": _suggest_alternative_times(date, open_time, close_time, exclude_time=time),
        }

    return {"available": True, "reason": None, "alternative_times": []}


def _suggest_alternative_times(date: str, open_time: str, close_time: str, exclude_time: str | None = None, max_suggestions: int = 3) -> list[str]:
    """Suggests open slots, ordered by closeness to the originally requested time (exclude_time)
    when given, so a customer asking for 2 PM gets nearby times, not 11 AM."""
    bookings = _load_bookings()
    taken = {b["time"] for b in bookings if b["date"] == date and b["status"] == "confirmed"}

    all_slots = []
    current = datetime.strptime(open_time, "%H:%M")
    end = datetime.strptime(close_time, "%H:%M")
    while current <= end:
        slot = current.strftime("%H:%M")
        if slot not in taken and slot != exclude_time:
            all_slots.append(slot)
        current += timedelta(minutes=SLOT_STEP_MINUTES)

    if exclude_time:
        reference = datetime.strptime(exclude_time, "%H:%M")
        all_slots.sort(key=lambda s: abs((datetime.strptime(s, "%H:%M") - reference).total_seconds()))

    return all_slots[:max_suggestions]


def _normalize_phone(phone: str) -> str | None:
    """
    Accepts Pakistani mobile numbers in common formats:
    03001234567, +923001234567, 923001234567, with or without spaces/dashes.
    Returns a normalized "03XXXXXXXXX" string, or None if invalid.
    """
    digits = re.sub(r"\D", "", phone)  # strip everything except digits

    if digits.startswith("92") and len(digits) == 12:
        digits = "0" + digits[2:]

    if len(digits) == 11 and digits.startswith("03"):
        return digits

    return None


def create_booking(customer_name: str, phone: str, service: str, date: str, time: str) -> dict:
    """Assumes availability was already checked. Creates and persists the booking."""
    normalized_phone = _normalize_phone(phone)
    if normalized_phone is None:
        return {"success": False, "reason": "invalid_phone"}

    availability = check_availability(date, time)
    if not availability["available"]:
        return {"success": False, "reason": availability["reason"], "alternative_times": availability["alternative_times"]}

    bookings = _load_bookings()
    booking = {
        "booking_id": f"BK-{uuid.uuid4().hex[:6].upper()}",
        "customer_name": customer_name,
        "phone": normalized_phone,
        "service": service,
        "date": date,
        "time": time,
        "status": "confirmed",
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    bookings.append(booking)
    _save_bookings(bookings)
    return {"success": True, "booking": booking}