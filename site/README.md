# OKGS PRESS — the Omar K.G. School press-media site
### One codebase · two editions: **OKGS GENESIS 2026** (science fair) ⇄ **OKGS PRESS** (normal editorial)

The official press-media & newsroom website of **Omar Kindergarten School & Omar Garden
Academy** (Omar K.G. School), Kalai Sadar, Joypurhat, Bangladesh — with a built-in
**admin studio** that toggles the whole site between **Science Fair mode** (deep-space
Genesis theme, arenas, routine, registration) and **Normal mode** (premium editorial
paper theme with the same newsroom, minus the fair).

Built with **Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion**.

---

## ✦ The two editions

| | 🌌 Science Fair mode | 📰 Normal mode |
|---|---|---|
| Theme | Deep-space cosmic (void / gold / nova) | Warm paper editorial (ink / amber — palette of the school's real info hub) |
| Hero | `OKGS GENESIS 2026 — Exploring the Universe of Science` cinematic hero + countdown | Editorial masthead with today's lead story in serif (Newsreader) |
| Extra content | 7 arena pages, 2-day routine, prizes, rules, FAQ, registration | Admission & school notices, Clubs Open Week recap, academic stories |
| Shared | Wire ticker, front-page stories, newsroom archive, article pages, 5 club pages, gallery (with real campus photos), about, contact | same |

The mode is stored server-side (`/api/settings`), mirrored to `localStorage` for an
instant first paint, and switched by the **Press Studio** admin panel at `#/admin`.

## ✦ Pages (hash-routed, all under `/`)

| Route | Page |
|---|---|
| `#/` | Front page — edition-aware hero, wire ticker, latest dispatches, arenas (fair), clubs, stats, press desk |
| `#/press` | **The Newsroom** — searchable archive with category filters |
| `#/press/[slug]` | **Article** — serif editorial layout, drop cap, pull quote, related stories |
| `#/genesis` | The Science Fair (fair mode only) — 7 arenas w/ rules, routine tabs, prizes, rules, FAQ, register panel |
| `#/clubs` | Clubs hub — the council of five (real data from okgs.info club info hubs) |
| `#/clubs/[alssm·aypg·alpcg·aygsm·artds]` | Club pages — real taglines, mottos, advisers, meeting days/times, venues, emails, club colours & official banners |
| `#/gallery` | Visual archive — real campus photos + club banners + cosmic concept art, filters + lightbox |
| `#/about` | School story, real campus photography, official crest, faculty, facilities, links |
| `#/register` | Genesis registration (fair mode only) — posts to the backend |
| `#/contact` | Press desk — phones, email, campus, socials, tip line (posts to the backend) |
| `#/admin` | **The Press Studio** — edition toggle, story CRUD, submissions inbox |

## ✦ The backend (mock ⇄ Neon serverless Postgres)

The app ships with a **mock backend** so everything works out of the box:

- `src/lib/server/seed.ts` — 14 seeded press stories (scoped fair / normal / both), site settings, sample inbox items
- `src/lib/server/store.ts` — a unified CRUD store with two interchangeable drivers:
  - **mock (default)** — a seeded in-memory store (survives hot reloads)
  - **neon** — real serverless Postgres, activated purely by environment variable

### Going live on Neon

Set any one of these (Vite-style names included) and restart:

```bash
NEON_DATABASE_URL="postgres://…@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
# or VITE_NEON_DATABASE_URL / DATABASE_URL (postgres:// only)
```

No extra dependency is required — the adapter speaks Neon's **serverless HTTP SQL
protocol** over plain `fetch` (same wire format as `@neondatabase/serverless`).
On first request it creates `posts`, `settings` and `submissions` tables and seeds
them automatically. If the connection ever fails, the store degrades to the mock
data so the site never breaks.

### API surface

| Endpoint | Methods | Auth | Purpose |
|---|---|---|---|
| `/api/posts` | GET, POST | — / `x-admin-key` | List (filter by category/tag/q/scope) · create |
| `/api/posts/[slug]` | GET, PUT, DELETE | — / `x-admin-key` | Read · update · delete |
| `/api/settings` | GET, PUT | — / `x-admin-key` | Read site edition · toggle fair/normal |
| `/api/submissions` | GET, POST | admin / — | Inbox · submit contact / register / tip |
| `/api/submissions/[id]` | PATCH | `x-admin-key` | Mark read / archived |
| `/api/auth` | POST | — | Mock sign-in (`ADMIN_KEY`, default `genesis2026`) |

### Admin studio (`#/admin`)

- **Edition toggle** — flips Science Fair ⇄ Normal for the whole site (public; writes
  through to the API when you're signed in)
- **Editor sign-in** — mock access key (`genesis2026` in the demo, change via `ADMIN_KEY`)
- **Story archive** — create / edit / delete, publish & featured switches, per-story
  edition scope (both / fair-only / normal-only)
- **Inbox** — contact messages, Genesis registrations and story tips with read/archive

## ✦ Experience

- **Instant boot reveal** — no loading screen: content renders immediately under a
  slim editorial masthead that lifts away in ~1s (session-once, reduced-motion safe)
- **Cursor FX** — comet cursor, star-dust trail, click bursts, hover labels (fine pointers)
- **Typography FX** — SplitText letter cascades, Scramble decodes, serif editorial
  headlines in Normal mode (bundled Newsreader) / display grotesk in Fair mode
- **Canvas starfield** — 3 parallax layers + meteors (fair mode), paper grain (normal mode)
- **Route comet-wipe transitions**, magnetic buttons, tilt cards, counters

## ✦ Real data & media

All school facts (phones, address, hours, faculty, club advisers, meeting days,
events, emails, club colours, taglines/mottos) are sourced from the school's live
info hubs — **okgs.info** (`/clubs/alssm … /clubs/artds`) and **omarkgschool.com**.
Real media in `/public/media/real/`: official club banners (ALSSM, ALPCG, AYPG from
the school's Cloudinary), the five club logos, the official crest and a campus
photograph. Scheduled events follow the fair's published calendar (20–21 Nov 2026).

## ✦ Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

- Demo admin key: `genesis2026` (set `ADMIN_KEY` to change)
- All content lives under `/` (hash routes) — deployable to any static-friendly host
  or a Node runtime; the API routes need a Node server (Vercel/Netlify/VPS).
