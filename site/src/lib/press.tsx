"use client";

/* ============================================================
   OKGS PRESS — client mode provider + press API
   ------------------------------------------------------------
   The site runs in two editions from one codebase:

     mode = "fair"   → deep-space science-fair theme
     mode = "normal" → premium editorial paper theme

   The mode lives server-side in the backend (mock or Neon) and
   is mirrored into localStorage so the first paint is already
   on-theme. The admin studio toggles it for everyone.
   ============================================================ */

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { Post, Settings, SiteMode, Submission } from "@/lib/types";
import { SEED_POSTS } from "@/lib/server/seed";

/* ---------------- mode context ---------------- */

interface ModeCtx {
  mode: SiteMode;
  setMode: (m: SiteMode) => void;
  ready: boolean;
  isFair: boolean;
}

const ModeContext = createContext<ModeCtx>({ mode: "fair", setMode: () => {}, ready: false, isFair: true });

export const MODE_STORAGE_KEY = "okgs_mode";

function applyMode(m: SiteMode) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-mode", m);
    document.documentElement.style.colorScheme = m === "fair" ? "dark" : "light";
  }
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<SiteMode>("fair");
  const [ready, setReady] = useState(false);

  /* first paint: localStorage mirror (instant), then server truth */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const stored = (localStorage.getItem(MODE_STORAGE_KEY) as SiteMode | null) ?? "fair";
      setModeState(stored === "normal" ? "normal" : "fair");
      applyMode(stored === "normal" ? "normal" : "fair");
      setReady(true);
    });
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.settings?.mode) {
          const m = d.settings.mode as SiteMode;
          setModeState(m);
          applyMode(m);
          localStorage.setItem(MODE_STORAGE_KEY, m);
        }
      })
      .catch(() => {});
    return () => cancelAnimationFrame(raf);
  }, []);

  const setMode = useCallback((m: SiteMode) => {
    setModeState(m);
    applyMode(m);
    localStorage.setItem(MODE_STORAGE_KEY, m);
    /* persist server-side (admin key attached when signed in) */
    const key = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("okgs_admin_key") : null;
    fetch("/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json", ...(key ? { "x-admin-key": key } : {}) },
      body: JSON.stringify({ mode: m }),
    }).catch(() => {});
  }, []);

  const value = useMemo(() => ({ mode, setMode, ready, isFair: mode === "fair" }), [mode, setMode, ready]);
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);

/* ---------------- press API client ----------------
   Every call degrades gracefully: if the backend is unreachable
   (static hosting) the bundled seed data answers instead. */

const adminKey = () =>
  typeof sessionStorage !== "undefined" ? sessionStorage.getItem("okgs_admin_key") : null;

export interface PostQuery {
  category?: string;
  tag?: string;
  q?: string;
  limit?: number;
  includeDrafts?: boolean;
}

export async function fetchPosts(opts: PostQuery = {}, mode?: SiteMode): Promise<Post[]> {
  try {
    const sp = new URLSearchParams();
    if (opts.category) sp.set("category", opts.category);
    if (opts.tag) sp.set("tag", opts.tag);
    if (opts.q) sp.set("q", opts.q);
    if (opts.limit) sp.set("limit", String(opts.limit));
    if (opts.includeDrafts) sp.set("drafts", "1");
    const res = await fetch(`/api/posts?${sp.toString()}`);
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { posts: Post[] };
    return scopePosts(data.posts, mode);
  } catch {
    return scopePosts(
      SEED_POSTS.filter((p) => p.published || opts.includeDrafts),
      mode,
    ).filter((p) => {
      if (opts.category && opts.category !== "All" && p.category !== opts.category) return false;
      if (opts.q) {
        const q = opts.q.toLowerCase();
        if (!(p.title + p.deck + p.tags.join(" ")).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }
}

/** keep posts that match the current edition */
function scopePosts(posts: Post[], mode?: SiteMode): Post[] {
  if (!mode) return posts;
  return posts.filter((p) => p.scope === "both" || p.scope === mode);
}

export async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`/api/posts/${slug}`);
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { post: Post };
    return data.post;
  } catch {
    return SEED_POSTS.find((p) => p.slug === slug && p.published) ?? null;
  }
}

export async function fetchAllPostsAdmin(): Promise<Post[]> {
  try {
    const res = await fetch("/api/posts?drafts=1");
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { posts: Post[] };
    return data.posts;
  } catch {
    return SEED_POSTS;
  }
}

export async function createPost(payload: Partial<Post>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-key": adminKey() ?? "" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    return res.ok ? { ok: true } : { ok: false, error: data.error ?? `Error ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function updatePost(slug: string, patch: Partial<Post>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/posts/${slug}`, {
      method: "PUT",
      headers: { "content-type": "application/json", "x-admin-key": adminKey() ?? "" },
      body: JSON.stringify(patch),
    });
    const data = (await res.json()) as { error?: string };
    return res.ok ? { ok: true } : { ok: false, error: data.error ?? `Error ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function deletePost(slug: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/posts/${slug}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey() ?? "" },
    });
    const data = (await res.json()) as { error?: string };
    return res.ok ? { ok: true } : { ok: false, error: data.error ?? `Error ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function adminLogin(key: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      return { ok: false, error: data.error ?? "Invalid access key" };
    }
    sessionStorage.setItem("okgs_admin_key", key);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function fetchSubmissions(): Promise<Submission[]> {
  try {
    const res = await fetch("/api/submissions", { headers: { "x-admin-key": adminKey() ?? "" } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { submissions: Submission[] };
    return data.submissions;
  } catch {
    return [];
  }
}

export async function patchSubmission(id: string, status: Submission["status"]): Promise<boolean> {
  try {
    const res = await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-admin-key": adminKey() ?? "" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitInquiry(payload: {
  kind: "contact" | "register" | "tip";
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  extra?: Record<string, string>;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    return res.ok ? { ok: true } : { ok: false, error: data.error ?? `Error ${res.status}` };
  } catch {
    /* static-host fallback: queue locally so the UX still completes */
    try {
      const q = JSON.parse(localStorage.getItem("okgs_outbox") ?? "[]") as unknown[];
      q.push({ ...payload, createdAt: new Date().toISOString() });
      localStorage.setItem("okgs_outbox", JSON.stringify(q));
    } catch {}
    return { ok: true };
  }
}

/* ---------------- formatting helpers ---------------- */

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export function formatShortDate(iso: string): { day: string; month: string; year: string } {
  try {
    const d = new Date(iso);
    return {
      day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
      month: d.toLocaleDateString("en-GB", { month: "short" }),
      year: d.toLocaleDateString("en-GB", { year: "numeric" }),
    };
  } catch {
    return { day: "—", month: "—", year: "—" };
  }
}
