/* ============================================================
   OKGS PRESS — data store
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
      plain fetch — no extra dependency required (the official
      `@neondatabase/serverless` package uses the same wire
      format). Tables are created and seeded automatically on
      first request.

   Switching backends requires zero code changes: the same CRUD
   surface is served either way.
   ============================================================ */

import type { Post, Settings, Submission } from "@/lib/types";
import { SEED_POSTS, SEED_SETTINGS, SEED_SUBMISSIONS } from "./seed";

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

/** Mock admin key (change via ADMIN_KEY env in production). */
export const ADMIN_KEY = process.env.ADMIN_KEY || "genesis2026";

export function checkAdmin(req: Request): boolean {
  const key = req.headers.get("x-admin-key");
  return !!key && key === ADMIN_KEY;
}

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
  seeded: boolean;
}

const globalStore = globalThis as unknown as { __okgsMemDB?: MemDB };

function mem(): MemDB {
  if (!globalStore.__okgsMemDB) {
    globalStore.__okgsMemDB = {
      posts: structuredClone(SEED_POSTS),
      settings: structuredClone(SEED_SETTINGS),
      submissions: structuredClone(SEED_SUBMISSIONS),
      seeded: true,
    };
  }
  return globalStore.__okgsMemDB;
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
  banner TEXT DEFAULT ''
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
          `INSERT INTO settings (id, mode, updated_at, banner) VALUES (true,$1,$2,$3)
           ON CONFLICT (id) DO UPDATE SET mode=$1, updated_at=$2, banner=$3`,
          [next.mode, next.updatedAt, next.banner ?? ""],
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
        `INSERT INTO settings (id, mode, updated_at, banner) VALUES (true,$1,$2,$3) ON CONFLICT (id) DO NOTHING`,
        [SEED_SETTINGS.mode, SEED_SETTINGS.updatedAt, ""],
      );
      for (const s of SEED_SUBMISSIONS) {
        await neonSql(
          conn,
          `INSERT INTO submissions (id, kind, name, email, phone, subject, message, status, extra, created_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10) ON CONFLICT (id) DO NOTHING`,
          [s.id, s.kind, s.name, s.email, s.phone ?? null, s.subject, s.message, s.status, JSON.stringify(s.extra ?? {}), s.createdAt],
        );
      }
      console.log("[store] neon database seeded");
    }
    store._neonReady = true;
  },
};

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
