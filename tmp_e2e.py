import requests, time, re
B="https://matthew-journal.vercel.app"
time.sleep(20)

g=requests.get(f"{B}/api/admin/state", headers={"Cache-Control":"no-store"})
print("=== /api/admin/state ===")
print("HTTP:", g.status_code, "| source:", g.json().get("source"), "| error:", g.json().get("error"))
d=g.json()
print("milestones:", len(d.get("milestones",[])), [m["title"][:15] for m in d.get("milestones",[])])
print("brothers:", len(d.get("brothers",[])), "| family:", len(d.get("family",[])), "| photos:", len(d.get("photos",[])))
print("event:", d.get("event",{}).get("title","?"))

inv=requests.get(f"{B}/invite/matthew-baptism", headers={"Cache-Control":"no-store","User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119 OPR/105"})
print("\n=== /invite/matthew-baptism (SSR server-side) ===")
print("HTTP:", inv.status_code, "| 'Bautizo de Matthew':", "Bautizo de Matthew" in inv.text, "| 'no válida':", "no válida" in inv.text)
print("has sobre/envelope:", "envelope" in inv.text.lower() or "sobre" in inv.text.lower())

up=requests.post(f"{B}/api/upload", files={"file":("t.svg",b"<svg xmlns='http://www.w3.org/2000/svg'/>","image/svg+xml")}, data={"alt":"t","caption":"c","category":"gallery"})
print("\n=== /api/upload (Blob-only) ===")
print("HTTP:", up.status_code, "| blob-url:", up.json().get("src","").startswith("https://stw0"))

chunks=sorted(set(re.findall(r'/(_next/static/immutable/chunks/[^"]+\.js)', requests.get(f"{B}/",headers={"Accept-Encoding":"identity"}).text)))
print("\n=== chunk checks (ageStr fix = busca '?' literal) ===")
q='"?"'
for c in chunks:
    body=requests.get(f"{B}/{c[1:]}", headers={"Accept-Encoding":"identity"}).text
    name=c.split('/')[-1]
    print("  %s | ageStr?=%s | size=%d" % (name, q in body, len(body)))
