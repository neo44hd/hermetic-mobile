from dataclasses import dataclass
from typing import List, Dict
from datetime import datetime

PRIORITY_CONTACTS = {"mama","papá","boss","jefe","urgente"}

@dataclass
class NotificationEvent:
    package: str
    title: str
    text: str
    category: str # msg/call/social/system
    hour: int

def score(event: NotificationEvent) -> int:
    s = 0
    txt = f"{event.title} {event.text}".lower()
    if any(k in txt for k in PRIORITY_CONTACTS): s += 4
    if event.category == "call": s += 3
    if "urgente" in txt: s += 3
    if 23 <= event.hour or event.hour < 8: s -= 2
    return s

def suggest(event: NotificationEvent) -> List[Dict]:
    s = score(event)
    actions = [{"action":"open_app","label":"Abrir app","priority":2}]
    if event.category in ("msg","social"):
        actions += [
            {"action":"reply_later_15m","label":"Responder en 15 min","priority":3},
            {"action":"mute_1h","label":"Silenciar 1h","priority":2},
        ]
    if event.category == "call":
        actions += [{"action":"call_back","label":"Devolver llamada","priority":3}]
    if s >= 5:
        actions += [{"action":"mark_important","label":"Marcar importante","priority":4}]
    # top 3 por prioridad
    actions = sorted(actions, key=lambda x: x["priority"], reverse=True)[:3]
    return actions

if __name__ == "__main__":
    ev = NotificationEvent("com.whatsapp","Mamá","llámame urgente","msg",datetime.now().hour)
    print(suggest(ev))
