"use client";

/* PressView — #/press — the newsroom index.
   Category filters + search + a full archive of stories,
   styled per edition (paper editorial / cosmic newsroom). */

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search, Newspaper } from "lucide-react";
import { PRESS_CATEGORIES } from "@/lib/genesis/data";
import { useMode, fetchPosts, formatDate } from "@/lib/press";
import type { Post } from "@/lib/types";
import { Scramble, Reveal, StaggerGroup, StaggerItem, TiltCard, Anchor } from "../FX";

const CATEGORY_COLOR: Record<string, string> = {
  "Press Release": "#f0b429",
  News: "#7dd3fc",
  Notice: "#f472b6",
  Feature: "#c4b5fd",
  Club: "#34d399",
  Sports: "#fb923c",
  Achievement: "#f0b429",
};

export default function PressView() {
  const { mode } = useMode();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    const raf = requestAnimationFrame(() => {
      setLoading(true);
      fetchPosts({ category: cat, q, includeDrafts: false }, mode).then((p) => {
        if (alive) {
          setPosts(p);
          setLoading(false);
        }
      });
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [mode, cat, q]);

  const featured = useMemo(() => posts.find((p) => p.featured), [posts]);
  const rest = useMemo(() => posts.filter((p) => p !== featured), [posts, featured]);

  return (
    <main className="relative z-10">
      {/* header */}
      <section className="relative overflow-hidden pb-14 pt-40 md:pt-48">
        <div aria-hidden className="absolute inset-0" style={{
          background: "radial-gradient(50% 46% at 20% 12%, rgba(240,180,41,0.08), transparent 70%), radial-gradient(42% 50% at 82% 22%, rgba(139,92,246,0.07), transparent 70%)",
        }} />
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <Reveal>
            <span className="font-mono2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.34em] text-white/45 md:text-[11px]">
              <Newspaper className="h-3.5 w-3.5 text-gold" aria-hidden />
              The school desk · The archive
            </span>
          </Reveal>
          <h1 className="font-editorial mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
            <SplitLines text="The Journal" />
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-dim md:text-base">
              Every notice, club bulletin and story published by the school — one archive,
              searchable and filterable. Plain, quiet, complete.
            </p>
          </Reveal>

          {/* search + filters */}
          <Reveal delay={0.4}>
            <div className="mt-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search the archive…"
                  className="field !pl-11"
                  aria-label="Search stories"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESS_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`font-mono2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-all duration-300 ${
                      cat === c ? "btn-gold !px-4 !py-2 !text-[11px]" : "chip hover:border-gold/40"
                    }`}
                    aria-pressed={cat === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* archive */}
      <section className="relative pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="panel h-80 animate-pulse rounded-3xl" />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="panel rounded-3xl p-16 text-center">
              <p className="font-editorial text-2xl text-ink">Nothing filed under that byline yet.</p>
              <p className="mt-3 text-sm text-dim">Try another search, or clear the filters.</p>
              <button
                onClick={() => { setQ(""); setCat("All"); }}
                className="btn-ghost mt-7"
              >
                Reset the archive
              </button>
            </div>
          )}

          {!loading && featured && (
            <Reveal>
              <Anchor to={`/press/${featured.slug}`} className="block" onClick={() => {}}>
                <TiltCard max={3} className="group relative overflow-hidden rounded-[2rem] border border-white/10">
                  {featured.cover && (
                    <img src={featured.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-65" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/10" />
                  <div className="relative flex min-h-[380px] flex-col justify-end p-8 md:p-12">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="font-mono2 rounded-full px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.22em]"
                        style={{
                          background: `${CATEGORY_COLOR[featured.category] ?? "#f0b429"}1f`,
                          color: CATEGORY_COLOR[featured.category] ?? "#f0b429",
                          border: `1px solid ${(CATEGORY_COLOR[featured.category] ?? "#f0b429")}44`,
                        }}
                      >
                        Featured · {featured.category}
                      </span>
                      <span className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/50">{formatDate(featured.date)}</span>
                    </div>
                    <h2 className="font-editorial mt-5 max-w-3xl text-3xl font-semibold leading-tight text-ink md:text-5xl">
                      {featured.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">{featured.deck}</p>
                    <span className="font-display mt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-2">
                      Read the story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </TiltCard>
              </Anchor>
            </Reveal>
          )}

          {!loading && rest.length > 0 && (
            <StaggerGroup className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {rest.map((p) => (
                <StaggerItem key={p.id}>
                  <Anchor to={`/press/${p.slug}`} className="block h-full" onClick={() => {}}>
                    <TiltCard max={5} className="panel flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-gold/40">
                      {p.cover ? (
                        <div className="h-44 overflow-hidden">
                          <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                        </div>
                      ) : (
                        <div className="h-2 w-full" style={{ background: CATEGORY_COLOR[p.category] ?? "#f0b429" }} />
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="font-mono2 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em]"
                            style={{
                              background: `${CATEGORY_COLOR[p.category] ?? "#f0b429"}1f`,
                              color: CATEGORY_COLOR[p.category] ?? "#f0b429",
                              border: `1px solid ${(CATEGORY_COLOR[p.category] ?? "#f0b429")}44`,
                            }}
                          >
                            {p.category}
                          </span>
                          <span className="text-[11px] text-white/45">{formatDate(p.date)}</span>
                        </div>
                        <h3 className="font-editorial mt-4 text-xl font-semibold leading-snug text-ink md:text-2xl">
                          {p.title}
                        </h3>
                        <p className="mt-2.5 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-white/55">{p.deck}</p>
                        <p className="mt-5 border-t border-white/8 pt-4 text-[11px] uppercase tracking-[0.16em] text-white/40">
                          {p.author} · {p.role}
                        </p>
                      </div>
                    </TiltCard>
                  </Anchor>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>
    </main>
  );
}

/* split-lines headline without extra FX deps */
function SplitLines({ text }: { text: string }) {
  return (
    <span className="block overflow-hidden">
      <span className="block" style={{ animation: "gen-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>
        <Scramble text={text} />
      </span>
    </span>
  );
}
