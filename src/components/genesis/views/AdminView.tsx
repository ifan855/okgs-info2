"use client";

/* AdminView — #/admin — the Studio.
   One password gates EVERYTHING (stored hashed in the database,
   rotatable right here): the site edition toggle, the fair's
   name + tagline, the photo gallery, the story archive and the
   inbox. Talks to /api/* and degrades to seed data offline. */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Lock, LogOut, Newspaper, Moon, Sun, RefreshCw, Plus, Pencil, Trash2,
  Eye, EyeOff, Star, Inbox, Send, CheckCheck, Archive, Loader2,
  AlertTriangle, Database, KeyRound, Images, ArrowUp, ArrowDown, Sparkles,
} from "lucide-react";
import {
  useMode, fetchAllPostsAdmin, createPost, updatePost, deletePost,
  adminLogin, changeAdminPassword, fetchSubmissions, patchSubmission,
  fetchGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
} from "@/lib/press";
import type { GalleryItem, Post, PostCategory, Settings, Submission } from "@/lib/types";
import { Reveal } from "../FX";

/* ============================ page ============================ */
export default function AdminView() {
  const { mode, setMode, fairName, fairTagline } = useMode();
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
            Omar K.G. School · Control room
          </span>
          <h1 className="font-editorial mt-3 text-4xl font-semibold text-ink md:text-5xl">The Studio</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-dim">
            Switch the site's edition, rename the fair, curate the photo gallery,
            edit the journal and read the inbox — every change is saved to the
            site's database (mock or Neon Postgres).
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

      {checked && !authed && <SignIn onOk={() => setAuthed(true)} />}

      {authed && (
        <>
          <Reveal delay={0.08}>
            <EditionToggle mode={mode} setMode={setMode} />
          </Reveal>
          <Reveal delay={0.1}>
            <FairIdentityEditor initialName={fairName} initialTagline={fairTagline} />
          </Reveal>
          <Reveal delay={0.12}>
            <PasswordCard />
          </Reveal>
          <Reveal delay={0.14}>
            <GalleryManager />
          </Reveal>
          <Reveal delay={0.16}>
            <PostsManager />
          </Reveal>
          <Reveal delay={0.18}>
            <SubmissionsInbox />
          </Reveal>
        </>
      )}
    </main>
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
    else setErr(res.error ?? "Incorrect password");
  };

  return (
    <Reveal delay={0.1}>
      <form onSubmit={submit} className="panel mx-auto mt-10 max-w-md rounded-[2rem] p-8">
        <span className="glass mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-gold-2">
          <Lock className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="font-display mt-5 text-center text-2xl font-semibold text-ink">Studio sign-in</h2>
        <p className="mt-2 text-center text-sm text-white/55">
          The studio password unlocks every control — edition, fair identity,
          gallery, stories and inbox.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Password"
          className="field mt-6 text-center"
          aria-label="Studio password"
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
        <p className="mt-5 text-center text-xs text-white/35">
          Seed password: <code className="font-mono2 text-gold-2">genesis2026</code> — change it below
          after signing in.
        </p>
      </form>
    </Reveal>
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
            One site, two editions. <strong className="text-ink">Science Fair mode</strong> wears
            the deep-space theme and adds the fair programme, countdown and sign-in.{" "}
            <strong className="text-ink">Normal mode</strong> is the school's own landing site —
            the same content, minus the fair.
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
              d: "Deep-space theme · arenas, routine, countdown & fair sign-in",
              chip: "Cosmic",
            },
            {
              key: "normal" as const,
              icon: Sun,
              t: "Normal Mode",
              d: "School landing theme · the same content, minus the fair",
              chip: "School",
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

/* ============================ fair identity ============================ */
function FairIdentityEditor({ initialName, initialTagline }: { initialName: string; initialTagline: string }) {
  const { applyFairIdentity } = useMode();
  const [name, setName] = useState(initialName);
  const [tagline, setTagline] = useState(initialTagline);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const preview = tagline.trim() ? `${name.trim() || "…"}: ${tagline.trim()}` : name.trim() || "…";

  const save = async () => {
    setBusy(true);
    setErr("");
    setMsg("");
    const key = sessionStorage.getItem("okgs_admin_key") ?? "";
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "content-type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ fairName: name, fairTagline: tagline } satisfies Partial<Settings>),
      });
      const data = (await res.json()) as { settings?: Settings; error?: string };
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      applyFairIdentity(name, tagline);
      setMsg("Saved — the new title is live everywhere.");
      window.setTimeout(() => setMsg(""), 3200);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel mt-8 rounded-[2rem] p-7 md:p-9">
      <h2 className="font-display flex items-center gap-3 text-xl font-semibold text-ink md:text-2xl">
        <Sparkles className="h-5 w-5 text-gold" aria-hidden /> Fair title &amp; tagline
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-dim">
        The fair's name and its tagline are always shown together as{" "}
        <strong className="text-ink">Name: Tagline</strong> — on the loading screen, the hero,
        the tab title and the footer.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
          Main name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field mt-1.5 font-display !text-base normal-case tracking-normal"
            placeholder="OKGS GENESIS 2026"
            maxLength={80}
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
          Tagline
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="field mt-1.5 font-editorial !text-base normal-case tracking-normal"
            placeholder="Exploring the Universe of Science"
            maxLength={120}
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-gold/25 bg-gold/[0.06] px-5 py-4">
        <p className="font-mono2 text-[9px] uppercase tracking-[0.3em] text-white/40">Live preview — rendered as one title</p>
        <p className="mt-2 text-lg leading-snug text-ink md:text-xl">
          <span className="font-display font-bold">{name.trim() || "…"}</span>
          <span className="font-editorial italic text-white/75">{tagline.trim() ? `: ${tagline.trim()}` : ""}</span>
        </p>
      </div>

      {(msg || err) && (
        <p className={`mt-3 text-[13px] ${err ? "text-red-400" : "text-emerald-400"}`}>{err || msg}</p>
      )}

      <div className="mt-5 flex justify-end">
        <button onClick={save} disabled={busy || !name.trim()} className="btn-gold !px-5 !py-2.5 !text-sm disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Sparkles className="h-4 w-4" aria-hidden />}
          Save the fair title
        </button>
      </div>
    </div>
  );
}

/* ============================ password rotation ============================ */
function PasswordCard() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setMsg("");
    const res = await changeAdminPassword(current, next);
    setBusy(false);
    if (res.ok) {
      setMsg("Password changed — the new one is already in use.");
      setCurrent("");
      setNext("");
      window.setTimeout(() => {
        setMsg("");
        setOpen(false);
      }, 2200);
    } else {
      setErr(res.error ?? "Change failed");
    }
  };

  return (
    <div className="panel mt-8 rounded-[2rem] p-7 md:p-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display flex items-center gap-3 text-xl font-semibold text-ink md:text-2xl">
            <KeyRound className="h-5 w-5 text-gold" aria-hidden /> Studio password
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-dim">
            The password lives in the site's database (stored as a hash) and guards every
            control on this page. Change it whenever the crew changes.
          </p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="btn-ghost !py-2.5 !text-sm">
          <KeyRound className="h-4 w-4" aria-hidden /> {open ? "Close" : "Change password"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-6 grid gap-4 border-t border-white/8 pt-6 md:grid-cols-2">
          <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
            Current password
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="field mt-1.5"
              autoComplete="off"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
            New password <span className="text-white/30">(min 6 characters)</span>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="field mt-1.5"
              autoComplete="new-password"
            />
          </label>
          {(msg || err) && (
            <p className={`text-[13px] md:col-span-2 ${err ? "text-red-400" : "text-emerald-400"}`}>{err || msg}</p>
          )}
          <div className="md:col-span-2">
            <button type="submit" disabled={busy || !current || next.length < 6} className="btn-gold !px-5 !py-2.5 !text-sm disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
              Store the new password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ============================ gallery manager ============================ */
const MEDIA_PRESETS = [
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/campus-1.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/crest.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/branding-okgs.png",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/cover-alssm.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/cover-alpcg.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/cover-aypg.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/photo-assembly-1.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/photo-classroom-1.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/photo-field-1.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/photo-football-1.jpg",
  "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/photo-aypg-1.jpg",
];

/* school films ship with the site — one click adds them as video items */
const FILM_PRESETS = [
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-odyssey.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-odyssey.jpg", title: "OKGS Odyssey — the 5th Science Fair", category: "Films" },
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-scout.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-scout.jpg", title: "Scout display — 26 March", category: "Films" },
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-flashmob.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-flashmob.jpg", title: "Flash mob — ART Odyssey stage", category: "Films" },
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-greeting.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-greeting.jpg", title: "A simple greeting, a warm smile", category: "Films" },
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-handwriting.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-handwriting.jpg", title: "The handwriting class", category: "Films" },
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-craft.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-craft.jpg", title: "Making things with glue and paper", category: "Films" },
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-art.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-art.jpg", title: "Wall painting — the art period", category: "Films" },
  { src: "https://res.cloudinary.com/tt7oyjd1/video/upload/okgs/film/film-puzzle.mp4", poster: "https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/film/poster-film-puzzle.jpg", title: "The puzzle hour", category: "Films" },
];

function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [src, setSrc] = useState(MEDIA_PRESETS[0]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Campus");
  const [kind, setKind] = useState<"image" | "video">("image");
  const [poster, setPoster] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await fetchGallery());
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

  const add = async () => {
    if (!src.trim()) return;
    setBusy(true);
    setErr("");
    const res = await addGalleryItem({
      src: src.trim(),
      title: title.trim(),
      category: category.trim() || "Campus",
      kind,
      poster: kind === "video" ? poster.trim() || undefined : undefined,
    });
    setBusy(false);
    if (res.ok) {
      setTitle("");
      flash(kind === "video" ? "Film added to the gallery." : "Photo added to the gallery.");
      load();
    } else {
      setErr(res.error ?? "Could not add the item");
    }
  };

  const move = async (item: GalleryItem, dir: -1 | 1) => {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((g) => g.id === item.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await updateGalleryItem(item.id, { order: swap.order });
    await updateGalleryItem(swap.id, { order: item.order });
    load();
  };

  const remove = async (item: GalleryItem) => {
    if (!window.confirm(`Remove “${item.title || item.src}” from the gallery?`)) return;
    const res = await deleteGalleryItem(item.id);
    if (res.ok) {
      flash(item.kind === "video" ? "Film removed." : "Photo removed.");
      load();
    } else {
      setErr(res.error ?? "Delete failed");
    }
  };

  const rename = async (item: GalleryItem, patch: Partial<GalleryItem>) => {
    const res = await updateGalleryItem(item.id, patch);
    if (res.ok) load();
  };

  const sorted = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);

  return (
    <div className="panel mt-8 overflow-hidden rounded-[2rem]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-6 md:p-7">
        <h2 className="font-display flex items-center gap-3 text-xl font-semibold text-ink md:text-2xl">
          <Images className="h-5 w-5 text-gold" aria-hidden /> Photo &amp; film gallery
          <span className="font-mono2 text-xs font-normal text-white/40">{items.length} items</span>
        </h2>
        <button onClick={load} className="btn-ghost !px-4 !py-2 !text-sm" aria-label="Refresh">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden /> Refresh
        </button>
      </div>

      {(msg || err) && (
        <p className={`px-6 pt-4 text-[13px] md:px-7 ${err ? "text-red-400" : "text-emerald-400"}`}>{err || msg}</p>
      )}

      {/* add form */}
      <div className="border-b border-white/8 bg-white/[0.02] p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-gold-2">
            {kind === "video" ? "Add a film" : "Add a photo"}
          </h3>
          <div className="glass flex rounded-full p-1" role="tablist" aria-label="Item type">
            {(["image", "video"] as const).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={kind === k}
                onClick={() => {
                  setKind(k);
                  if (k === "video") {
                    const f = FILM_PRESETS[0];
                    setSrc(f.src); setPoster(f.poster); setTitle(f.title); setCategory(f.category);
                  } else {
                    setSrc(MEDIA_PRESETS[0]); setPoster("");
                  }
                }}
                className={`font-display rounded-full px-4 py-1.5 text-[13px] font-medium transition-all ${
                  kind === k ? "bg-gold text-void" : "text-white/55 hover:text-ink"
                }`}
              >
                {k === "image" ? "Photo" : "Film"}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-1 text-[13px] text-white/50">
          {kind === "video"
            ? "Pick one of the school films below, or paste any mp4 URL with its poster image."
            : "Pick a school photo from the presets, or paste any image URL (e.g. a Facebook photo address)."}
        </p>
        {kind === "image" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {MEDIA_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setSrc(p)}
                className={`overflow-hidden rounded-xl border transition-all ${
                  src === p ? "border-gold ring-2 ring-gold/40" : "border-white/15 hover:border-white/35"
                }`}
                title={p}
              >
                <img src={p} alt="" className="h-12 w-16 object-cover" />
              </button>
            ))}
          </div>
        )}
        {kind === "video" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {FILM_PRESETS.map((f) => (
              <button
                key={f.src}
                onClick={() => { setSrc(f.src); setPoster(f.poster); setTitle(f.title); setCategory(f.category); }}
                className={`overflow-hidden rounded-xl border transition-all ${
                  src === f.src ? "border-gold ring-2 ring-gold/40" : "border-white/15 hover:border-white/35"
                }`}
                title={f.title}
              >
                <img src={f.poster} alt="" className="h-12 w-20 object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
            {kind === "video" ? "Film URL" : "Image URL"}
            <input value={src} onChange={(e) => setSrc(e.target.value)} className="field mt-1.5 font-mono2 !text-[13px] normal-case tracking-normal" placeholder="https://…mp4 or https://…jpg" />
          </label>
          {kind === "video" && (
            <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
              Poster image
              <input value={poster} onChange={(e) => setPoster(e.target.value)} className="field mt-1.5 font-mono2 !text-[13px] normal-case tracking-normal" placeholder="https://res.cloudinary.com/…/poster-….jpg" />
            </label>
          )}
          <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
            Caption
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="field mt-1.5" placeholder="Science fair opening" />
          </label>
          <label className="block text-xs uppercase tracking-[0.18em] text-white/45">
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="field mt-1.5" placeholder="Campus, Films, Fair…" />
          </label>
          <div className="flex items-end">
            <button onClick={add} disabled={busy || !src.trim()} className="btn-gold !px-5 !py-2.5 !text-sm disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
              Add
            </button>
          </div>
        </div>
      </div>

      {/* list */}
      <div className="divide-y divide-white/6">
        {loading && items.length === 0 && (
          <p className="flex items-center gap-3 p-6 text-sm text-white/45">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading the gallery…
          </p>
        )}
        {sorted.map((g, i) => (
          <div key={g.id} className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-white/[0.025] md:px-7">
            {g.kind === "video" ? (
              <div className="relative shrink-0">
                <img src={g.poster || ""} alt="" className="h-14 w-20 rounded-lg bg-black object-cover" />
                <span className="font-mono2 absolute -right-1.5 -top-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-void">film</span>
              </div>
            ) : (
              <img src={g.src} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <input
                defaultValue={g.title}
                onBlur={(e) => e.target.value !== g.title && rename(g, { title: e.target.value })}
                className="w-full max-w-md rounded-lg border border-transparent bg-transparent px-2 py-1 font-editorial text-[15.5px] font-semibold text-ink transition-colors hover:border-white/15 focus:border-gold/50 focus:outline-none"
                aria-label="Caption"
              />
              <div className="mt-0.5 flex items-center gap-2 px-2">
                <input
                  defaultValue={g.category}
                  onBlur={(e) => e.target.value !== g.category && rename(g, { category: e.target.value })}
                  className="w-32 rounded border border-transparent bg-transparent px-1 py-0.5 font-mono2 text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:border-white/15 focus:border-gold/50 focus:outline-none"
                  aria-label="Category"
                />
                <span className="font-mono2 truncate text-[10px] text-white/30">{g.src}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => move(g, -1)} disabled={i === 0} className="glass flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:text-gold-2 disabled:opacity-30" title="Move up">
                <ArrowUp className="h-4 w-4" aria-hidden />
              </button>
              <button onClick={() => move(g, 1)} disabled={i === sorted.length - 1} className="glass flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:text-gold-2 disabled:opacity-30" title="Move down">
                <ArrowDown className="h-4 w-4" aria-hidden />
              </button>
              <button onClick={() => remove(g)} className="glass flex h-9 w-9 items-center justify-center rounded-lg text-red-400/70 transition-colors hover:text-red-400" title="Remove">
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="p-8 text-center text-sm text-white/45">
            The gallery is empty — add the first photo above.
          </p>
        )}
      </div>
    </div>
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
                placeholder="https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/cover-alssm.jpg"
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
