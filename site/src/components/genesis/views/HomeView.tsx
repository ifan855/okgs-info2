"use client";

/* HomeView — the front page of the OKGS press site.
   normal mode → premium editorial masthead (paper, serif lead story)
   fair mode   → cosmic Genesis hero over the same newsroom wire.
   Both editions share: wire ticker, front-page stories, clubs
   constellation, stats band and the press desk. */

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, ArrowUpRight, MapPin, CalendarDays, TicketCheck,
  Sparkles, Rocket, ChevronDown, Newspaper, Radio, PenLine, Mail, ShieldCheck,
} from "lucide-react";
import { FAIR, ARENAS, CLUBS, MARQUEE_ITEMS, STATS, TIMELINE, SITE } from "@/lib/genesis/data";
import { useMode, fetchPosts, formatDate } from "@/lib/press";
import type { Post } from "@/lib/types";
import { SplitText, Scramble, Reveal, StaggerGroup, StaggerItem, Counter, Marquee, Magnetic, TiltCard, SectionHead, Anchor, StarDots } from "../FX";
import Countdown from "../Countdown";
import IconFor from "../IconFor";

export default function HomeView() {
  const { isFair } = useMode();
  return (
    <main className="relative z-10">
      {isFair ? <FairHero /> : <EditorialHero />}
      <WireTicker />
      <FrontPage />
      {isFair && <ArenasPreview />}
      <ClubsConstellation />
      <StatsBand />
      {isFair && <TimelineStrip />}
      <PressDeskBand />
      {isFair && <CtaBanner />}
    </main>
  );
}

/* ======================= shared newsroom data ======================= */
function useWire(limit = 8): Post[] {
  const { mode } = useMode();
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    let alive = true;
    fetchPosts({ limit }, mode).then((p) => alive && setPosts(p));
    return () => {
      alive = false;
    };
  }, [mode, limit]);
  return posts;
}

const CATEGORY_COLOR: Record<string, string> = {
  "Press Release": "#f0b429",
  News: "#7dd3fc",
  Notice: "#f472b6",
  Feature: "#c4b5fd",
  Club: "#34d399",
  Sports: "#fb923c",
  Achievement: "#f0b429",
};

function CategoryChip({ post }: { post: Post }) {
  const c = CATEGORY_COLOR[post.category] ?? "#f0b429";
  return (
    <span
      className="font-mono2 rounded-full px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.22em]"
      style={{ background: `${c}1f`, color: c, border: `1px solid ${c}44` }}
    >
      {post.category}
    </span>
  );
}

/* ======================= FAIR HERO (cosmic) ======================= */
function FairHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden nebula grain">
      <motion.div aria-hidden style={{ y: yBg }} className="absolute inset-0">
        <img
          src="/media/hero-nebula.png"
          alt=""
          className="h-full w-full object-cover opacity-45"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/35 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/85 via-transparent to-void/40" />
      </motion.div>
      <StarDots count={34} />

      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="relative h-[620px] w-[620px]">
          <div className="orbit-ring animate-spin-slower" style={{ animationDuration: "70s" }}>
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_18px_rgba(240,180,41,0.9)]" />
          </div>
          <div className="orbit-ring animate-spin-slower" style={{ inset: "17%", animationDuration: "46s", animationDirection: "reverse" }}>
            <span className="absolute top-1/2 -right-1 h-2 w-2 rounded-full bg-nova-2 shadow-[0_0_14px_rgba(196,181,253,0.9)]" />
          </div>
          <div className="orbit-ring" style={{ inset: "34%", borderColor: "rgba(240,180,41,0.22)" }} />
          <div className="animate-floaty absolute inset-0 m-auto h-44 w-44 rounded-full" style={{
            background: "radial-gradient(circle at 32% 30%, #ffe9ad 0%, #f0b429 28%, #7c5ce0 62%, #241a52 100%)",
            boxShadow: "0 0 90px rgba(240,180,41,0.4), inset -22px -18px 60px rgba(5,5,15,0.75)",
          }}>
            <div className="absolute left-1/2 top-1/2 h-[130%] w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border-t-2 border-gold/40" style={{ transform: "translate(-50%,-50%) rotate(-18deg)" }} />
          </div>
        </div>
      </div>

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 md:px-10 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="chip border-gold/30 bg-gold/8 text-gold-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" style={{ animation: "ping-dot 1.8s ease-out infinite" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Registration open · free entry
          </span>
          <span className="chip hidden sm:inline-flex"><Newspaper className="h-3.5 w-3.5 text-gold" aria-hidden /> Press bureau live</span>
          <span className="chip hidden md:inline-flex">{SITE.schoolBn}</span>
        </motion.div>

        {/* the main line — OKGS GENESIS 2026 */}
        <motion.div style={{ y: yTitle }} className="mt-7">
          <h1>
            <span className="font-display block overflow-hidden">
              <SplitText
                text="OKGS"
                delay={0.45}
                stagger={0.06}
                className="block text-[13vw] font-bold leading-[0.95] tracking-[0.04em] text-ink sm:text-[9vw] lg:text-[7.5rem]"
              />
            </span>
            <span className="font-display block overflow-hidden">
              <SplitText
                text="GENESIS"
                delay={0.75}
                stagger={0.07}
                className="block text-[17vw] font-bold leading-[0.95] tracking-[0.02em] sm:text-[12vw] lg:text-[10rem]" letterClassName="text-gold-gradient"
              />
            </span>
          </h1>
          <div className="mt-1 flex items-baseline gap-4 overflow-hidden">
            <SplitText
              text="2026"
              delay={1.25}
              stagger={0.09}
              className="font-display text-[10vw] font-bold leading-none sm:text-[7vw] lg:text-[5.5rem]" letterClassName="text-outline-gold"
            />
            <motion.p
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 1.55 }}
              className="font-display pb-2 text-lg font-medium leading-snug text-white/85 md:text-2xl"
            >
              Exploring the <span className="text-gold-2 italic">Universe</span> of Science
              <span className="font-bangla mt-1 block text-[13px] font-normal text-white/50 md:text-sm">
                {SITE.taglineBn} · বিজ্ঞান মেলা ২০২৬
              </span>
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.7 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <span className="chip"><CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.datesLabel}</span>
          <span className="chip"><MapPin className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.venue}, Kalai</span>
          <span className="chip"><TicketCheck className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.entry}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.85 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Anchor to="/register" className="btn-gold" onClick={() => {}}>
              <Rocket className="h-4 w-4" aria-hidden />
              Register your project
            </Anchor>
          </Magnetic>
          <Magnetic>
            <Anchor to="/press" className="btn-ghost" onClick={() => {}}>
              Read the coverage
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2 }}
          className="mt-12"
        >
          <p className="font-mono2 mb-3 text-[10px] uppercase tracking-[0.34em] text-white/45">
            T-minus · until ignition
          </p>
          <Countdown />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-white/45">
          <span className="font-mono2 text-[9px] uppercase tracking-[0.4em]">scroll</span>
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}

/* ======================= EDITORIAL HERO (paper) ======================= */
function EditorialHero() {
  const posts = useWire(6);
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <section className="relative overflow-hidden grain">
      {/* paper washes */}
      <div aria-hidden className="absolute inset-0" style={{
        background:
          "radial-gradient(46% 40% at 12% 8%, rgba(217,119,6,0.06), transparent 70%), radial-gradient(40% 44% at 88% 20%, rgba(124,58,237,0.05), transparent 70%)",
      }} />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 md:px-10 md:pt-40">
        {/* masthead row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45 md:text-[11px]" style={{ fontFamily: "var(--font-mono2)" }}>
          <span>{SITE.pressName}</span>
          <span className="hidden md:inline">{today}</span>
          <span>Kalai · Joypurhat · Est. 2003</span>
        </div>
        <div className="hairline mt-4" />

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Scramble text="TODAY'S LEAD" className="eyebrow" />
            {lead ? (
              <>
                <h1 className="font-editorial mt-6 text-4xl font-semibold leading-[1.08] text-ink md:text-6xl">
                  <Anchor to={`/press/${lead.slug}`} className="transition-colors hover:text-gold-2" onClick={() => {}}>
                    {lead.title}
                  </Anchor>
                </h1>
                <p className="font-editorial mt-6 max-w-2xl text-lg italic leading-relaxed text-white/65 md:text-xl">
                  {lead.deck}
                </p>
                <p className="mt-6 text-[13px] tracking-wide text-white/45">
                  By {lead.author} · {lead.role} · {formatDate(lead.date)}
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Magnetic>
                    <Anchor to={`/press/${lead.slug}`} className="btn-gold" onClick={() => {}}>
                      Read the story <ArrowRight className="h-4 w-4" aria-hidden />
                    </Anchor>
                  </Magnetic>
                  <Magnetic>
                    <Anchor to="/press" className="btn-ghost" onClick={() => {}}>
                      Browse the newsroom <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </Anchor>
                  </Magnetic>
                </div>
              </>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="h-12 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="h-12 w-3/5 animate-pulse rounded bg-white/10" />
              </div>
            )}
          </div>

          {/* paper photo frame */}
          <Reveal delay={0.25}>
            <div className="panel rounded-2xl p-3 shadow-[0_24px_60px_-30px_rgba(20,32,51,0.45)]">
              <img
                src="/media/real/cover-alssm.jpg"
                alt="Science laboratory at Omar K.G. School"
                className="h-64 w-full rounded-lg object-cover md:h-80"
              />
              <p className="mt-3 flex items-center justify-between px-1 text-[11px] text-white/50">
                <span>The science laboratory — home of ALSSM</span>
                <span style={{ fontFamily: "var(--font-mono2)" }}>FIG. 01</span>
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { k: "1100+", v: "students on roll" },
                { k: "2003", v: "founded, by A. R. Talukdar" },
                { k: "05", v: "clubs on their own sites" },
                { k: "100%", v: "public exam pass rate" },
              ].map((s) => (
                <div key={s.k} className="border-l-2 border-gold/50 pl-3">
                  <p className="font-editorial text-2xl font-semibold text-ink">{s.k}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/45">{s.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ======================= WIRE TICKER ======================= */
function WireTicker() {
  const { isFair } = useMode();
  const posts = useWire(10);
  const items = isFair && posts.length === 0 ? MARQUEE_ITEMS : posts.map((p) => p.title);

  return (
    <div className="relative z-10 border-y border-white/8 bg-[#07071a]/80 py-4 backdrop-blur [data-mode='normal']:border-black/10 [data-mode='normal']:bg-black/[0.035]">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 md:px-10">
        <span className="hidden shrink-0 items-center gap-2 md:flex">
          <Radio className="h-4 w-4 text-gold" aria-hidden />
          <span className="font-mono2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-2">The Wire</span>
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <Marquee
            items={items.map((t, i) => (
              <span key={i} className="text-[13px] font-medium tracking-wide text-white/70 md:text-sm">
                <span className="mx-4 text-gold/60">●</span>
                {t}
              </span>
            ))}
          />
        </div>
      </div>
    </div>
  );
}

/* ======================= FRONT PAGE STORIES ======================= */
function FrontPage() {
  const posts = useWire(7);
  const [lead, ...rest] = posts;

  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="From the newsroom"
            title="Latest dispatches"
            sub="Press releases, club bulletins, notices and features — filed by the OKGS Press Desk and the five club correspondents."
          />
          <Reveal delay={0.25}>
            <Anchor to="/press" className="btn-ghost !py-3" onClick={() => {}}>
              All stories <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Reveal>
        </div>

        {!lead && (
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="panel h-72 animate-pulse rounded-3xl" />
            ))}
          </div>
        )}

        {lead && (
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* lead card */}
            <Reveal>
              <Anchor to={`/press/${lead.slug}`} className="block h-full" onClick={() => {}}>
                <TiltCard max={4} className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10">
                  {lead.cover && (
                    <img src={lead.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/10" />
                  <div className="relative flex min-h-[420px] flex-col justify-end p-8 md:p-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <CategoryChip post={lead} />
                      <span className="font-mono2 text-[10px] uppercase tracking-[0.22em] text-white/50">{formatDate(lead.date)}</span>
                    </div>
                    <h2 className="font-editorial mt-5 max-w-xl text-3xl font-semibold leading-tight text-ink md:text-4xl">
                      {lead.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">{lead.deck}</p>
                    <span className="font-display mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-2">
                      Full story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </TiltCard>
              </Anchor>
            </Reveal>

            {/* stack */}
            <StaggerGroup className="grid gap-5 sm:grid-cols-2" stagger={0.08}>
              {rest.slice(0, 4).map((p) => (
                <StaggerItem key={p.id}>
                  <Anchor to={`/press/${p.slug}`} className="block h-full" onClick={() => {}}>
                    <TiltCard max={5} className="panel flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-gold/40">
                      {p.cover && (
                        <div className="h-36 overflow-hidden">
                          <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryChip post={p} />
                          <span className="text-[11px] text-white/45">{formatDate(p.date)}</span>
                        </div>
                        <h3 className="font-editorial mt-3 text-lg font-semibold leading-snug text-ink transition-colors hover:text-gold-2 md:text-xl">
                          {p.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/55">{p.deck}</p>
                        <p className="mt-auto pt-4 text-[11px] uppercase tracking-[0.16em] text-white/40">{p.author}</p>
                      </div>
                    </TiltCard>
                  </Anchor>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        )}
      </div>
    </section>
  );
}

/* ======================= ARENAS (fair only) ======================= */
function ArenasPreview() {
  return (
    <section className="relative z-10 nebula grain py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Choose your arena"
            title="Seven ways to shine"
            sub="Every arena is judged on published criteria, with champions and runners-up in three class groups. Pick the mission that fits your crew."
          />
          <Reveal delay={0.3}>
            <Anchor to="/genesis" className="btn-ghost !py-3" onClick={() => {}}>
              All arena rules <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Reveal>
        </div>

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.07}>
          {ARENAS.map((a, i) => (
            <StaggerItem key={a.id} className={i === 0 ? "sm:col-span-2 lg:col-span-2 xl:col-span-2" : ""}>
              <Anchor to={`/genesis#${a.id}`} className="block h-full" onClick={() => {}}>
                <TiltCard className="panel group relative h-full overflow-hidden rounded-3xl p-6 transition-colors duration-500 hover:border-gold/40">
                  <div className="flex items-start justify-between">
                    <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl text-gold-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <IconFor name={a.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-mono2 text-xs tracking-[0.3em] text-white/30">{a.index}</span>
                  </div>
                  <h3 className="font-display mt-6 text-xl font-semibold text-ink transition-colors group-hover:text-gold-2">
                    {a.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dim">{a.desc}</p>
                  <div className="mt-5 flex items-center gap-2 text-[11px] text-white/45">
                    <Sparkles className="h-3.5 w-3.5 text-gold/70" aria-hidden />
                    {a.team} · {a.classes.split("·")[0]}
                  </div>
                  <span className="absolute -bottom-6 -right-4 font-display text-7xl font-bold text-white/[0.03] transition-all duration-500 group-hover:text-white/[0.06]">
                    {a.index}
                  </span>
                </TiltCard>
              </Anchor>
            </StaggerItem>
          ))}

          <StaggerItem>
            <Anchor to="/register" className="block h-full" onClick={() => {}}>
              <TiltCard className="glass-gold flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl p-6">
                <div>
                  <Rocket className="h-8 w-8 text-gold-2" aria-hidden />
                  <h3 className="font-display mt-5 text-xl font-semibold text-ink">Ready for launch?</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Free registration · closes 18 November 2026.
                  </p>
                </div>
                <span className="font-display inline-flex items-center gap-2 text-sm font-semibold text-gold-2">
                  Secure your slot <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </TiltCard>
            </Anchor>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ======================= CLUBS ======================= */
function ClubsConstellation() {
  const { isFair } = useMode();
  return (
    <section className="relative z-10 nebula grain py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          eyebrow="The crew of five"
          title={isFair ? "Five clubs. One voyage." : "Five clubs, one campus."}
          align="center"
          sub="Every club runs its own info site, its own weekly circle and its own calendar — the correspondents of the press bureau come from these five crews."
        />

        <StaggerGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {CLUBS.map((c, i) => (
            <StaggerItem key={c.slug} className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
              <Anchor to={`/clubs/${c.slug}`} className="block h-full" onClick={() => {}}>
                <TiltCard max={6} className="group relative h-full overflow-hidden rounded-3xl border border-white/10">
                  <img
                    src={c.image}
                    alt={`${c.name}`}
                    className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-void/10 transition-opacity duration-700 group-hover:via-void/30" />

                  <div className="relative flex h-full min-h-[300px] flex-col justify-end p-7">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono2 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.25em]"
                        style={{ background: c.colorSoft, color: c.color, border: `1px solid ${c.color}44` }}
                      >
                        {c.code}
                      </span>
                      <span className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {c.meetingEn} · {c.venue}
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-2xl font-semibold text-ink">{c.shortName}</h3>
                    <p className="font-bangla mt-1 text-sm text-white/60">{c.taglineBn}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span
                        className="font-display inline-flex translate-y-2 items-center gap-2 text-sm font-medium opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                        style={{ color: c.color }}
                      >
                        Enter club page <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="font-mono2 text-[10px] tracking-[0.2em] text-white/35">
                        {c.committee.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${c.color}, transparent)` }}
                  />
                </TiltCard>
              </Anchor>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ======================= STATS ======================= */
function StatsBand() {
  return (
    <section className="relative z-10 border-y border-white/8 bg-[#07071a]/70 py-16 backdrop-blur [data-mode='normal']:border-black/10 [data-mode='normal']:bg-black/[0.03]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 md:grid-cols-4 md:px-10">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="text-center">
            <div className="font-display text-gold-gradient text-4xl font-bold md:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="font-display mt-2 text-sm font-medium uppercase tracking-[0.2em] text-ink/90">{s.label}</p>
            <p className="mt-1 text-xs text-white/45">{s.sub}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ======================= TIMELINE (fair only) ======================= */
function TimelineStrip() {
  return (
    <section className="relative z-10 py-24 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <SectionHead eyebrow="Flight plan" title="Three dates to remember" align="center" />
        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div aria-hidden className="absolute left-0 right-0 top-2 hidden h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent md:block" />
          {TIMELINE.map((t, i) => (
            <Reveal key={t.date} delay={i * 0.15} className="relative text-center">
              <span className="pulse-dot relative z-10 inline-flex h-4 w-4 rounded-full bg-gold shadow-[0_0_16px_rgba(240,180,41,0.9)]" />
              <p className="font-mono2 mt-5 text-xs tracking-[0.3em] text-gold-2">{t.date}</p>
              <h3 className="font-display mt-2 text-xl font-semibold text-ink">{t.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-dim">{t.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================= PRESS DESK ======================= */
function PressDeskBand() {
  const { isFair } = useMode();
  const cards = [
    {
      icon: PenLine,
      t: "Send a story tip",
      d: "Seen something on campus worth the front page? Write to the press desk — tips go straight to the editors' inbox.",
      cta: "Open the tip line",
      to: "/contact",
    },
    isFair
      ? {
          icon: ShieldCheck,
          t: "Press accreditation",
          d: "Journalists covering Genesis 2026 can request press badges through the press kit — guidelines, facts and contact lines inside.",
          cta: "Read the press kit",
          to: "/press/press-kit-okgs-genesis-2026",
        }
      : {
          icon: Newspaper,
          t: "Notices & circulars",
          d: "Admission circulars, exam routines and official notices are published here first — the office's own bulletin board.",
          cta: "Check the notices",
          to: "/press",
        },
    {
      icon: Mail,
      t: "The bureau in brief",
      d: "The OKGS Press Bureau is edited by students with the school office — covering clubs, campus life and the big fair.",
      cta: "About the bureau",
      to: "/about",
    },
  ];
  return (
    <section className="relative z-10 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead eyebrow="The press desk" title="Talk to the newsroom" align="center" />
        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.1}>
          {cards.map((c) => (
            <StaggerItem key={c.t}>
              <TiltCard className="panel flex h-full flex-col rounded-3xl p-7 transition-colors duration-500 hover:border-gold/40">
                <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl text-gold-2">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-xl font-semibold text-ink">{c.t}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-dim">{c.d}</p>
                <Anchor to={c.to} className="font-display mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-2" onClick={() => {}}>
                  {c.cta} <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Anchor>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ======================= CTA (fair only) ======================= */
function CtaBanner() {
  return (
    <section className="relative z-10 pb-24 pt-4 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
            <img src="/media/cta-galaxy.png" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-void/90 via-void/55 to-void/25" />
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
              <Scramble text="FINAL CALL" className="eyebrow" />
              <h2 className="font-display mt-4 max-w-2xl text-4xl font-bold leading-[1.05] text-ink md:text-6xl">
                Begin your <span className="text-gold-gradient">voyage</span> now.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
                Registration is free and closes on {FAIR.regDeadline}. Build your crew,
                pick your arena and let your project take flight at Genesis 2026.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Magnetic>
                  <Anchor to="/register" className="btn-gold" onClick={() => {}}>
                    <Rocket className="h-4 w-4" aria-hidden /> Register now
                  </Anchor>
                </Magnetic>
                <Magnetic>
                  <Anchor to="/clubs" className="btn-ghost" onClick={() => {}}>
                    Meet the clubs <ArrowRight className="h-4 w-4" aria-hidden />
                  </Anchor>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
