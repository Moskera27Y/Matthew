import requests, time, json, uuid
B="https://matthew-journal.vercel.app"
# 1) upload-only-blob (201 + JSON)
blob_id=str(uuid.uuid4())[:8]
up=requests.post(f"{B}/api/upload", files={"file":(f"t{blob_id}.svg",b"<svg xmlns='http://www.w3.org/2000/svg'/>","image/svg+xml")}, data={"alt":"test","caption":"c","category":"gallery"})
print("1) /api/upload:", up.status_code, "| json keys:", list(up.json().keys()), "| url:", up.json().get("url","").startswith("https://stw0"))
blob_url=up.json().get("url") or up.json().get("src")
# 2) POST savePhotos (upsert) — simula handleAddPhoto
PID=f"photo-test-{int(time.time())}"
r=requests.post(f"{B}/api/admin/state", json={"photos":[{"id":PID,"src":blob_url,"alt":"test","caption":"c","category":"gallery"}]})
print("2) POST savePhotos:", r.status_code, r.json())
# 3) GET verify persisted
g=requests.get(f"{B}/api/admin/state", headers={"Cache-Control":"no-store"}).json()
found=[p for p in g.get("photos",[]) if p["id"]==PID]
print("3) GET after save:", len(found)==1, "| photo present:", found[0]["src"][:40] if found else "NONE")
# 4) cleanup
d=requests.delete(f"{B}/api/admin/state?table=photos&id={PID}")
print("4) DELETE cleanup:", d.status_code, d.json())
g2=requests.get(f"{B}/api/admin/state", headers={"Cache-Control":"no-store"}).json()
print("5) GET after delete:", any(p["id"]==PID for p in g2.get("photos",[])))
