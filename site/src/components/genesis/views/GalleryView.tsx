"use client";

/* GalleryView — #/gallery — cosmic visual archive with filters + lightbox */

import { useMemo, useState } from "react";
import { X, Expand } from "lucide-react";
import { CLUBS } from "@/lib/genesis/data";
import { SplitText, Reveal, SectionHead, Anchor } from "../FX";

interface Item {
  src: string;
  title: string;
  cat: string;
  tall?: boolean;
}

const ITEMS: Item[] = [
  /* real campus photography — from the school's own channels */
  { src: "/media/real/campus-1.jpg", title: "The school corridors — real campus, Kalai", cat: "Campus", tall: true },
  { src: "/media/real/cover-alssm.jpg", title: "Math & Science Club — official club banner", cat: "ALSSM" },
  { src: "/media/real/crest.jpg", title: "The OKGS crest — established 2003", cat: "Campus", tall: true },
  { src: "/media/real/cover-alpcg.jpg", title: "Programmers' Club — official club banner", cat: "ALPCG" },
  { src: "/media/real/cover-aypg.jpg", title: "Language Club — official club banner", cat: "AYPG" },
  /* cosmic concept art */
  { src: "/media/hero-nebula.png", title: "The Genesis Nebula — fair key visual", cat: "Cosmos", tall: false },
  { src: "/media/gallery-telescope.png", title: "Astronomy night with the school telescope", cat: "ALSSM", tall: true },
  { src: "/media/club-science.png", title: "Lab flasks of stardust — ALSSM", cat: "ALSSM" },
  { src: "/media/gallery-rocket.png", title: "Model launch day", cat: "Fair", tall: true },
  { src: "/media/club-language.png", title: "Pages turning into stardust — AYPG", cat: "AYPG" },
  { src: "/media/gallery-dna.png", title: "The code of life, drawn in light", cat: "Cosmos", tall: true },
  { src: "/media/club-code.png", title: "Code & Create lab — ALPCG", cat: "ALPCG" },
  { src: "/media/gallery-orrery.png", title: "The brass orrery — solar system model", cat: "Fair", tall: true },
  { src: "/media/club-sports.png", title: "Leap between worlds — AYGSM", cat: "AYGSM" },
  { src: "/media/gallery-astronaut.png", title: "One small step for Kalai", cat: "Cosmos" },
  { src: "/media/club-debate.png", title: "The debate floor — ARTDS", cat: "ARTDS" },
  { src: "/media/cta-galaxy.png", title: "Spiral galaxy over the campus", cat: "Cosmos" },
];

const FILTERS = ["All", "Campus", "Fair", "Cosmos", ...CLUBS.map((c) => c.code)];

export default function GalleryView() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<Item | null>(null);

  const shown = useMemo(
    () => (filter === "All" ? ITEMS : ITEMS.filter((i) => i.cat === filter)),
    [filter],
  );

  return (
    <main className="relative z-10">
      <section className="relative overflow-hidden pb-10 pt-40 nebula grain md:pt-48">
        <div aria-hidden className="absolute inset-0">
          <img src="/media/gallery-telescope.png" alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/60 to-void" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal y={12}>
            <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50">
              <Anchor to="/" className="transition-colors hover:text-gold-2">Home</Anchor>
              <span className="mx-2 text-gold">/</span>
              <span className="text-gold-2">Gallery</span>
            </p>
          </Reveal>
          <h1 className="font-display mt-6 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            <SplitText text="The Visual" className="block" letterClassName="text-cosmic-gradient" />
            <SplitText text="Archive" delay={0.3} className="block text-ink" />
          </h1>
          <Reveal delay={0.4}>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-dim md:text-base">
              Real campus photography and official club banners alongside the concept
              art of the Genesis universe — club emblems, arena backdrops and cosmic
              vignettes. Photos from fair day will dock here right after the event.
            </p>
          </Reveal>

          <Reveal delay={0.5} className="mt-9 flex flex-wrap gap-2.5">
            {FILTERS.map((f) => (
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
        </div>
      </section>

      <section className="relative py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div key={filter} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {shown.map((it, i) => (
              <button
                key={it.src + it.title}
                onClick={() => setLightbox(it)}
                data-cursor="expand"
                aria-label={`Open ${it.title}`}
                className={`pop-in group relative block w-full overflow-hidden rounded-2xl border border-white/10 ${
                  it.tall ? "row-span-2 aspect-[3/4.6]" : "aspect-[4/3]"
                }`}
                style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
              >
                <img
                  src={it.src}
                  alt={it.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="font-mono2 absolute left-3 top-3 rounded-full border border-white/15 bg-void/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                  {it.cat}
                </span>
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-void/60 text-white/80 opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
                  <Expand className="h-3.5 w-3.5" aria-hidden />
                </span>
                <p className="absolute bottom-0 left-0 right-0 p-4 text-left text-[13px] font-medium leading-snug text-white/85 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-2">
                  {it.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[92] flex items-center justify-center bg-void/90 p-5 backdrop-blur-xl"
          style={{ animation: "wipe-fade 0.3s ease-out both" }}
          onClick={() => setLightbox(null)}
        >
          <figure
            className="pop-in relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightbox.src} alt={lightbox.title} className="max-h-[75vh] w-full object-cover" />
            <figcaption className="flex items-center justify-between gap-4 bg-void/80 px-6 py-4 text-sm text-white/75">
              {lightbox.title}
              <span className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-gold-2">{lightbox.cat}</span>
            </figcaption>
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ink"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </figure>
        </div>
      )}
    </main>
  );
}
