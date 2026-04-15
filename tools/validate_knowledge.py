import json, glob, os
from collections import Counter

files = glob.glob("data/knowledge/*.json")
errors = []
platforms = Counter()
categories = Counter()
intents_total = 0

required = ["app_id","platform","name","category","version","last_verified_at","intents"]

for f in files:
    try:
        with open(f, "r", encoding="utf-8") as rf:
            d = json.load(rf)
        for k in required:
            if k not in d:
                errors.append(f"{f}: missing {k}")
        p = d.get("platform","unknown")
        c = d.get("category","unknown")
        platforms[p] += 1
        categories[c] += 1
        intents_total += len(d.get("intents",[]))
    except Exception as e:
        errors.append(f"{f}: {e}")

os.makedirs("reports", exist_ok=True)
with open("reports/knowledge_report.md","w",encoding="utf-8") as w:
    w.write("# Knowledge Report\n\n")
    w.write(f"- Files: {len(files)}\n")
    w.write(f"- Total intents: {intents_total}\n")
    w.write(f"- Platforms: {dict(platforms)}\n")
    w.write(f"- Categories: {dict(categories)}\n")
    w.write(f"- Errors: {len(errors)}\n\n")
    if errors:
        w.write("## Errors\n")
        for e in errors:
            w.write(f"- {e}\n")

print(f"Files={len(files)} intents={intents_total} errors={len(errors)}")
if errors:
    raise SystemExit(1)
