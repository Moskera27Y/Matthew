import requests, time, re
B="https://matthew-journal.vercel.app"
ops=[
  ("UA-Opera","Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119 OPR/105"),
  ("UA-Mobile","Mozilla/5.0 (Linux; Android 13) Chrome/119 Mobile"),
]
for ua,label in ops:
    print(f"\n=== {label} ===")
    # GET state
    g=requests.get(f"{B}/api/admin/state", headers={"Cache-Control":"no-store","User-Agent":ua})
    d=g.json()
    print("  GET state: HTTP",g.status_code,"| source:",d.get("source"),"| error:",d.get("error"))
    print("  milestones:",len(d.get("milestones",[])),[m["title"][:12] for m in d.get("milestones",[])])
    print("  brothers:",len(d.get("brothers",[])),"family:",len(d.get("family",[])),"photos:",len(d.get("photos",[])))
    # invite SSR
    inv=requests.get(f"{B}/invite/matthew-baptism", headers={"Cache-Control":"no-store","User-Agent":ua})
    print("  /invite/matthew-baptism: HTTP",inv.status_code,"| 'Bautizo de Matthew':","Bautizo de Matthew" in inv.text,"| len:",len(inv.text))

# upload-only-blob
up=requests.post(f"{B}/api/upload", files={"file":("x.svg",b"<svg/>","image/svg+xml")}, data={"alt":"t"})
print("\n=== /api/upload ===")
print("  HTTP:",up.status_code,"| blob-url:",up.json().get("src","").startswith("https://stw0"))

# homepage HTML loads (no corrupt chunk)
hp=requests.get(f"{B}/", headers={"Accept-Encoding":"identity","User-Agent":ops[0][1]})
print("\n=== homepage ===")
print("  HTTP:",hp.status_code,"| has title:", "Matthew" in hp.text)
print("  chunks:", len(re.findall(r'/(_next/static/immutable/chunks/[^"]+\.js)', hp.text)))
