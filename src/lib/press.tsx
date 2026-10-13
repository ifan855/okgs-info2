"use client";

/* ============================================================
   OKGS — client mode provider + site API
   ------------------------------------------------------------
   The site runs in two editions from one codebase:

     mode = "fair"   → deep-space science-fair theme
     mode = "normal" → school landing theme

   The mode AND the fair identity (name + tagline) live
   server-side in the backend (mock or Neon) and are mirrored
   into localStorage so the first paint is already on-theme.
   The admin studio toggles them for everyone.
   ============================================================ */

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { GalleryItem, Post, Settings, SiteMode, Submission } from "@/lib/types";
import { fairTitle } from "@/lib/types";
import { SEED_POSTS, SEED_GALLERY } from "@/lib/server/seed";

/* ---------------- settings cache (instant first paint) ---------------- */

export const MODE_STORAGE_KEY = "okgs_mode";
const SETTINGS_CACHE_KEY = "okgs_settings_cache";

interface CachedSettings {
  mode: SiteMode;
  fairName: string;
  fairTagline: string;
}

export function readCachedSettings(): CachedSettings {
  const fallback: CachedSettings = { mode: "fair", fairName: "OKGS GENESIS 2026", fairTagline: "Exploring the Universe of Science" };
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!raw) return fallback;
    const c = JSON.parse(raw) as Partial<CachedSettings>;
    return {
      mode: c.mode === "normal" ? "normal" : "fair",
      fairName: (c.fairName ?? "").trim() || fallback.fairName,
      fairTagline: (c.fairTagline ?? "").trim(),
    };
  } catch {
    return fallback;
  }
}

function cacheSettings(s: Settings) {
  try {
    localStorage.setItem(
      SETTINGS_CACHE_KEY,
      JSON.stringify({ mode: s.mode, fairName: s.fairName, fairTagline: s.fairTagline } satisfies CachedSettings),
    );
  } catch {}
}

/* ---------------- mode + fair identity context ---------------- */

interface ModeCtx {
  mode: SiteMode;
  setMode: (m: SiteMode) => void;
  ready: boolean;
  isFair: boolean;
  /** the science fair's main name, e.g. "OKGS GENESIS 2026" */
  fairName: string;
  /** the fair's tagline, e.g. "Exploring the Universe of Science" */
  fairTagline: string;
  /** name + tagline ALWAYS joined with a colon */
  fairTitle: string;
  /** live-update the fair identity after the studio saves it */
  applyFairIdentity: (fairName: string, fairTagline: string) => void;
}

const ModeContext = createContext<ModeCtx>({
  mode: "fair",
  setMode: () => {},
  ready: false,
  isFair: true,
  fairName: "OKGS GENESIS 2026",
  fairTagline: "Exploring the Universe of Science",
  fairTitle: "OKGS GENESIS 2026: Exploring the Universe of Science",
  applyFairIdentity: () => {},
});

function applyMode(m: SiteMode) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-mode", m);
    document.documentElement.style.colorScheme = m === "fair" ? "dark" : "light";
  }
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const cached = useMemo(() => readCachedSettings(), []);
  const [mode, setModeState] = useState<SiteMode>(cached.mode);
  const [fairName, setFairName] = useState(cached.fairName);
  const [fairTagline, setFairTagline] = useState(cached.fairTagline);
  const [ready, setReady] = useState(false);

  /* first paint: localStorage mirror (instant), then server truth */
  useEffect(() => {
    applyMode(cached.mode);
    const raf = requestAnimationFrame(() => setReady(true));
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.settings?.mode) {
          const s = d.settings as Settings;
          setModeState(s.mode);
          setFairName((s.fairName ?? "").trim() || cached.fairName);
          setFairTagline((s.fairTagline ?? "").trim());
          applyMode(s.mode);
          cacheSettings(s);
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

  /* keep the browser tab title on the active edition + fair identity */
  useEffect(() => {
    document.title = mode === "fair"
      ? fairTitle({ fairName, fairTagline })
      : "Omar K.G. School — Quality education for all";
  }, [mode, fairName, fairTagline]);

  const applyFairIdentity = useCallback((name: string, tagline: string) => {
    const n = name.trim() || "OKGS GENESIS 2026";
    setFairName(n);
    setFairTagline(tagline.trim());
    cacheSettings({ mode, fairName: n, fairTagline: tagline.trim() } as Settings);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      ready,
      isFair: mode === "fair",
      fairName,
      fairTagline,
      fairTitle: fairTitle({ fairName, fairTagline }),
      applyFairIdentity,
    }),
    [mode, setMode, ready, fairName, fairTagline, applyFairIdentity],
  );
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export const useMode = () => useContext(ModeContext);

/* ---------------- site API client ----------------
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

/* ---------------- gallery (admin-curated) ---------------- */

export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch("/api/gallery");
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { gallery: GalleryItem[] };
    return data.gallery;
  } catch {
    return [...SEED_GALLERY].sort((a, b) => a.order - b.order);
  }
}

export async function addGalleryItem(payload: { src: string; title: string; category: string; kind?: "image" | "video"; poster?: string }): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/gallery", {
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

export async function updateGalleryItem(id: string, patch: Partial<GalleryItem>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/gallery/${id}`, {
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

export async function deleteGalleryItem(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey() ?? "" },
    });
    const data = (await res.json()) as { error?: string };
    return res.ok ? { ok: true } : { ok: false, error: data.error ?? `Error ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

/* ---------------- admin auth ---------------- */

export async function adminLogin(key: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      return { ok: false, error: data.error ?? "Incorrect password" };
    }
    sessionStorage.setItem("okgs_admin_key", key);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function changeAdminPassword(currentKey: string, newKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth", {
      method: "PUT",
      headers: { "content-type": "application/json", "x-admin-key": adminKey() ?? "" },
      body: JSON.stringify({ currentKey, newKey }),
    });
    const data = (await res.json()) as { error?: string };
    if (res.ok) {
      sessionStorage.setItem("okgs_admin_key", newKey);
      return { ok: true };
    }
    return { ok: false, error: data.error ?? `Error ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

/* ---------------- submissions ---------------- */

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
