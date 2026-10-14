#!/usr/bin/env python3
"""
upload_cloudinary.py — signed uploads to the tt7oyjd1 cloud (Film Desk).

Credentials come from env CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
(or a file passed via --creds KEY=SECRET).

Usage:
  upload_cloudinary.py FILE public_id [--resource video|image]
"""
import hashlib, os, sys, time, json, urllib.request, urllib.parse, uuid

CLOUD = "tt7oyjd1"

def load_creds():
    ak = os.environ.get("CLOUDINARY_API_KEY")
    sk = os.environ.get("CLOUDINARY_API_SECRET")
    if ak and sk:
        return ak, sk
    for p in ("/home/z/my-project/.cloudinary-creds",
              os.path.expanduser("~/.cloudinary-creds")):
        if os.path.exists(p):
            kv = dict(l.split("=", 1) for l in open(p).read().split() if "=" in l)
            return kv.get("CLOUDINARY_API_KEY"), kv.get("CLOUDINARY_API_SECRET")
    return None, None

def sign(params, secret):
    flat = "&".join(f"{k}={params[k]}" for k in sorted(params)) + secret
    return hashlib.sha1(flat.encode()).hexdigest()

def upload(path, public_id, resource="video", ak=None, sk=None):
    params = {
        "public_id": public_id,
        "timestamp": str(int(time.time())),
        "use_filename": "false",
    }
    params["signature"] = sign(params, sk)
    params["api_key"] = ak
    boundary = "----okgs" + uuid.uuid4().hex
    body = b""
    for k, v in params.items():
        body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
             f"filename=\"{os.path.basename(path)}\"\r\n"
             f"Content-Type: application/octet-stream\r\n\r\n").encode()
    with open(path, "rb") as f:
        body += f.read()
    body += f"\r\n--{boundary}--\r\n".encode()
    url = f"https://api.cloudinary.com/v1_1/{CLOUD}/{resource}/upload"
    req = urllib.request.Request(url, data=body, headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}"})
    with urllib.request.urlopen(req, timeout=900) as r:
        return json.loads(r.read())

def main():
    args = sys.argv[1:]
    path = args[0]
    public_id = args[1]
    resource = "video"
    if "--resource" in args:
        resource = args[args.index("--resource") + 1]
    ak, sk = load_creds()
    if not (ak and sk):
        sys.exit("NO CREDS: set CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET "
                 "(env or /home/z/my-project/.cloudinary-creds)")
    print(f"upload {path} -> {public_id} ({resource}) ...", flush=True)
    res = upload(path, public_id, resource, ak, sk)
    print(json.dumps({k: res.get(k) for k in
                      ("public_id", "duration", "bytes", "version")}, indent=2))

if __name__ == "__main__":
    main()
