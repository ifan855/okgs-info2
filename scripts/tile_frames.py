#!/usr/bin/env python3
"""
tile_frames.py — contact-sheet frame verifier for the montage desk.

OOM-safe two-stage design (this box SIGKILLs big single ffmpeg graphs):
  1. grab N frames across a window as small JPEGs (one tiny ffmpeg per frame)
  2. tile them with PIL into one contact sheet, absolute timecode drawn on
     each tile.

Usage:
  tile_frames.py INPUT START DURATION [--step S] [--cols C] [--out PNG]
"""
import argparse, os, subprocess, sys, glob

WORK = "/home/z/my-project/upload/montage-work/tiles"

def probe_dur(inp):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", inp], capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("start", type=float)
    ap.add_argument("duration", type=float)
    ap.add_argument("--step", type=float, default=None)
    ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--tw", type=int, default=440, help="tile width")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()

    from PIL import Image, ImageDraw

    dur_total = probe_dur(a.input)
    if dur_total is None:
        sys.exit("ffprobe failed on " + a.input)
    start = max(0.0, a.start)
    end = min(dur_total, a.start + a.duration)
    dur = end - start
    if dur <= 0:
        sys.exit("empty window")

    step = a.step if a.step else dur / 12.0
    stamps = []
    t = start
    while t <= end + 1e-6:
        stamps.append(t)
        t += step
    if len(stamps) > 60:
        stamps = stamps[:60]

    tag = os.path.basename(a.out or "sheet").rsplit(".", 1)[0]
    tmp = os.path.join(WORK, f"_f_{tag}")
    os.makedirs(tmp, exist_ok=True)
    for f in glob.glob(tmp + "/*.jpg"):
        os.remove(f)

    # stage 1 — tiny per-frame grabs (memory-light)
    for i, t in enumerate(stamps):
        cmd = ["ffmpeg", "-y", "-v", "error", "-threads", "1",
               "-ss", f"{t:.3f}", "-i", a.input, "-frames:v", "1",
               "-vf", f"scale={a.tw}:-2", "-q:v", "4",
               os.path.join(tmp, f"{i:03d}.jpg")]
        r = subprocess.run(cmd)
        if r.returncode != 0:
            print(f"  ! frame {t:.2f}s failed", file=sys.stderr)

    # stage 2 — PIL montage with absolute timecodes
    files = sorted(glob.glob(tmp + "/*.jpg"))
    if not files:
        sys.exit("no frames grabbed")
    im0 = Image.open(files[0])
    tw, th = im0.size
    cols = a.cols
    rows = (len(files) + cols - 1) // cols
    PAD, BAR = 4, 30
    sheet = Image.new("RGB", (cols * (tw + PAD) + PAD, rows * (th + BAR + PAD) + PAD), (10, 10, 14))
    d = ImageDraw.Draw(sheet)
    for i, fp in enumerate(files):
        im = Image.open(fp)
        x = PAD + (i % cols) * (tw + PAD)
        y = PAD + (i // cols) * (th + BAR + PAD)
        sheet.paste(im, (x, y))
        d.text((x + 6, y + th + 6), f"{stamps[i]:7.2f}s", fill=(255, 255, 90))
    out = a.out or os.path.join(WORK, f"sheet_{start:08.2f}.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    sheet.save(out)
    print(f"sheet: {out}  (window {start:.2f}-{end:.2f}s, step {step:.2f}s, {len(files)} tiles)")

if __name__ == "__main__":
    main()
