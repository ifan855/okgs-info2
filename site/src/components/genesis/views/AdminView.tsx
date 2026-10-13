"use client";

/* AdminView — #/admin — the Press Studio.
   Mock-backend powered control room:
   · Edition toggle: Science Fair mode ⇄ Normal mode (public, instant)
   · Sign-in (mock key), post CRUD with publish/featured switches
   · Submissions inbox (contact / registration / tips)
   Everything talks to /api/* and degrades to seed data offline. */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Lock, LogOut, Newspaper, Moon, Sun, RefreshCw, Plus, Pencil, Trash2,
  Eye, EyeOff, Star, Inbox, Send, CheckCheck, Archive, Loader2, AlertTriangle, Database,
} from "lucide-react";
import { useMode, fetchAllPostsAdmin, createPost, updatePost, deletePost, adminLogin, fetchSubmissions, patchSubmission } from "@/lib/press";
import type { Post, PostCategory, Submission } from "@/lib/types";
import { Reveal, Anchor } from "../FX";

/* ============================ page ============================ */
export default function AdminView() {
  const { mode, setMode } = useMode();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setAuthed(!!sessionStorage.getItem("okgs_admin_key"));
      setChecked(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-36 md:px-10 md:pt-44">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono2 text-[10px] uppercase tracking-[0.34em] text-white/45 md:text-[11px]">
            OKGS Press Bureau · Control room
          </span>
          <h1 className="font-editorial mt-3 text-4xl font-semibold text-ink md:text-5xl">The Press Studio</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-dim">
            Switch the edition of the whole site, file new stories, edit the archive and
            read the inbox — all backed by the site's data API (mock or Neon Postgres).
          </p>
        </div>
        {authed && (
          <button
            onClick={() => {
              sessionStorage.removeItem("okgs_admin_key");
              setAuthed(false);
            }}
            className="btn-ghost !py-2.5 !text-sm"
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        )}
      </div>

      {/* edition toggle — always available */}
      <Reveal delay={0.1}>
        <EditionToggle mode={mode} setMode={setMode} />
      </Reveal>

      {checked && !authed && <SignIn onOk={() => setAuthed(true)} />}

      {authed && (
        <>
          <Reveal delay={0.12}>
            <PostsManager />
          </Reveal>
          <Reveal delay={0.16}>
            <SubmissionsInbox />
          </Reveal>
        </>
      )}

      {!authed && checked && (
        <p className="mt-10 text-center text-xs text-white/35">
          Demo access key: <code className="font-mono2 text-gold-2">genesis2026</code> — in production this
          endpoint swaps to your real auth provider.
        </p>
      )}
    </main>
  );
}

/* ============================ edition toggle ============================ */
function EditionToggle({ mode, setMode }: { mode: "fair" | "normal"; setMode: (m: "fair" | "normal") => void }) {
  return (
    <div className="panel mt-10 overflow-hidden rounded-[2rem] p-7 md:p-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display flex items-center gap-3 text-xl font-semibold text-ink md:text-2xl">
            <Database className="h-5 w-5 text-gold" aria-hidden /> Site edition
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-dim">
            One site, two editions. <strong className="text-ink">Science Fair mode</strong> wears the
            deep-space Genesis theme and adds arenas, routine and registration.{" "}
            <strong className="text-ink">Normal mode</strong> is the premium editorial paper edition —
            the same newsroom, minus the fair.
          </p>
        </div>
        <BackendBadge />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {(
          [
            {
              key: "fair" as const,
              icon: Moon,
              t: "Science Fair Mode",
              d: "Genesis 2026 theme · arenas, routine, countdown & registration",
              chip: "Cosmic",
            },
            {
              key: "normal" as const,
              icon: Sun,
              t: "Normal Mode",
              d: "Editorial paper theme · the same content, minus the fair",
              chip: "Paper",
            },
          ]
        ).map((o) => {
          const active = mode === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setMode(o.key)}
              aria-pressed={active}
              className={`group relative flex items-start gap-4 rounded-3xl border p-6 text-left transition-all duration-500 ${
                active
                  ? "border-gold/60 bg-gold/10 shadow-[0_0_40px_-12px_rgba(240,180,41,0.45)]"
                  : "border-white/10 hover:border-gold/35"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                  active ? "bg-gold text-black" : "glass text-gold-2"
                }`}
              >
                <o.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-semibold text-ink">{o.t}</span>
                  <span className="font-mono2 rounded-full border border-white/15 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-white/50">
                    {o.chip}
                  </span>
                </span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-white/55">{o.d}</span>
              </span>
              <span
                aria-hidden
                className={`ml-auto mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ${
                  active ? "bg-gold" : "bg-white/15"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                    active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BackendBadge() {
  const [backend, setBackend] = useState<string>("…");
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setBackend(d?.backend ?? "offline"))
      .catch(() => setBackend("offline (seed data)"));
  }, []);
  return (
    <span className="font-mono2 chip !text-[10px] uppercase">
      <span className={`h-2 w-2 rounded-full ${backend.startsWith("offline") ? "bg-red-400" : backend === "neon" ? "bg-emerald-400" : "bg-gold"}`} />
      backend: {backend}
    </span>
  );
}

/* ============================ sign in ============================ */
function SignIn({ onOk }: { onOk: () => void }) {
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await adminLogin(key);
    setBusy(false);
    if (res.ok) onOk();
    else setErr(res.error ?? "Invalid key");
  };

  return (
    <Reveal delay={0.12}>
      <form onSubmit={submit} className="panel mx-auto mt-10 max-w-md rounded-[2rem] p-8">
        <span className="glass mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-gold-2">
          <Lock className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="font-display mt-5 text-center text-2xl font-semibold text-ink">Editor sign-in</h2>
        <p className="mt-2 text-center text-sm text-white/55">
          Enter the bureau access key to manage stories and the inbox.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Access key"
          className="field mt-6 text-center"
          aria-label="Access key"
          autoFocus
        />
        {err && (
          <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-red-400">
            <AlertTriangle className="h-4 w-4" aria-hidden /> {err}
          </p>
        )}
        <button type="submit" disabled={busy || !key} className="btn-gold mt-6 w-full justify-center disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
          Unlock the studio
        </button>
      </form>
    </Reveal>
  );
}

/* ============================ posts manager ============================ */
const CATEGORIES: PostCategory[] = ["Press Release", "News", "Notice", "Feature", "Club", "Sports", "Achievement"];

interface Draft {
  slug?: string; // present = editing existing
  title: string;
  slugInput: string;
  deck: string;
  body: string;
  category: PostCategory;
  scope: "both" | "fair" | "normal";
  author: string;
  role: string;
  cover: string;
  tags: string;
  featured: boolean;
  published: boolean;
}

const emptyDraft = (): Draft => ({
  title: "",
  slugInput: "",
  deck: "",
  body: "",
  category: "News",
  scope: "both",
  author: "OKGS Press Desk",
  role: "Newsroom",
  cover: "",
  tags: "",
  featured: false,
  published: true,
});

function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setPosts(await fetchAllPostsAdmin());
    setLoading(false);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      load();
    });
    return () => cancelAnimationFrame(raf);
  }, [load]);

  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(""), 2600);
  };

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setErr("");
    const slug = (draft.slugInput || draft.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const payload = {
      title: draft.title,
      slug,
      deck: draft.deck,
      body: draft.body.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
      category: draft.category,
      scope: draft.scope,
      author: draft.author,
      role: draft.role,
      cover: draft.cover || undefined,
      tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
      featured: draft.featured,
      published: draft.published,
    };
    const res = draft.slug ? await updatePost(draft.slug, payload) : await createPost(payload);
    setBusy(false);
    if (res.ok) {
      setDraft(null);
      flash(draft.slug ? "Story updated in the archive." : "Story filed to the archive.");
      load();
    } else {
      setErr(res.error ?? "Save failed");
    }
  };

  const quick = async (p: Post, patch: Partial<Post>, note: string) => {
    const res = await updatePost(p.slug, patch);
    if (res.ok) {
      flash(note);
      load();
    } else {
      setErr(res.error ?? "Update failed");
    }
  };

  const remove = async (p: Post) => {
    if (!window.confirm(`Delete “${p.title}” from the archive? This cannot be undone.`)) return;
    const res = await deletePost(p.slug);
    if (res.ok) {
      flash("Story removed from the archive.");
      load();
    } else {
      setErr(res.error ?? "Delete failed");
    }
  };

  return (
    <div className="panel mt-8 overflow-hidden rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-6 md:p-7">
        <h2 className="font-display flex items-center gap-3 text-xl font-semibold text-ink md:text-2xl">
          <Newspaper className="h-5 w-5 text-gold" aria-hidden /> Story archive
          <span className="font-mono2 text-xs font-normal text-white/40">{posts.length} entries</span>
        </h2>
        <div className="flex gap-3">
          <button onClick={load} className="btn-ghost !px-4 !py-2 !text-sm" aria-label="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden /> Refresh
          </button>
          <button onClick={() => setDraft(emptyDraft())} className="btn-gold !px-5 !py-2 !text-sm">
            <Plus className="h-4 w-4" aria-hidden /> New story
          </button>
        </div>
      </div>

      {(msg || err) && (
        <p className={`px-6 pt-4 text-[13px] md:px-7 ${err ? "text-red-400" : "text-emerald-400"}`}>
          {err || msg}
        </p>
      )}

      {/* editor */}
      {draft && (
        <div className="border-b border-white/8 bg-white/[0.02] p-6 md:p-7">
          <h3 className="font-display text-lg font-semibold text-gold-2">
            {draft.slug ? "Edit story" : "File a new story"}
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2 block text-xs uppercase tracking-[0.18em] text-white/45">
              Headline
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="field mt-1.5 font-editorial !text-lg normal-case tracking-normal"
                placeholder="The story headline"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
              Slug {draft.slug && <span className="text-white/30">(locked when editing)</span>}
              <input
                value={draft.slugInput}
                disabled={!!draft.slug}
                onChange={(e) => setDraft({ ...draft, slugInput: e.target.value })}
                className="field mt-1.5 font-mono2 !text-[13px] normal-case tracking-normal"
                placeholder="auto-generated-from-headline"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
              Cover image path
              <input
                value={draft.cover}
                onChange={(e) => setDraft({ ...draft, cover: e.target.value })}
                className="field mt-1.5 font-mono2 !text-[13px] normal-case tracking-normal"
                placeholder="/media/real/cover-alssm.jpg"
              />
            </label>
            <label className="md:col-span-2 block text-xs uppercase tracking-[0.18em] text-white/45">
              Standfirst / deck
              <textarea
                value={draft.deck}
                onChange={(e) => setDraft({ ...draft, deck: e.target.value })}
                className="field mt-1.5 min-h-[64px]"
                placeholder="One or two sentences that sell the story."
              />
            </label>
            <label className="md:col-span-2 block text-xs uppercase tracking-[0.18em] text-white/45">
              Body — separate paragraphs with a blank line
              <textarea
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                className="field mt-1.5 min-h-[180px]"
                placeholder={"First paragraph…\n\nSecond paragraph…"}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
              Category
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as PostCategory })}
                className="field mt-1.5"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
              Edition scope
              <select
                value={draft.scope}
                onChange={(e) => setDraft({ ...draft, scope: e.target.value as Draft["scope"] })}
                className="field mt-1.5"
              >
                <option value="both">Both editions</option>
                <option value="fair">Science Fair mode only</option>
                <option value="normal">Normal mode only</option>
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
              Author
              <input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} className="field mt-1.5" />
            </label>
            <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
              Author role
              <input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className="field mt-1.5" />
            </label>
            <label className="md:col-span-2 block text-xs uppercase tracking-[0.18em] text-white/45">
              Tags (comma separated)
              <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className="field mt-1.5" placeholder="Genesis 2026, Clubs, Notice" />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setDraft({ ...draft, published: !draft.published })}
              className={`chip ${draft.published ? "!border-emerald-400/40 !text-emerald-300" : "!border-white/15 !text-white/45"}`}
              aria-pressed={draft.published}
            >
              {draft.published ? <Eye className="h-3.5 w-3.5" aria-hidden /> : <EyeOff className="h-3.5 w-3.5" aria-hidden />}
              {draft.published ? "Published" : "Draft"}
            </button>
            <button
              onClick={() => setDraft({ ...draft, featured: !draft.featured })}
              className={`chip ${draft.featured ? "!border-gold/50 !text-gold-2" : "!border-white/15 !text-white/45"}`}
              aria-pressed={draft.featured}
            >
              <Star className="h-3.5 w-3.5" aria-hidden /> {draft.featured ? "Featured" : "Not featured"}
            </button>
            <span className="flex-1" />
            <button onClick={() => setDraft(null)} className="btn-ghost !px-4 !py-2 !text-sm">Cancel</button>
            <button onClick={save} disabled={busy || !draft.title} className="btn-gold !px-5 !py-2 !text-sm disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              {draft.slug ? "Save changes" : "File the story"}
            </button>
          </div>
        </div>
      )}

      {/* list */}
      <div className="divide-y divide-white/6">
        {loading && posts.length === 0 && (
          <p className="flex items-center gap-3 p-6 text-sm text-white/45">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading the archive…
          </p>
        )}
        {posts.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-white/[0.025] md:px-7">
            {p.cover && <img src={p.cover} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono2 text-[9px] font-bold uppercase tracking-[0.2em] text-gold-2">{p.category}</span>
                {p.featured && <Star className="h-3 w-3 fill-gold text-gold" aria-hidden />}
                {!p.published && <span className="font-mono2 rounded bg-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-white/50">Draft</span>}
                {p.scope !== "both" && (
                  <span className="font-mono2 rounded bg-nova/15 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-nova-2">
                    {p.scope} only
                  </span>
                )}
              </div>
              <p className="mt-1 truncate font-editorial text-[15.5px] font-semibold text-ink">{p.title}</p>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.16em] text-white/35">
                /{p.slug} · {new Date(p.date).toLocaleDateString("en-GB")} · {p.author}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => quick(p, { published: !p.published }, p.published ? "Story moved to drafts." : "Story published.")} className="glass flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:text-gold-2" title={p.published ? "Move to drafts" : "Publish"}>
                {p.published ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
              </button>
              <button onClick={() => quick(p, { featured: !p.featured }, p.featured ? "Removed from featured." : "Story set as featured.")} className={`glass flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${p.featured ? "text-gold" : "text-white/60 hover:text-gold-2"}`} title="Toggle featured">
                <Star className={`h-4 w-4 ${p.featured ? "fill-gold" : ""}`} aria-hidden />
              </button>
              <button
                onClick={() =>
                  setDraft({
                    slug: p.slug,
                    title: p.title,
                    slugInput: p.slug,
                    deck: p.deck,
                    body: p.body.join("\n\n"),
                    category: p.category,
                    scope: p.scope,
                    author: p.author,
                    role: p.role,
                    cover: p.cover ?? "",
                    tags: p.tags.join(", "),
                    featured: p.featured,
                    published: p.published,
                  })
                }
                className="glass flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:text-gold-2"
                title="Edit"
              >
                <Pencil className="h-4 w-4" aria-hidden />
              </button>
              <button onClick={() => remove(p)} className="glass flex h-9 w-9 items-center justify-center rounded-lg text-red-400/70 transition-colors hover:text-red-400" title="Delete">
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        ))}
        {!loading && posts.length === 0 && (
          <p className="p-8 text-center text-sm text-white/45">
            The archive is empty — file the first story with “New story”.
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================ submissions inbox ============================ */
function SubmissionsInbox() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "contact" | "register" | "tip">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await fetchSubmissions());
    setLoading(false);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      load();
    });
    return () => cancelAnimationFrame(raf);
  }, [load]);

  const mark = async (id: string, status: Submission["status"]) => {
    if (await patchSubmission(id, status)) load();
  };

  const shown = useMemo(
    () =>
      items.filter((s) =>
        filter === "all" ? true : filter === "new" ? s.status === "new" : s.kind === filter,
      ),
    [items, filter],
  );

  const unread = items.filter((s) => s.status === "new").length;

  return (
    <div className="panel mt-8 overflow-hidden rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-6 md:p-7">
        <h2 className="font-display flex items-center gap-3 text-xl font-semibold text-ink md:text-2xl">
          <Inbox className="h-5 w-5 text-gold" aria-hidden /> Inbox
          {unread > 0 && (
            <span className="font-mono2 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-black">{unread} new</span>
          )}
        </h2>
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "contact", "register", "tip"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono2 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                filter === f ? "bg-gold text-black" : "chip !px-3.5 !py-1.5"
              }`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/6">
        {loading && items.length === 0 && (
          <p className="flex items-center gap-3 p-6 text-sm text-white/45">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Checking the inbox…
          </p>
        )}
        {shown.map((s) => (
          <div key={s.id} className={`p-5 md:px-7 ${s.status === "archived" ? "opacity-50" : ""}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono2 rounded-full bg-white/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                {s.kind}
              </span>
              <span className={`h-2 w-2 rounded-full ${s.status === "new" ? "bg-gold" : s.status === "read" ? "bg-white/30" : "bg-white/10"}`} />
              <p className="font-editorial flex-1 text-[15.5px] font-semibold text-ink">{s.subject}</p>
              <span className="font-mono2 text-[10px] text-white/35">{new Date(s.createdAt).toLocaleDateString("en-GB")}</span>
            </div>
            <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-white/60">{s.message}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/40">
              <span>{s.name} · {s.email}{s.phone ? ` · ${s.phone}` : ""}</span>
              {s.extra && Object.entries(s.extra).map(([k, v]) => (
                <span key={k} className="font-mono2 uppercase tracking-widest">{k}: {v}</span>
              ))}
              <span className="flex-1" />
              {s.status !== "read" && (
                <button onClick={() => mark(s.id, "read")} className="glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-white/60 hover:text-gold-2">
                  <CheckCheck className="h-3.5 w-3.5" aria-hidden /> Mark read
                </button>
              )}
              {s.status !== "archived" && (
                <button onClick={() => mark(s.id, "archived")} className="glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-white/60 hover:text-gold-2">
                  <Archive className="h-3.5 w-3.5" aria-hidden /> Archive
                </button>
              )}
            </div>
          </div>
        ))}
        {!loading && shown.length === 0 && (
          <p className="p-8 text-center text-sm text-white/45">Nothing here — the desk is quiet.</p>
        )}
      </div>
    </div>
  );
}
