#!/usr/bin/env python3
"""
build_montages.py — the Film Desk two-pass builder (v8).

   · fair   = odyssey-montage-v8      · normal = school-days-montage-v8

Pipeline (this box OOMs on big single graphs, so everything is two-pass):
  pass 1  — every cut pre-decoded to disk with the LOOK grade, 1.0x speed
            (setpts slow-mo is BANNED for the odyssey rebuild), veryfast/crf14
  pass 2  — pure xfade(fade) assembly, medium/crf17, single filter thread

The CUTS lists below are the only edit point. Timestamps are absolute
seconds in the source files and were verified frame-by-frame against
contact sheets (scripts/tile_frames.py).
"""
import os, subprocess, sys, json, time

WORK = "/home/z/my-project/upload/montage-work"
P1 = os.path.join(WORK, "pass1")
OUT = os.path.join(WORK, "out")
TILES = os.path.join(WORK, "tiles")

DRIVE = "/home/z/my-project/upload/drive_dl"
def _gl(pattern):
    import glob as g
    hits = sorted(g.glob(os.path.join(DRIVE, pattern)))
    if not hits:
        sys.exit("missing source: " + pattern)
    return hits[0]

SRC = {
    # the fair film (OKGS Odyssey 2023 highlights, 126.9s @25)
    "ody": _gl("19K*.mp4"),
    # the school-day film (A simple greeting, a warm smile, 221.1s @29.97)
    "grt": os.path.join(DRIVE, "greeting.mp4"),
    # handwriting hour (already-cut school film from Cloudinary, 34.5s)
    "hwf": os.path.join(WORK, "src_handwriting.mp4"),
    # art boards class (mukto borde, 44.6s)
    "muk": _gl("mukto borde*.mkv"),
    # craft period (kle diye, 33.7s)
    "kle": _gl("kle diye*.mkv"),
    # puzzle hour (1080x1080, 22.6s)
    "puz": _gl("Skillful Puzzle*.mp4"),
    # scout display 26 March (336.4s)
    "sct": _gl("skaut . display*.mkv"),
}

# LOOK grade — locked at S9. 1.0x speed everywhere; NO setpts anywhere.
LOOK = (
    "hqdn3d=1.5:1.5:3:3,"
    "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,"
    "crop=1920:1080,"
    "eq=contrast=1.06:brightness=0.015:saturation=1.12,"
    "unsharp=5:5:0.55,"
    "fps=25,setsar=1,format=yuv420p"
)

# --------------------------------------------------------------- cut lists
# (src, t_in, t_out, label) — v5 rhythm: 1.0x, holds ~0.8–2.7s, dissolves
# 0.42–0.45s.  Fair showcase restored LONG and FULL-LENGTH (every beat:
# unveiling+confetti → crowd → stage crest → crests → shields → winners
# boys → winners girls) before the principal; normal cut gets THREE
# Ayman Sadiq beats (arrival walk → stalls+kids → seated among crowd).

FAIR = [
    ("ody", 7.75,  9.30,  "aerial over the fair stage"),
    ("ody", 9.90,  11.30, "science fair billboard"),
    ("ody", 17.75, 19.15, "the gate arch"),
    ("ody", 21.55, 22.85, "a model house"),
    ("ody", 23.85, 25.15, "the turbine table"),
    ("ody", 39.70, 41.35, "the stalls"),
    # THE PRIZE SHOWCASE — long, full-length
    ("ody", 33.05, 35.75, "THE UNVEILING + confetti"),
    ("ody", 37.75, 39.35, "the crowd"),
    ("ody", 41.60, 42.75, "prize giving on stage"),
    ("ody", 43.00, 43.88, "the crests"),
    ("ody", 43.95, 45.35, "the trophies"),
    ("ody", 48.00, 49.60, "the winners (boys)"),
    ("ody", 50.00, 51.50, "the winners (girls)"),
    # the principal's take + speakers
    ("ody", 25.35, 26.30, "speaker"),
    ("ody", 28.45, 29.45, "speaker (green sari)"),
    ("ody", 30.25, 31.95, "THE PRINCIPAL"),
    ("ody", 92.15, 94.45, "the roar"),
    # warm-greeting drone glide, fading out (source cuts to the next
    # scene at ~4.5s — stay clear of it)
    ("grt", 0.55,  4.30,  "the drone glide (fade out)"),
]

NORMAL = [
    ("grt", 0.40,  4.00,  "the school drone gliding in"),
    ("grt", 20.80, 22.40, "the corridor line"),
    ("hwf", 7.50,  9.30,  "handwriting hour"),
    ("muk", 13.20, 14.80, "the art board"),
    ("kle", 7.90,  9.60,  "craft period"),
    ("puz", 7.50,  10.10, "the puzzle hour"),
    ("sct", 32.10, 34.00, "the scout march"),
    # Ayman Sadiq — three beats
    ("ody", 12.10, 13.15, "AYMAN — arrival walk"),
    ("ody", 88.15, 90.05, "AYMAN — the stalls, greeting the kids"),
    ("ody", 100.90, 102.30, "AYMAN — seated among the crowd"),
    # loop closes on the shot it opened with
    ("grt", 0.90,  4.30,  "the drone glide again (fade out)"),
]

MONTAGES = {
    "fair":   {"cuts": FAIR,   "xd": 0.42, "out": "odyssey-montage-v8.mp4"},
    "normal": {"cuts": NORMAL, "xd": 0.45, "out": "school-days-montage-v8.mp4"},
}

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(" ".join(cmd)[:400])
        sys.exit("FAILED:\n" + r.stderr[-1600:])

def pass1(name, cuts):
    os.makedirs(P1, exist_ok=True)
    files = []
    for i, (src, a, b, label) in enumerate(cuts):
        f = os.path.join(P1, f"{name}_{i:02d}.mp4")
        files.append(f)
        if os.path.exists(f) and os.path.getsize(f) > 100_000:
            print(f"  [{name}] cut {i:02d} cached ({label})")
            continue
        t0 = time.time()
        run(["ffmpeg", "-y", "-v", "error", "-threads", "2",
             "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", SRC[src],
             "-vf", LOOK, "-an",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "14",
             f])
        print(f"  [{name}] cut {i:02d} {label}: {b - a:.2f}s "
              f"({time.time() - t0:.1f}s)")
    return files

def pass2(name, cfg, files):
    os.makedirs(OUT, exist_ok=True)
    cuts = cfg["cuts"]
    xd = cfg["xd"]
    n = len(files)
    if n != len(cuts):
        sys.exit("pass1 file count mismatch")
    total_raw = sum(b - a for _, a, b, _ in cuts)
    total = total_raw - xd * (n - 1)

    inputs = []
    for f in files:
        inputs += ["-i", f]

    fc = []
    # xfade chain: offset_k = sum(d_i, i<k) - k*xd
    elapsed = 0.0
    prev = "[0:v]"
    for k in range(1, n):
        elapsed += (cuts[k - 1][2] - cuts[k - 1][1])
        off = elapsed - k * xd
        lab = f"[v{k}]" if k < n - 1 else "[vx]"
        fc.append(f"{prev}[{k}:v]xfade=transition=fade:duration={xd}:"
                  f"offset={off:.3f}{lab}")
        prev = lab
    fc.append(f"[vx]fade=t=in:st=0:d=0.45,"
              f"fade=t=out:st={total - 0.7:.3f}:d=0.7[vout]")

    out = os.path.join(OUT, cfg["out"])
    t0 = time.time()
    run(["ffmpeg", "-y", "-v", "error", *inputs,
         "-filter_complex", ";".join(fc), "-map", "[vout]", "-an",
         "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-filter_complex_threads", "1", "-threads", "2",
         "-x264-params", "rc-lookahead=20:ref=2",
         out])
    print(f"  [{name}] assembled {total:.2f}s in {time.time() - t0:.1f}s -> {out}")
    return out

def main():
    # usage:
    #   build_montages.py both          — everything (one process; may OOM)
    #   build_montages.py pass1 NAME    — render NAME's cut list only
    #   build_montages.py pass2 NAME    — assemble NAME from cached pass1 cuts
    #   build_montages.py NAME          — pass1+pass2 for one montage
    argv = sys.argv[1:]
    which = argv[0] if argv else "both"
    if which == "pass1":
        name = argv[1]
        pass1(name, MONTAGES[name]["cuts"])
        return
    if which == "pass2":
        name = argv[1]
        cfg = MONTAGES[name]
        files = [os.path.join(P1, f"{name}_{i:02d}.mp4")
                 for i in range(len(cfg["cuts"]))]
        for f in files:
            if not (os.path.exists(f) and os.path.getsize(f) > 100_000):
                sys.exit("missing pass1 cut: " + f)
        pass2(name, cfg, files)
        return
    names = list(MONTAGES) if which == "both" else [which]
    results = {}
    for name in names:
        cfg = MONTAGES[name]
        print(f"== {name} ({len(cfg['cuts'])} cuts) ==", flush=True)
        files = pass1(name, cfg["cuts"])
        results[name] = pass2(name, cfg, files)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
