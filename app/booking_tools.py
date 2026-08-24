"""
booking_tools.py
Plain Python functions that the LangGraph agent calls as "tools". No LLM
logic here — pure data checks against bookings.json/staff.json, so behavior
is deterministic and testable on its own.
"""
import json
import os
import re
import uuid
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
BOOKINGS_FILE = os.path.join(DATA_DIR, "bookings.json")
SALON_INFO_FILE = os.path.join(DATA_DIR, "salon_info.json")
STAFF_FILE = os.path.join(DATA_DIR, "staff.json")

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


def _load_staff() -> list:
    with open(STAFF_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["staff"]


def get_staff_list() -> dict:
    """Tool: lets the AI look up staff names and their specialties."""
    return {"staff": _load_staff()}


def _staff_names_for_category(category: str) -> list[str]:
    staff = _load_staff()
    return [s["name"] for s in staff if category in s.get("specialties", [])]


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
    return _parse_hours_range(hours[_WEEKDAY_NAMES[weekday]])


def _is_slot_taken(bookings: list, date: str, time: str, staff_name: str | None) -> bool:
    """If staff_name given, only that staff's bookings count as a conflict.
    If not given (legacy/global mode), any confirmed booking at that time blocks it."""
    for b in bookings:
        if b["date"] != date or b["time"] != time or b["status"] != "confirmed":
            continue
        if staff_name is None:
            return True
        if b.get("staff") == staff_name:
            return True
    return False


def check_availability(date: str, time: str, staff_name: str | None = None, category: str | None = None) -> dict:
    """
    date: "YYYY-MM-DD", time: "HH:MM" (24-hour)

    Three modes:
    - staff_name given: check that specific staff member's schedule.
    - category given (no staff_name): auto-find any staff with that
      specialty who is free at this slot; returns which staff got assigned.
    - neither given: legacy global check (any confirmed booking blocks the slot).

    Returns {"available": bool, "reason": str|None, "alternative_times": [..], "assigned_staff": str|None}
    """
    hours = _hours_for_date(date)
    if hours is None:
        return {"available": False, "reason": "closed_that_day", "alternative_times": [], "assigned_staff": None}

    open_time, close_time = hours
    if not (open_time <= time <= close_time):
        return {
            "available": False,
            "reason": "outside_business_hours",
            "alternative_times": _suggest_alternative_times(date, open_time, close_time, staff_name=staff_name, category=category),
            "assigned_staff": None,
        }

    bookings = _load_bookings()

    if staff_name is None and category is not None:
        candidates = _staff_names_for_category(category)
        if not candidates:
            return {"available": False, "reason": "no_staff_for_category", "alternative_times": [], "assigned_staff": None}
        for candidate in candidates:
            if not _is_slot_taken(bookings, date, time, candidate):
                return {"available": True, "reason": None, "alternative_times": [], "assigned_staff": candidate}
        return {
            "available": False,
            "reason": "slot_taken",
            "alternative_times": _suggest_alternative_times(date, open_time, close_time, exclude_time=time, category=category),
            "assigned_staff": None,
        }

    if _is_slot_taken(bookings, date, time, staff_name):
        return {
            "available": False,
            "reason": "slot_taken",
            "alternative_times": _suggest_alternative_times(date, open_time, close_time, exclude_time=time, staff_name=staff_name, category=category),
            "assigned_staff": None,
        }

    return {"available": True, "reason": None, "alternative_times": [], "assigned_staff": staff_name}


def _suggest_alternative_times(
    date: str,
    open_time: str,
    close_time: str,
    exclude_time: str | None = None,
    staff_name: str | None = None,
    category: str | None = None,
    max_suggestions: int = 3,
) -> list[str]:
    """Suggests open slots, ordered by closeness to the originally requested time (exclude_time)."""
    bookings = _load_bookings()
    candidates = [staff_name] if staff_name else (_staff_names_for_category(category) if category else [None])

    all_slots = []
    current = datetime.strptime(open_time, "%H:%M")
    end = datetime.strptime(close_time, "%H:%M")
    while current <= end:
        slot = current.strftime("%H:%M")
        if slot != exclude_time and any(not _is_slot_taken(bookings, date, slot, c) for c in candidates):
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


def create_booking(
    customer_name: str,
    phone: str,
    service: str,
    date: str,
    time: str,
    staff_name: str | None = None,
    category: str | None = None,
) -> dict:
    """Re-checks availability internally (auto-assigns staff if only category given), then persists the booking."""
    normalized_phone = _normalize_phone(phone)
    if normalized_phone is None:
        return {"success": False, "reason": "invalid_phone"}

    availability = check_availability(date, time, staff_name=staff_name, category=category)
    if not availability["available"]:
        return {
            "success": False,
            "reason": availability["reason"],
            "alternative_times": availability["alternative_times"],
        }

    assigned_staff = availability["assigned_staff"]

    bookings = _load_bookings()
    booking = {
        "booking_id": f"BK-{uuid.uuid4().hex[:6].upper()}",
        "customer_name": customer_name,
        "phone": normalized_phone,
        "service": service,
        "staff": assigned_staff,
        "date": date,
        "time": time,
        "status": "confirmed",
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    bookings.append(booking)
    _save_bookings(bookings)
    return {"success": True, "booking": booking}