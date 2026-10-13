/* ============================================================
   OKGS — data store
   ------------------------------------------------------------
   Two interchangeable backends:

   1. MOCK (default): a seeded in-memory store. Survives hot
      reloads via globalThis. Perfect for preview/static demos.

   2. NEON (production): real serverless Postgres, activated by
      pointing an env var at your Neon connection string:

         NEON_DATABASE_URL=postgres://…        (preferred)
         VITE_NEON_DATABASE_URL=postgres://…   (Vite-style name)
         DATABASE_URL=postgres://…             (fallback)

      The adapter speaks Neon's serverless HTTP protocol with a
      plain fetch — no extra dependency required. Tables are
      created and seeded automatically on first request.

   Admin credentials live IN the database (kv.admin_hash, a
   sha-256 hash) and can be rotated after sign-in via the
   studio. Seed password: genesis2026 (or ADMIN_KEY env).

   Switching backends requires zero code changes: the same CRUD
   surface is served either way.
   ============================================================ */

import type { GalleryItem, Post, Settings, Submission } from "@/lib/types";
import { SEED_POSTS, SEED_SETTINGS, SEED_SUBMISSIONS, SEED_GALLERY } from "./seed";

/* ---------- env detection ---------- */

export function neonConnectionString(): string | null {
  const candidates = [
    process.env.NEON_DATABASE_URL,
    process.env.VITE_NEON_DATABASE_URL,
    process.env.DATABASE_URL,
    process.env.VITE_DATABASE_URL,
  ];
  for (const c of candidates) {
    if (c && (c.startsWith("postgres://") || c.startsWith("postgresql://"))) return c;
  }
  return null;
}

export const isNeonMode = () => neonConnectionString() !== null;

/* ---------- password hashing (no deps, Web Crypto) ---------- */

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SEED_PASSWORD = process.env.ADMIN_KEY || "genesis2026";
const ADMIN_HASH_KEY = "admin_hash";

/* ---------- Neon serverless HTTP adapter (no deps) ---------- */

type SqlRow = Record<string, unknown>;

async function neonSql<T = SqlRow>(conn: string, query: string, params: unknown[] = []): Promise<T[]> {
  const host = new URL(conn).host;
  const res = await fetch(`https://${host}/sql`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "neon-connection-string": conn,
    },
    body: JSON.stringify({ query, params }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Neon SQL failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as { rows?: T[] } | T[];
  return Array.isArray(data) ? data : data.rows ?? [];
}

/* ---------- memory store (mock backend) ---------- */

interface MemDB {
  posts: Post[];
  settings: Settings;
  submissions: Submission[];
  gallery: GalleryItem[];
  adminHash: string;
  seeded: boolean;
}

const globalStore = globalThis as unknown as { __okgsMemDB?: MemDB };

function mem(): MemDB {
  if (!globalStore.__okgsMemDB) {
    globalStore.__okgsMemDB = {
      posts: structuredClone(SEED_POSTS),
      settings: structuredClone(SEED_SETTINGS),
      submissions: structuredClone(SEED_SUBMISSIONS),
      gallery: structuredClone(SEED_GALLERY),
      adminHash: "__unset__",
      seeded: true,
    };
  }
  const db = globalStore.__okgsMemDB;
  /* migrate stores created by older versions of this module */
  if (!Array.isArray(db.gallery)) db.gallery = structuredClone(SEED_GALLERY);
  if (typeof db.adminHash !== "string" || db.adminHash === "") db.adminHash = "__unset__";
  if (!db.settings || typeof db.settings.fairName !== "string") {
    db.settings = { ...structuredClone(SEED_SETTINGS), ...(db.settings ?? {}), fairName: SEED_SETTINGS.fairName, fairTagline: SEED_SETTINGS.fairTagline };
  }
  return db;
}

/* ---------- Neon schema ---------- */

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  deck TEXT DEFAULT '',
  body JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'News',
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT '',
  role TEXT DEFAULT '',
  date TIMESTAMPTZ DEFAULT now(),
  cover TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  scope TEXT DEFAULT 'both'
);
CREATE TABLE IF NOT EXISTS settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  mode TEXT DEFAULT 'fair',
  updated_at TIMESTAMPTZ DEFAULT now(),
  banner TEXT DEFAULT '',
  fair_name TEXT DEFAULT 'OKGS GENESIS 2026',
  fair_tagline TEXT DEFAULT 'Exploring the Universe of Science'
);
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  kind TEXT DEFAULT 'contact',
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT,
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  extra JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  title TEXT DEFAULT '',
  category TEXT DEFAULT 'Campus',
  ord INTEGER DEFAULT 0,
  kind TEXT DEFAULT 'image',
  poster TEXT DEFAULT ''
);
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS kind TEXT DEFAULT 'image';
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS poster TEXT DEFAULT '';
CREATE TABLE IF NOT EXISTS kv (
  k TEXT PRIMARY KEY,
  v TEXT NOT NULL
);
`;

function rowToPost(r: SqlRow): Post {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    deck: String(r.deck ?? ""),
    body: (r.body as string[]) ?? [],
    category: (r.category as Post["category"]) ?? "News",
    tags: (r.tags as string[]) ?? [],
    author: String(r.author ?? ""),
    role: String(r.role ?? ""),
    date: r.date instanceof Date ? r.date.toISOString() : String(r.date ?? new Date().toISOString()),
    cover: (r.cover as string) ?? undefined,
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    scope: (r.scope as Post["scope"]) ?? "both",
  };
}

function rowToSubmission(r: SqlRow): Submission {
  return {
    id: String(r.id),
    kind: (r.kind as Submission["kind"]) ?? "contact",
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    phone: (r.phone as string) ?? undefined,
    subject: String(r.subject ?? ""),
    message: String(r.message ?? ""),
    status: (r.status as Submission["status"]) ?? "new",
    extra: (r.extra as Record<string, string>) ?? {},
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? new Date().toISOString()),
  };
}

function rowToGallery(r: SqlRow): GalleryItem {
  const kind = String(r.kind ?? "image");
  return {
    id: String(r.id),
    src: String(r.src),
    title: String(r.title ?? ""),
    category: String(r.category ?? "Campus"),
    order: Number(r.ord ?? 0),
    kind: kind === "video" ? "video" : "image",
    poster: String(r.poster ?? "") || undefined,
  };
}

/* ---------- unified CRUD surface ---------- */

export interface ListOpts {
  category?: string;
  tag?: string;
  q?: string;
  scope?: string;
  includeDrafts?: boolean;
  limit?: number;
}

export const store = {
  /* ----- posts ----- */
  async listPosts(opts: ListOpts = {}): Promise<Post[]> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `SELECT * FROM posts ORDER BY date DESC`);
        let posts = rows.map(rowToPost);
        posts = filterPosts(posts, opts);
        return posts;
      } catch (e) {
        console.error("[store] neon listPosts failed, falling back to memory:", e);
      }
    }
    return filterPosts(mem().posts, opts);
  },

  async getPost(slug: string, includeDrafts = false): Promise<Post | null> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `SELECT * FROM posts WHERE slug = $1`, [slug]);
        const p = rows[0] ? rowToPost(rows[0]) : null;
        if (p && (p.published || includeDrafts)) return p;
        return null;
      } catch (e) {
        console.error("[store] neon getPost failed, falling back:", e);
      }
    }
    const p = mem().posts.find((x) => x.slug === slug) ?? null;
    if (p && (p.published || includeDrafts)) return p;
    return null;
  },

  async createPost(post: Post): Promise<Post> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        await neonSql(
          conn,
          `INSERT INTO posts (id, slug, title, deck, body, category, tags, author, role, date, cover, featured, published, scope)
           VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14)`,
          [post.id, post.slug, post.title, post.deck, JSON.stringify(post.body), post.category,
           JSON.stringify(post.tags), post.author, post.role, post.date, post.cover ?? null,
           post.featured, post.published, post.scope],
        );
        return post;
      } catch (e) {
        console.error("[store] neon createPost failed, falling back:", e);
      }
    }
    const db = mem();
    db.posts.unshift(post);
    return post;
  },

  async updatePost(slug: string, patch: Partial<Post>): Promise<Post | null> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const cur = await store.getPost(slug, true);
        if (!cur) return null;
        const next = { ...cur, ...patch, slug: cur.slug, id: cur.id };
        await neonSql(
          conn,
          `UPDATE posts SET title=$2, deck=$3, body=$4::jsonb, category=$5, tags=$6::jsonb,
           author=$7, role=$8, date=$9, cover=$10, featured=$11, published=$12, scope=$13 WHERE slug=$1`,
          [slug, next.title, next.deck, JSON.stringify(next.body), next.category, JSON.stringify(next.tags),
           next.author, next.role, next.date, next.cover ?? null, next.featured, next.published, next.scope],
        );
        return next;
      } catch (e) {
        console.error("[store] neon updatePost failed, falling back:", e);
      }
    }
    const db = mem();
    const i = db.posts.findIndex((x) => x.slug === slug);
    if (i === -1) return null;
    db.posts[i] = { ...db.posts[i], ...patch, slug: db.posts[i].slug, id: db.posts[i].id };
    return db.posts[i];
  },

  async deletePost(slug: string): Promise<boolean> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `DELETE FROM posts WHERE slug=$1 RETURNING id`, [slug]);
        return rows.length > 0;
      } catch (e) {
        console.error("[store] neon deletePost failed, falling back:", e);
      }
    }
    const db = mem();
    const i = db.posts.findIndex((x) => x.slug === slug);
    if (i === -1) return false;
    db.posts.splice(i, 1);
    return true;
  },

  /* ----- settings ----- */
  async getSettings(): Promise<Settings> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `SELECT * FROM settings WHERE id = true`);
        if (rows[0]) {
          return {
            mode: (rows[0].mode as Settings["mode"]) ?? "fair",
            updatedAt: rows[0].updated_at instanceof Date ? rows[0].updated_at.toISOString() : String(rows[0].updated_at ?? new Date().toISOString()),
            banner: String(rows[0].banner ?? "") || undefined,
            fairName: String(rows[0].fair_name ?? SEED_SETTINGS.fairName),
            fairTagline: String(rows[0].fair_tagline ?? SEED_SETTINGS.fairTagline),
          };
        }
        return SEED_SETTINGS;
      } catch (e) {
        console.error("[store] neon getSettings failed, falling back:", e);
      }
    }
    return mem().settings;
  },

  async updateSettings(patch: Partial<Settings>): Promise<Settings> {
    const conn = neonConnectionString();
    const next: Settings = { ...SEED_SETTINGS, ...(await store.getSettings()), ...patch, updatedAt: new Date().toISOString() };
    if (conn) {
      try {
        await store.ensureNeon();
        await neonSql(
          conn,
          `INSERT INTO settings (id, mode, updated_at, banner, fair_name, fair_tagline) VALUES (true,$1,$2,$3,$4,$5)
           ON CONFLICT (id) DO UPDATE SET mode=$1, updated_at=$2, banner=$3, fair_name=$4, fair_tagline=$5`,
          [next.mode, next.updatedAt, next.banner ?? "", next.fairName, next.fairTagline],
        );
        return next;
      } catch (e) {
        console.error("[store] neon updateSettings failed, falling back:", e);
      }
    }
    mem().settings = next;
    return next;
  },

  /* ----- submissions ----- */
  async listSubmissions(): Promise<Submission[]> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `SELECT * FROM submissions ORDER BY created_at DESC`);
        return rows.map(rowToSubmission);
      } catch (e) {
        console.error("[store] neon listSubmissions failed, falling back:", e);
      }
    }
    return mem().submissions;
  },

  async createSubmission(sub: Submission): Promise<Submission> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        await neonSql(
          conn,
          `INSERT INTO submissions (id, kind, name, email, phone, subject, message, status, extra, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10)`,
          [sub.id, sub.kind, sub.name, sub.email, sub.phone ?? null, sub.subject, sub.message, sub.status, JSON.stringify(sub.extra ?? {}), sub.createdAt],
        );
        return sub;
      } catch (e) {
        console.error("[store] neon createSubmission failed, falling back:", e);
      }
    }
    mem().submissions.unshift(sub);
    return sub;
  },

  async updateSubmissionStatus(id: string, status: Submission["status"]): Promise<Submission | null> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `UPDATE submissions SET status=$2 WHERE id=$1 RETURNING *`, [id, status]);
        return rows[0] ? rowToSubmission(rows[0]) : null;
      } catch (e) {
        console.error("[store] neon updateSubmissionStatus failed, falling back:", e);
      }
    }
    const db = mem();
    const s = db.submissions.find((x) => x.id === id);
    if (!s) return null;
    s.status = status;
    return s;
  },

  /* ----- gallery (admin-curated) ----- */
  async listGallery(): Promise<GalleryItem[]> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `SELECT * FROM gallery ORDER BY ord ASC, id ASC`);
        return rows.map(rowToGallery);
      } catch (e) {
        console.error("[store] neon listGallery failed, falling back:", e);
      }
    }
    return [...mem().gallery].sort((a, b) => a.order - b.order);
  },

  async createGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        await neonSql(
          conn,
          `INSERT INTO gallery (id, src, title, category, ord, kind, poster) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [item.id, item.src, item.title, item.category, item.order, item.kind ?? "image", item.poster ?? ""],
        );
        return item;
      } catch (e) {
        console.error("[store] neon createGalleryItem failed, falling back:", e);
      }
    }
    mem().gallery.push(item);
    return item;
  },

  async updateGalleryItem(id: string, patch: Partial<GalleryItem>): Promise<GalleryItem | null> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `SELECT * FROM gallery WHERE id=$1`, [id]);
        if (!rows[0]) return null;
        const cur = rowToGallery(rows[0]);
        const next = { ...cur, ...patch, id: cur.id };
        await neonSql(
          conn,
          `UPDATE gallery SET src=$2, title=$3, category=$4, ord=$5, kind=$6, poster=$7 WHERE id=$1`,
          [id, next.src, next.title, next.category, next.order, next.kind ?? "image", next.poster ?? ""],
        );
        return next;
      } catch (e) {
        console.error("[store] neon updateGalleryItem failed, falling back:", e);
      }
    }
    const db = mem();
    const i = db.gallery.findIndex((g) => g.id === id);
    if (i === -1) return null;
    db.gallery[i] = { ...db.gallery[i], ...patch, id: db.gallery[i].id };
    return db.gallery[i];
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `DELETE FROM gallery WHERE id=$1 RETURNING id`, [id]);
        return rows.length > 0;
      } catch (e) {
        console.error("[store] neon deleteGalleryItem failed, falling back:", e);
      }
    }
    const db = mem();
    const i = db.gallery.findIndex((g) => g.id === id);
    if (i === -1) return false;
    db.gallery.splice(i, 1);
    return true;
  },

  /* ----- admin credentials (stored in the database) ----- */

  /** sha-256 of the current admin password. */
  async adminHash(): Promise<string> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        const rows = await neonSql(conn, `SELECT v FROM kv WHERE k = $1`, [ADMIN_HASH_KEY]);
        if (rows[0]) return String(rows[0].v);
        const h = await sha256Hex(SEED_PASSWORD);
        await neonSql(conn, `INSERT INTO kv (k, v) VALUES ($1,$2) ON CONFLICT (k) DO NOTHING`, [ADMIN_HASH_KEY, h]);
        return h;
      } catch (e) {
        console.error("[store] neon adminHash failed, falling back:", e);
      }
    }
    const db = mem();
    if (db.adminHash === "__unset__" || !db.adminHash) {
      db.adminHash = await sha256Hex(SEED_PASSWORD);
    }
    return db.adminHash;
  },

  async setAdminHash(hash: string): Promise<void> {
    const conn = neonConnectionString();
    if (conn) {
      try {
        await store.ensureNeon();
        await neonSql(
          conn,
          `INSERT INTO kv (k, v) VALUES ($1,$2) ON CONFLICT (k) DO UPDATE SET v=$2`,
          [ADMIN_HASH_KEY, hash],
        );
        return;
      } catch (e) {
        console.error("[store] neon setAdminHash failed, falling back:", e);
      }
    }
    mem().adminHash = hash;
  },

  async verifyAdminPassword(key: string): Promise<boolean> {
    if (!key) return false;
    const h = await sha256Hex(key);
    return h === (await store.adminHash());
  },

  async changeAdminPassword(currentKey: string, newKey: string): Promise<boolean> {
    if (!(await store.verifyAdminPassword(currentKey))) return false;
    if (!newKey || newKey.length < 6) return false;
    await store.setAdminHash(await sha256Hex(newKey));
    return true;
  },

  /* ----- neon bootstrap ----- */
  _neonReady: false,
  async ensureNeon(): Promise<void> {
    const conn = neonConnectionString();
    if (!conn || store._neonReady) return;
    await neonSql(conn, SCHEMA_SQL);
    const rows = await neonSql(conn, `SELECT COUNT(*)::int AS n FROM posts`);
    const n = (rows[0] as { n?: number })?.n ?? 0;
    if (n === 0) {
      for (const p of SEED_POSTS) {
        await neonSql(
          conn,
          `INSERT INTO posts (id, slug, title, deck, body, category, tags, author, role, date, cover, featured, published, scope)
           VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14)
           ON CONFLICT (id) DO NOTHING`,
          [p.id, p.slug, p.title, p.deck, JSON.stringify(p.body), p.category, JSON.stringify(p.tags),
           p.author, p.role, p.date, p.cover ?? null, p.featured, p.published, p.scope],
        );
      }
      await neonSql(
        conn,
        `INSERT INTO settings (id, mode, updated_at, banner, fair_name, fair_tagline) VALUES (true,$1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
        [SEED_SETTINGS.mode, SEED_SETTINGS.updatedAt, "", SEED_SETTINGS.fairName, SEED_SETTINGS.fairTagline],
      );
      for (const s of SEED_SUBMISSIONS) {
        await neonSql(
          conn,
          `INSERT INTO submissions (id, kind, name, email, phone, subject, message, status, extra, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10) ON CONFLICT (id) DO NOTHING`,
          [s.id, s.kind, s.name, s.email, s.phone ?? null, s.subject, s.message, s.status, JSON.stringify(s.extra ?? {}), s.createdAt],
        );
      }
      for (const g of SEED_GALLERY) {
        await neonSql(
          conn,
          `INSERT INTO gallery (id, src, title, category, ord) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
          [g.id, g.src, g.title, g.category, g.order],
        );
      }
      await neonSql(
        conn,
        `INSERT INTO kv (k, v) VALUES ($1,$2) ON CONFLICT (k) DO NOTHING`,
        [ADMIN_HASH_KEY, await sha256Hex(SEED_PASSWORD)],
      );
      console.log("[store] neon database seeded");
    }
    store._neonReady = true;
  },
};

/** Every mutating endpoint gates on this (password hash lives in the DB). */
export async function checkAdmin(req: Request): Promise<boolean> {
  const key = req.headers.get("x-admin-key");
  if (!key) return false;
  return store.verifyAdminPassword(key);
}

/* ---------- helpers ---------- */

function filterPosts(posts: Post[], opts: ListOpts): Post[] {
  let out = posts.filter((p) => p.published || opts.includeDrafts);
  if (opts.scope) out = out.filter((p) => p.scope === opts.scope || p.scope === "both");
  if (opts.category && opts.category !== "All") out = out.filter((p) => p.category === opts.category);
  if (opts.tag) out = out.filter((p) => p.tags.some((t) => t.toLowerCase() === opts.tag!.toLowerCase()));
  if (opts.q) {
    const q = opts.q.toLowerCase();
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.deck.toLowerCase().includes(q) ||
        p.body.some((b) => b.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  out = [...out].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (opts.limit) out = out.slice(0, opts.limit);
  return out;
}
