"use client";

/* GalleryView — #/gallery — the photo & film archive, curated
   entirely from the admin studio. Only real school media appears:
   the strip of generic space art is gone for good. Video items
   play in the same lightbox, with sound. */

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Expand, ImageOff, Play } from "lucide-react";
import { fetchGallery } from "@/lib/press";
import type { GalleryItem } from "@/lib/types";
import { SplitText, Reveal, Anchor } from "../FX";

const FILTERS_BASE = ["All"];

export default function GalleryView() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let alive = true;
    fetchGallery().then((g) => {
      if (alive) {
        setItems(g);
        setLoaded(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return [...FILTERS_BASE, ...Array.from(set).sort()];
  }, [items]);

  const shown = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  return (
    <main className="relative z-10">
      <section className="relative overflow-hidden pb-10 pt-40 nebula grain md:pt-48">
        <div aria-hidden className="aurora" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal y={12}>
            <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50">
              <Anchor to="/" className="transition-colors hover:text-gold-2">Home</Anchor>
              <span className="mx-2 text-gold">/</span>
              <span className="text-gold-2">Gallery</span>
            </p>
          </Reveal>
          <h1 className="font-display mt-6 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            <SplitText text="The Photo" className="block" letterClassName="text-cosmic-gradient" />
            <SplitText text="Archive" delay={0.3} className="block text-ink" />
          </h1>
          <Reveal delay={0.4}>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-dim md:text-base">
              Real campus photography — corridors, classrooms, the crest and the five
              club banners — chosen by the school office in the admin studio. Photos
              from fair week will dock here right after the event.
            </p>
          </Reveal>

          {categories.length > 1 && (
            <Reveal delay={0.5} className="mt-9 flex flex-wrap gap-2.5">
              {categories.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`chip transition-all duration-300 hover:-translate-y-0.5 ${
                    filter === f ? "border-gold/60 bg-gold/15 text-gold-2" : ""
                  }`}
                >
                  {f}
                </button>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      <section className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          {loaded && shown.length === 0 ? (
            <div className="panel flex items-center gap-4 rounded-3xl p-10 text-dim">
              <ImageOff className="h-6 w-6 shrink-0" aria-hidden />
              <div>
                <p className="font-display text-base font-semibold text-ink">Nothing here yet</p>
                <p className="mt-1 text-sm">
                  {filter === "All"
                    ? "The gallery is being curated — photos will appear once the office publishes them."
                    : `No photos filed under “${filter}” yet.`}
                </p>
              </div>
            </div>
          ) : (
            <div key={filter} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => setLightbox(it)}
                  data-cursor="expand"
                  aria-label={`Open ${it.title || "photo"}`}
                  className={`pop-in group relative block w-full overflow-hidden rounded-2xl border border-white/10 ${
                    i % 5 === 0 ? "row-span-2 aspect-[3/4.6]" : "aspect-[4/3]"
                  }`}
                  style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
                >
                  {it.kind === "video" ? (
                    <video
                      src={it.src}
                      poster={it.poster || undefined}
                      muted
                      loop
                      playsInline
                      preload="none"
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => { e.currentTarget.pause(); }}
                    />
                  ) : (
                    <img
                      src={it.src}
                      alt={it.title || "Campus photograph"}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {it.kind === "video" && (
                    <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-void/70 text-ink backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-gold/70 group-hover:bg-gold group-hover:text-void">
                      <Play className="ml-0.5 h-4.5 w-4.5 fill-current" aria-hidden />
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  {it.category && (
                    <span className="font-mono2 absolute left-3 top-3 rounded-full border border-white/15 bg-void/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                      {it.category}
                    </span>
                  )}
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-void/60 text-white/80 opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                    <Expand className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {it.title && (
                    <p className="absolute bottom-0 left-0 right-0 p-4 text-left text-[13px] font-medium leading-snug text-white/85 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-2">
                      {it.title}
                    </p>
                  )}
                </button>
              ))}
              {!loaded &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-white/[0.04]" />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* lightbox — portaled to <body> to escape the z-10 main context */}
      {lightbox && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[92] flex items-center justify-center bg-void/90 p-5 backdrop-blur-xl"
          style={{ animation: "fade-in 0.3s ease-out both" }}
          onClick={() => setLightbox(null)}
        >
          <figure
            className="pop-in relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.kind === "video" ? (
              <video
                src={lightbox.src}
                poster={lightbox.poster || undefined}
                controls
                autoPlay
                playsInline
                className="max-h-[70vh] w-full bg-black"
              />
            ) : (
              <img src={lightbox.src} alt={lightbox.title || "Campus photograph"} className="max-h-[75vh] w-full object-cover" />
            )}
            <figcaption className="flex items-center justify-between gap-4 bg-void/80 px-6 py-4 text-sm text-white/75">
              {lightbox.title || "Untitled photograph"}
              <span className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-gold-2">{lightbox.category}</span>
            </figcaption>
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ink"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </figure>
        </div>,
        document.body,
      )}
    </main>
  );
}
