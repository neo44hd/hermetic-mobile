import csv
from pathlib import Path

seed = Path("data/catalog/top100_seed.csv")
out = Path("data/catalog/top100_full.csv")

rows = []
with seed.open(newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

# Catálogo extendido base (puedes editar luego)
android_extra = [
    ("YouTube","com.google.android.youtube","media"),
    ("Facebook","com.facebook.katana","social"),
    ("TikTok","com.zhiliaoapp.musically","social"),
    ("Spotify","com.spotify.music","media"),
    ("Chrome","com.android.chrome","browser"),
    ("Google Drive","com.google.android.apps.docs","productivity"),
    ("Google Photos","com.google.android.apps.photos","media"),
    ("Google Calendar","com.google.android.calendar","productivity"),
    ("Google Meet","com.google.android.apps.tachyon","communication"),
    ("Google Translate","com.google.android.apps.translate","utility"),
]
ios_extra = [
    ("YouTube","544007664","media"),
    ("Facebook","284882215","social"),
    ("TikTok","835599320","social"),
    ("Spotify","324684580","media"),
    ("Chrome","535886823","browser"),
    ("Google Drive","507874739","productivity"),
    ("Google Photos","962194608","media"),
    ("Google Calendar","909319292","productivity"),
    ("Google Meet","1013231476","communication"),
    ("Google Translate","414706506","utility"),
]

for i,(name,sid,cat) in enumerate(android_extra, start=6):
    rows.append({"platform":"android","rank":str(i),"name":name,"store_id":sid,"category":cat,"priority":"4"})
for i,(name,sid,cat) in enumerate(ios_extra, start=6):
    rows.append({"platform":"ios","rank":str(i),"name":name,"store_id":sid,"category":cat,"priority":"4"})

# duplicar patrón hasta 100 por plataforma como placeholder estructurado
def fill(platform):
    current = [r for r in rows if r["platform"] == platform]
    n = len(current)
    idx = 1
    while n < 100:
        base = current[(idx-1) % len(current)]
        n += 1
        rows.append({
            "platform": platform,
            "rank": str(n),
            "name": f'{base["name"]} Variant {n}',
            "store_id": f'{base["store_id"]}.{n}' if platform=="android" else f'{base["store_id"]}{n}',
            "category": base["category"],
            "priority": "3"
        })
        idx += 1

fill("android")
fill("ios")

with out.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["platform","rank","name","store_id","category","priority"])
    w.writeheader()
    for r in rows:
        w.writerow(r)

print(f"Wrote {out} with {len(rows)} rows")
