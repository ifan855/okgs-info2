"use client";

/* ============================================================
   FilmBox — the film desk's two pieces:
   · FilmCard   poster-first card; hovering snaps into a muted
                preview (quick-cut energy), leaving resets it.
   · FilmModal  the lightbox player — user-initiated, so sound
                is on and native controls take over.
   Reduced motion → cards never auto-preview; click still plays.
   ============================================================ */

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Play, X, Clock3 } from "lucide-react";
import type { Film } from "@/lib/types";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function FilmCard({
  film,
  onOpen,
  tall = false,
}: {
  film: Film;
  onOpen: (f: Film) => void;
  tall?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const preview = () => {
    const v = ref.current;
    if (!v || prefersReduced()) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    try { v.currentTime = 0; } catch { /* fresh src */ }
  };

  return (
    <button
      onClick={() => onOpen(film)}
      onMouseEnter={preview}
      onMouseLeave={stop}
      onFocus={preview}
      onBlur={stop}
      data-cursor="play"
      aria-label={`Play the film — ${film.title}`}
      className="film-card pop-in group relative block w-full overflow-hidden rounded-[1.6rem] border border-white/12 text-left transition-colors duration-300 hover:border-gold/50"
    >
      <div className={`relative w-full overflow-hidden ${tall ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
        <img
          src={film.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
        >
          <source src={film.src} type="video/mp4" />
        </video>

        {/* scrim — solid, not washed out */}
        <div className="absolute inset-0 film-scrim-tight" aria-hidden />

        {/* play affordance */}
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-void/70 text-ink shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-gold/70 group-hover:bg-gold group-hover:text-void">
          <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
        </span>

        {/* duration */}
        <span className="font-mono2 absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-void/75 px-2.5 py-1 text-[10px] tracking-[0.14em] text-white/80">
          <Clock3 className="h-3 w-3 text-gold" aria-hidden />
          {film.length}
        </span>
      </div>

      {/* caption slab — solid by design */}
      <div className="relative border-t border-white/10 bg-void/85 px-5 py-4">
        <p className="font-display text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-gold-2">
          {film.title}
        </p>
        {film.captionBn && (
          <p className="font-bangla mt-1 text-[12.5px] leading-relaxed text-white/60">{film.captionBn}</p>
        )}
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-white/55">{film.caption}</p>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-90"
      />
    </button>
  );
}

export function FilmModal({ film, onClose }: { film: Film; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  /* portal to <body> so the dialog escapes any z-indexed ancestor
     (main is z-10; the navbar is z-80 — the modal must beat both) */
  return createPortal(
    <div
      className="fixed inset-0 z-[93] flex items-center justify-center bg-void/94 p-4 backdrop-blur-xl md:p-8"
      style={{ animation: "fade-in 0.25s ease-out both" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={film.title}
    >
      <figure
        className="pop-in relative w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-void"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={film.src}
          poster={film.poster}
          controls
          autoPlay
          playsInline
          className="max-h-[72vh] w-full bg-black"
        />
        <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-void/90 px-6 py-4">
          <div className="min-w-0">
            <p className="font-display text-[15px] font-semibold text-ink">{film.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-relaxed text-white/55">{film.caption}</p>
          </div>
          <span className="font-mono2 shrink-0 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold-2">
            OKGS film · {film.length}
          </span>
        </figcaption>
        <button
          onClick={onClose}
          aria-label="Close the film"
          className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ink"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </figure>
    </div>,
    document.body,
  );
}
