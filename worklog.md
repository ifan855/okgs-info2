# Worklog — OKGS GENESIS 2026 site

(Reconstructed this session; earlier entries were lost with the previous
container. Only durable facts kept here.)

---
Task ID: S12
Agent: Super Z (main agent)
Task: v8 re-cut — (1) fair prize showcase restored LONG and FULL-LENGTH
before the principal, (2) more Ayman Sadiq shots in the normal cut,
(3) push.

Work Log:
- Previous session's montage tooling (build_montages.py, map_window.sh,
  tile_frames.py) was wiped with the old container; rebuilt from the
  locked pipeline spec: two-pass ffmpeg (pass1 per-cut LOOK grade to
  disk, veryfast/crf14; pass2 pure xfade(fade) chain, medium/crf17,
  -filter_complex_threads 1 -threads 2, rc-lookahead=20:ref=2), LOOK =
  hqdn3d + lanczos fill-crop 1920x1080 + eq(1.06/0.015/1.12) + unsharp
  + fps=25. NO setpts anywhere (slow-mo banned for the odyssey rebuild).
- scripts/tile_frames.py recreated as OOM-safe two-stage contact sheets
  (per-frame tiny ffmpeg grabs + PIL tiling, absolute timecodes burned
  on). This box SIGKILLs large single ffmpeg graphs — keep every ffmpeg
  short-lived.
- Frame-verified the whole Odyssey source (126.9s @25) and all
  school-day sources via contact sheets. KEY FINDINGS:
  · prize showcase in source: unveiling+confetti 33.05–35.75, crowd
    37.75–39.35, stalls prize table 39.70–41.35, stage crest handover
    41.60–42.85, crests close-up 43.0–43.88, shield trophies
    43.95–45.35, winners boys 48.0–49.6, winners girls 50.0–51.5.
    v7 had skipped crests close-up + winners girls and flashed the
    rest (~7s net) — that is the "cut off" the user flagged.
  · Ayman Sadiq lives in the Odyssey source: arrival walk 12.10–13.15
    (this is the ONE shot v7's normal cut already used), stalls walk +
    fist-bump kids 88.15–90.05, seated among crowd with mic
    100.90–102.30. Stage/speaker scenes: white-panjabi 25.4–26.3,
    green-sari 28.45–29.45, the principal (pink hijab, podium)
    30.25–31.95, roar 92.15–94.45.
  · warm-greeting drone glide = greeting.mp4 0–4.5s; the source CUTS
    to the line-of-girls at ~4.5s — drone windows must end ≤4.30
    (v8 first render leaked 2 frames of the line; caught on sheets).
  · the green-pen handwriting close-up is NOT in the raw drive_dl
    sources; it comes from the school's own film-handwriting.mp4
    (Cloudinary) at 7.5–9.3. Downloaded to montage-work as src_handwriting.mp4.
- scripts/build_montages.py recreated; CUTS lists are the only edit
  point. Added pass1/pass2 subcommands so each ffmpeg is its own
  process (single-process runs get OOM-killed silently here).
- FAIR v8 (odyssey-montage-v8.mp4, 22.00s, 18 cuts, 0.42s dissolves):
  aerial stage → billboard → gate arch → model house → turbine table →
  stalls → THE PRIZE SHOWCASE FULL-LENGTH (unveiling+confetti 2.7s →
  crowd → stage crest → crests → shields → winners boys → winners
  girls; ~8.4s net vs v7's ~7s, every beat present) → speaker →
  green-sari → THE PRINCIPAL (podium take) → roar → warm-greeting
  drone glide fade-out. Same locked rules: no flash mob, no Ayman,
  no Odyssey outro drone, principal beat kept.
- NORMAL v8 (school-days-montage-v8.mp4, 18.08s, 11 cuts, 0.45s
  dissolves): greeting drone glide → corridor line → handwriting →
  art board → craft → puzzle → scout march → AYMAN ×3 (arrival walk →
  stalls + greeting the kids → seated among the crowd) → same drone
  glide fading out (loop closes on its opening shot). No flash mob,
  no crowd-roar.
- Renders verified by contact sheets + fixed-region frame grids
  (speakers/principal visible after dissolve squeeze fix; Ayman walk
  visible; both tails clean).
- Posters extracted: poster-odyssey-v8.jpg (confetti moment, render
  t=7.9), poster-school-days-v8.jpg (drone glide, render t=1.6).
- BLOCKER: Cloudinary API key/secret are NOT in this environment (old
  container lost them; env/.env/git/stash/dev.log searched). Unsigned
  uploads are disabled on cloud tt7oyjd1 ("Upload preset must be
  whitelisted"). scripts/upload_cloudinary.py is ready (signed upload,
  reads CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET from env or
  /home/z/my-project/.cloudinary-creds).
- films.ts intentionally NOT bumped yet: pushing -v8 URLs before the
  upload would 404 the hero loops. Bump is one sed once uploads land:
  v7→v8 in the 4 consts + comment refresh.

Stage Summary:
- Deliverables (verified, in upload/montage-work/out/):
  odyssey-montage-v8.mp4 (22.00s), school-days-montage-v8.mp4 (18.08s),
  poster-odyssey-v8.jpg, poster-school-days-v8.jpg.
- Pending user input: Cloudinary API key/secret → then upload 4 files
  (okgs/film/odyssey-montage-v8, okgs/film/school-days-montage-v8,
  okgs/film/poster-odyssey-v8 as image, okgs/film/poster-school-days-v8
  as image), bump films.ts v7→v8, commit, push.
- Pipeline is now durable: builder + tile tool + uploader live in
  scripts/ (committed).
