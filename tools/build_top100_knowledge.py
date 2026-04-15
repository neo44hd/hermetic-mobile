import csv, json, os
from datetime import datetime, timezone

IN_CSV = "data/catalog/top100_seed.csv"
OUT_DIR = "data/knowledge"

os.makedirs(OUT_DIR, exist_ok=True)
now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

BASE_INTENTS = [
    {"intent_id":"open_app","utterances":["abre {app}"],"risk":"low","steps":[{"kind":"open_app","params":{"app":"{app}"}}]},
    {"intent_id":"open_notifications_settings","utterances":["configura notificaciones de {app}"],"risk":"medium","steps":[{"kind":"open_app_settings","params":{"section":"notifications"}}]},
    {"intent_id":"share_to_app","utterances":["comparte en {app}"],"risk":"low","steps":[{"kind":"share_sheet","params":{"target":"{app}"}}]}
]

with open(IN_CSV, newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

for r in rows:
    app_name = r["name"]
    platform = r["platform"]
    app_id = r["store_id"]
    doc = {
        "app_id": app_id,
        "platform": platform,
        "name": app_name,
        "category": r["category"],
        "version": "v1-seed",
        "last_verified_at": now,
        "sources": [f"seed:{IN_CSV}"],
        "intents": []
    }
    for i in BASE_INTENTS:
        item = json.loads(json.dumps(i))
        item["utterances"] = [u.replace("{app}", app_name.lower()) for u in item["utterances"]]
        for s in item["steps"]:
            if "params" in s:
                for k,v in list(s["params"].items()):
                    if isinstance(v,str):
                        s["params"][k] = v.replace("{app}", app_name)
        doc["intents"].append(item)

    safe = app_name.lower().replace(" ","_").replace("/","_")
    out = os.path.join(OUT_DIR, f"{safe}.{platform}.json")
    with open(out, "w", encoding="utf-8") as wf:
        json.dump(doc, wf, ensure_ascii=False, indent=2)

print(f"Generated {len(rows)} knowledge files in {OUT_DIR}")
