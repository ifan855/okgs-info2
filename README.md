# OKGS — the Omar K.G. School site
### One codebase · two editions: **Science Fair mode** (OKGS GENESIS 2026) ⇄ **Normal mode** (the school's own landing site)

The official website of **Omar Kindergarten School & Omar Garden Academy** (Omar K.G.
School), Kalai Sadar, Joypurhat, Bangladesh — with a password-protected **admin
studio** that toggles the whole site between **Science Fair mode** (a cinematic
deep-space fair edition: the fair's colon-combined title, arenas, routine, countdown,
sign-in) and **Normal mode** (a warm, garden-green school landing site: welcome,
snapshot, facilities, clubs, campus moments — the journal kept deliberately quiet).

Built with **Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion**.

---

## ✦ The two editions

| | 🌌 Science Fair mode | 🏫 Normal mode |
|---|---|---|
| Theme | Deep-space navy, aurora-teal light, warm gold actions (pure CSS — no stock space photos) | Warm paper, garden green (the crest of Omar **Garden** Academy), brass second voice |
| Hero | One full-viewport title card: the fair's full **Name: Tagline** + date chips + two CTAs | Real campus photo, the school's promise, admissions & clubs CTAs |
| Density | Deliberately low on load; climbs chapter by chapter as you scroll | Classic school landing, top to bottom |
| Extra content | 7 arena rows, 2-day routine, prizes, rules, FAQ, fair portal sign-in (placeholder) | Snapshot stats, facilities, admissions panel |
| Shared | Clubs of five (colour-coded), admin-curated photo strip, campus journal, gallery, about, contact | same |

The mode, the fair's **name + tagline**, the **photo gallery** and the **studio
password** all live in the database (`/api/settings`, `/api/gallery`, kv store) and are
edited in the **Studio** at `#/admin`. Everything is mirrored to `localStorage` so the
first paint is already on-theme.

## ✦ Pages (hash-routed, all under `/`)

| Route | Page |
|---|---|
| `#/` | Home — edition-aware hero, arenas (fair) / facilities & admissions (normal), clubs, moments, journal, finale |
| `#/press` | **Campus Journal** — searchable archive with category filters |
| `#/press/[slug]` | Article — serif editorial layout, drop cap, pull quote, related stories |
| `#/genesis` | The Science Fair (fair mode only) — 7 arenas w/ criteria, routine tabs, prizes, rules, FAQ, portal sign-in |
| `#/clubs` | Clubs hub — the council of five (real data from okgs.info club info hubs) |
| `#/clubs/[alssm·aypg·alpcg·aygsm·artds]` | Club pages — real taglines, mottos, advisers, meeting days/times, venues, emails, club colours & official banners |
| `#/gallery` | The Photo Archive — **curated entirely from the admin studio**, real campus photography only, filters + lightbox |
| `#/about` | School story, real campus photography, official crest, faculty, facilities, links |
| `#/register` | **Fair portal sign-in** (fair mode only) — deliberately non-functional placeholder: fields render, nothing authenticates |
| `#/contact` | Talk to the school — phones, email, campus, office hours (posts to the backend) |
| `#/admin` | **The Studio** — one password for everything: site edition, fair title & tagline (live colon preview), photo gallery manager (add/reorder/caption/delete), story CRUD, inbox, password rotation |

## ✦ The Overture

The site opens with a grand cinematic title card: the school line, then the fair's
full name with its tagline **always joined by a colon**, a light seam, a bloom — then
the screen parts vertically into the hero. It runs once per browser session, is
click-to-skip, and collapses to an instant fade under `prefers-reduced-motion`.
Add `?overture` to any URL to force the full sequence (QA affordance).

## ✦ The backend (mock ⇄ Neon serverless Postgres)

The app ships with a **mock backend** so everything works out of the box:

- `src/lib/server/seed.ts` — 14 seeded stories (scoped fair / normal / both), the fair
  identity, 6 real-photo gallery items, sample inbox items
- `src/lib/server/store.ts` — a unified CRUD store with two interchangeable drivers:
  - **mock (default)** — a seeded in-memory store (survives hot reloads; self-migrates)
  - **neon** — real serverless Postgres, activated purely by environment variable

### Going live on Neon

Set any one of these (Vite-style names included) and restart:

```bash
NEON_DATABASE_URL="postgres://…@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
# or VITE_NEON_DATABASE_URL / DATABASE_URL (postgres:// only)
```

No extra dependency is required — the adapter speaks Neon's **serverless HTTP SQL**
protocol with a plain `fetch`. Tables (`posts`, `settings`, `submissions`, `gallery`,
`kv`) are created and seeded automatically on first request.

## ✦ Media hosting — Cloudinary (never in git)

All photos and videos (both hero montages, the eight films, the real campus
photography, club banners/logos, the crest and the school logo) live on
**Cloudinary** and are referenced by URL from the frontend. **No media file is ever
committed to GitHub** — `public/media/` is fully git-ignored.

- Cloud: `tt7oyjd1`
- Scheme: `okgs/film/*` (films, posters, hero montages), `okgs/real/*` (photos,
  banners, logos), `okgs/okgs-logo`
- The two hero montages carry a **version suffix in the public id**
  (`odyssey-montage-v3`, `school-days-montage-v3`) so a re-cut can never be masked
  by a stale browser or CDN cache — re-render, upload as `-v4`, bump
  `HERO_MONTAGE` / `SCHOOL_MONTAGE` in `src/lib/genesis/films.ts`.
- API credentials stay out of the repo (see `.env.example`).

## ✦ Deploying to Netlify

The repo is Netlify-ready (`netlify.toml` included):

1. Push this repo to GitHub and "Add new site → Import an existing project" on Netlify.
2. Build settings come from `netlify.toml` (`npx next build`, publish `.next`,
   `@netlify/plugin-nextjs` runtime for the API routes).
3. Optional environment variables (Site configuration → Environment variables):
   `NEON_DATABASE_URL` for the real database, `ADMIN_KEY` to override the seed
   studio password. Without them the site runs on the seeded mock backend.
4. Deploy. No media upload step — the site pulls everything from Cloudinary.

## ✦ Admin access & the studio password

- The studio password is stored **in the database as a sha-256 hash** (`kv.admin_hash`)
  — never in code. Seed password: **`genesis2026`** (override the seed via `ADMIN_KEY` env).
- After signing in at `#/admin`, use **Studio password → Change password** to rotate it.
- Every mutating endpoint (`settings`, `gallery`, `posts`, `submissions`) requires the
  `x-admin-key` header and verifies it against the stored hash — including the
  science-fair ⇄ normal toggle.

## ✦ Local development

```bash
bun install
bun run dev        # http://localhost:3000
bun run lint
```

## ✦ Project structure

```
src/
  app/
    page.tsx                 # single entry — ModeProvider + Overture + hash router
    layout.tsx               # metadata, fonts preload
    api/
      posts/  posts/[slug]/  # journal CRUD (public read, admin write)
      settings/              # mode + fair identity (admin write)
      gallery/ gallery/[id]/ # curated photo archive (public read, admin write)
      submissions/           # contact inbox (public post, admin read/patch)
      auth/                  # sign-in + password rotation (hash verified)
  components/genesis/
    Overture.tsx             # the grand cinematic opening
    Starfield.tsx CursorFX.tsx Navbar.tsx Footer.tsx Countdown.tsx FX.tsx IconFor.tsx
    views/                   # HomeView · FairView · ClubsView · ClubPageView ·
                             # GalleryView · PressView · ArticleView · AboutView ·
                             # ContactView · LoginView · AdminView
  lib/
    press.tsx                # mode + fair-identity provider, API clients
    types.ts                 # Post · Settings · GalleryItem · fairTitle()
    genesis/data.ts          # real school & club content (okgs.info, omarkgschool.com)
    genesis/router.ts        # hash router
    server/store.ts seed.ts  # mock + Neon data layer
public/
  fonts/                     # self-hosted: Space Grotesk, Inter, Space Mono,
                             # Newsreader, Noto Sans Bengali
  media/                     # git-ignored — media lives on Cloudinary
                             # (film desk videos, posters, real campus photography)
```

## ✦ Content sources

All school and club facts are from the school's own properties: `okgs.info` (incl. the
five club info hubs), `omarkgschool.com` and the school's official channels. Club
colours, advisers, meeting days, venues and emails are real. Fair dates follow the
2026 academic calendar.
