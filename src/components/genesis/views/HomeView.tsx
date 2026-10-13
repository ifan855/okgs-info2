"use client";

/* HomeView — the front page of the OKGS site.
   One address, two editions, each opening on its own montage:

   fair   → a cinematic, low-density title-card hero — the school's
            own Odyssey footage cut into a quick-cut montage (fair
            billboard, project tables, plaques, the principal's
            speech, the speakers, the roar) behind the fair's full
            colon-combined name — then chapters that let information
            density climb with every scroll: arenas, the crew of
            five, the film desk, campus moments, the journal, finale.
   normal → the same cinematic opening, cut from everyday school
            life (gate → handwriting → art → craft → puzzle →
            scouts → courtyard) behind one promise — then snapshot,
            facilities, clubs, the film desk, campus life, journal.

   No stock space photography anywhere: every backdrop is real
   school footage or CSS light; every photo is real. */

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, ArrowUpRight, MapPin, CalendarDays, TicketCheck, Clock,
  ChevronDown, Phone, ExternalLink, LogIn, ImageOff, Clapperboard,
} from "lucide-react";
import { FAIR, ARENAS, CLUBS, STATS, SITE, FACILITIES } from "@/lib/genesis/data";
import { HERO_MONTAGE, HERO_MONTAGE_POSTER, SCHOOL_MONTAGE, SCHOOL_MONTAGE_POSTER, filmsForEdition } from "@/lib/genesis/films";
import { useMode, fetchPosts, fetchGallery, formatDate } from "@/lib/press";
import type { GalleryItem, Film, Post } from "@/lib/types";
import { SplitText, Reveal, CutIn, StaggerGroup, StaggerItem, Counter, Magnetic, TiltCard, SectionHead, Anchor, StarDots } from "../FX";
import { FilmCard, FilmModal } from "../FilmBox";
import Countdown from "../Countdown";
import IconFor from "../IconFor";

export default function HomeView() {
  const { isFair } = useMode();
  const [openFilm, setOpenFilm] = useState<Film | null>(null);
  return (
    <main className="relative z-10">
      {isFair ? <FairHero /> : <SchoolHero />}
      {isFair ? (
        <>
          <ArenaChapter />
          <CrewChapter />
          <FilmsChapter onOpen={setOpenFilm} />
          <MomentsChapter />
          <JournalChapter />
          <FairFinale />
        </>
      ) : (
        <>
          <SnapshotBand />
          <FacilitiesBand />
          <CrewChapter />
          <FilmsChapter onOpen={setOpenFilm} />
          <MomentsChapter />
          <JournalChapter />
          <AdmissionsBand />
        </>
      )}
      {openFilm && <FilmModal film={openFilm} onClose={() => setOpenFilm(null)} />}
    </main>
  );
}

/* ======================= hooks ======================= */

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

function useGallery(): GalleryItem[] {
  const [items, setItems] = useState<GalleryItem[]>([]);
  useEffect(() => {
    let alive = true;
    fetchGallery().then((g) => alive && setItems(g));
    return () => {
      alive = false;
    };
  }, []);
  return items;
}

const CATEGORY_COLOR: Record<string, string> = {
  "Press Release": "#f0b429",
  News: "#7dd3fc",
  Notice: "#f472b6",
  Feature: "#a9f5e8",
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

/* ============================================================
   FAIR HERO — the school's own Odyssey footage, cut into a
   quick-cut montage (drone reveal → projects → confetti →
   trophies → the roar of the crowd), behind one screen of type.
   Scrims run LOW-transparency: real contrast, no wash.
   ============================================================ */
function FairHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { fairName, fairTagline } = useMode();
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const raf = requestAnimationFrame(() => setAllowMotion(!mq.matches));
    const on = () => setAllowMotion(!mq.matches);
    mq.addEventListener("change", on);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", on);
    };
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden grain">
      {/* the fair itself — real footage, quick cuts baked in */}
      <motion.div aria-hidden style={{ y: yBg, scale: scaleBg }} className="absolute inset-0">
        {allowMotion ? (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_MONTAGE_POSTER}
            aria-hidden
          >
            <source src={HERO_MONTAGE} type="video/mp4" />
          </video>
        ) : (
          <img src={HERO_MONTAGE_POSTER} alt="" className="hero-video" />
        )}
      </motion.div>
      {/* low-transparency scrim — the title must win */}
      <div aria-hidden className="film-scrim absolute inset-0" />
      <StarDots count={26} />

      {/* the edit-cut seam where the hero hands the frame over */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
        viewport={{ once: true, margin: "-5% 0px" }}
        transition={{ duration: 0.9, times: [0, 0.25, 0.7, 1], ease: "easeOut" }}
        className="cut-seam bottom-0 z-20 origin-left"
      />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-32 md:px-10 md:pt-36">
        {/* the only furniture on the opening screen: three quiet chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="chip chip-solid border-gold/40 text-gold-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" style={{ animation: "ping-dot 1.8s ease-out infinite" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            {FAIR.datesLabel}
          </span>
          <span className="chip chip-solid hidden sm:inline-flex"><TicketCheck className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.entry}</span>
          <span className="chip chip-solid hidden font-bangla md:inline-flex" style={{ letterSpacing: "0.06em" }}>{SITE.schoolBn}</span>
        </motion.div>

        {/* THE title — name + ": tagline", colon always present */}
        <motion.div style={{ y: yTitle }} className="mt-8 md:mt-10">
          <h1>
            <span className="font-display block overflow-hidden">
              <SplitText
                text={fairName}
                delay={0.5}
                stagger={0.05}
                className="block text-[11.5vw] font-bold leading-[1.02] tracking-[0.02em] text-ink sm:text-[8.5vw] lg:text-[6.8rem]"
              />
            </span>
            <span className="mt-3 block overflow-hidden md:mt-4">
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 1.15 }}
                className="font-editorial block text-[6.4vw] italic leading-snug text-white/85 sm:text-[4vw] lg:text-[2.7rem]"
                style={{ textShadow: "0 2px 30px rgba(4,7,15,0.8)" }}
              >
                {fairTagline ? `: ${fairTagline}` : ""}
                <span className="font-bangla mt-2 block text-[12px] font-normal not-italic tracking-wide text-white/55 md:text-sm" style={{ letterSpacing: "0.14em" }}>
                  {SITE.taglineBn}
                </span>
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="mt-9 flex flex-wrap items-center gap-2 text-[13px] text-white/70 md:mt-10"
          style={{ textShadow: "0 1px 16px rgba(4,7,15,0.9)" }}
        >
          <MapPin className="h-3.5 w-3.5 text-gold/90" aria-hidden />
          {FAIR.venue} · {FAIR.location} · {FAIR.hours}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.65 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Anchor to="/genesis" className="btn-gold">
              Enter the programme
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Magnetic>
          <Magnetic>
            <Anchor to="/register" className="btn-ghost !bg-void/60">
              <LogIn className="h-4 w-4" aria-hidden />
              Sign in
            </Anchor>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="font-mono2 text-[9px] uppercase tracking-[0.4em]">scroll</span>
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   SCHOOL HERO — a school day in quick cuts. The normal edition
   opens on its own montage (same treatment as the fair hero):
   real campus footage behind one promise, scrim kept LOW so the
   frames read solid, then density climbs with the scroll.
   ============================================================ */
function SchoolHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const raf = requestAnimationFrame(() => setAllowMotion(!mq.matches));
    const on = () => setAllowMotion(!mq.matches);
    mq.addEventListener("change", on);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", on);
    };
  }, []);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden grain">
      {/* the school itself — a day in quick cuts, footage baked in */}
      <motion.div aria-hidden style={{ y: yBg, scale: scaleBg }} className="absolute inset-0">
        {allowMotion ? (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={SCHOOL_MONTAGE_POSTER}
            aria-hidden
          >
            <source src={SCHOOL_MONTAGE} type="video/mp4" />
          </video>
        ) : (
          <img src={SCHOOL_MONTAGE_POSTER} alt="" className="hero-video" />
        )}
      </motion.div>
      {/* low-transparency scrim, tinted for the normal edition */}
      <div aria-hidden className="film-scrim absolute inset-0" />

      {/* the edit-cut seam where the hero hands the frame over */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
        viewport={{ once: true, margin: "-5% 0px" }}
        transition={{ duration: 0.9, times: [0, 0.25, 0.7, 1], ease: "easeOut" }}
        className="cut-seam bottom-0 z-20 origin-left"
      />

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-32 md:px-10 md:pt-36">
        {/* quiet furniture: crest, since, the school in Bangla */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="chip chip-solid">
            <img src="https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/real/crest.jpg" alt="" className="h-4 w-4 rounded-full object-cover" />
            Since 2003
          </span>
          <span className="chip chip-solid font-bangla hidden md:inline-flex" style={{ letterSpacing: "0.06em" }}>
            {SITE.schoolBn}
          </span>
        </motion.div>

        {/* one promise, over the school's own morning */}
        <motion.div style={{ y: yTitle }} className="mt-8 md:mt-10">
          <h1>
            <span className="font-display block overflow-hidden">
              <SplitText
                text="Quality education"
                delay={0.5}
                stagger={0.05}
                className="over-video block text-[11.5vw] font-bold leading-[1.02] tracking-[0.02em] sm:text-[8.5vw] lg:text-[6.2rem]"
              />
            </span>
            <span className="mt-2 block overflow-hidden md:mt-3">
              <SplitText
                text="for all — since 2003"
                delay={0.85}
                stagger={0.04}
                letterClassName="over-video-gold"
                className="over-video block text-[11.5vw] font-bold leading-[1.02] tracking-[0.02em] sm:text-[8.5vw] lg:text-[6.2rem]"
              />
            </span>
            <span className="mt-3 block overflow-hidden md:mt-4">
              <motion.span
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 1.15 }}
                className="font-editorial over-video-85 block text-[6.4vw] italic leading-snug sm:text-[4vw] lg:text-[2.5rem]"
                style={{ textShadow: "0 2px 30px rgba(4,7,15,0.8)" }}
              >
                {SITE.mottoEn}
                <span className="font-bangla over-video-55 mt-2 block text-[12px] font-normal not-italic tracking-wide md:text-sm" style={{ letterSpacing: "0.14em" }}>
                  {SITE.mottoBn}
                </span>
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="over-video-75 mt-9 max-w-xl text-[15px] leading-relaxed md:mt-10 md:text-base"
          style={{ textShadow: "0 1px 16px rgba(4,7,15,0.9)" }}
        >
          From play group to class ten, {SITE.school} has taught the children of
          Kalai with one promise written on its crest. Eleven hundred students,
          eighty teachers, five clubs and a campus that stays loud long after
          the last period.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.65 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Anchor to="/contact" className="btn-gold">
              Admissions &amp; contact
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Magnetic>
          <Magnetic>
            <Anchor to="/clubs" className="btn-ghost !bg-void/60">
              Meet the clubs
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="over-video-60 flex flex-col items-center gap-2">
          <span className="font-mono2 text-[9px] uppercase tracking-[0.4em]">scroll</span>
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   THE FILM DESK — the school's own footage, both editions.
   Poster-first cards; hovering snaps into a muted preview;
   clicking opens the player with sound. Fair mode screens the
   fair films, normal mode screens daily campus life.
   ============================================================ */
function FilmsChapter({ onOpen }: { onOpen: (f: Film) => void }) {
  const { isFair } = useMode();
  const films = filmsForEdition(isFair);
  const [featured, ...rest] = films;

  return (
    <section className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow={isFair ? "From the fair's own cut" : "Rolling on campus"}
            title={isFair ? "The fair, on film" : "Campus films"}
            sub={
              isFair
                ? "Shot on the school's own field days — the drone over Kalai, the plaque table, the crowd roar. Hover for a peek, click to watch with sound."
                : "Real school days, filmed by the school — the morning gate, the craft table, the scout parade. Hover for a peek, click to watch with sound."
            }
          />
          <Reveal delay={0.25}>
            <span className="chip chip-solid">
              <Clapperboard className="h-3.5 w-3.5 text-gold" aria-hidden />
              {films.length} film{films.length > 1 ? "s" : ""} · school footage
            </span>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <CutIn delay={0.05}>
            <FilmCard film={featured} onOpen={onOpen} tall />
          </CutIn>
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.slice(0, 2).map((f, i) => (
              <CutIn key={f.id} delay={0.1 + i * 0.06}>
                <FilmCard film={f} onOpen={onOpen} />
              </CutIn>
            ))}
          </div>
        </div>

        {rest.length > 2 && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(2).map((f, i) => (
              <CutIn key={f.id} delay={0.05 + i * 0.05}>
                <FilmCard film={f} onOpen={onOpen} />
              </CutIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   FAIR · ARENAS — density climbs: full programme rows
   ============================================================ */
function ArenaChapter() {
  return (
    <section className="relative z-10 nebula grain py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="The fair in brief"
            title="Seven arenas, two days"
            sub="Working models, robots, buzzer finals, a live pitch, a debate floor, a gallery of posters and a code lab — every arena judged on published criteria."
          />
          <Reveal delay={0.25}>
            <Anchor to="/genesis" className="btn-ghost !py-3">
              Full programme <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Reveal>
        </div>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-white/10">
          {ARENAS.map((a, i) => (
            <Reveal key={a.id} delay={0.04 * i} y={18}>
              <Anchor
                to={`/genesis#${a.id}`}
                className={`group relative flex items-center gap-5 px-6 py-5 transition-colors duration-300 hover:bg-white/[0.04] md:gap-8 md:px-8 md:py-6 ${i > 0 ? "border-t border-white/8" : ""}`}
              >
                <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gold-2 transition-transform duration-500 group-hover:scale-110">
                  <IconFor name={a.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-base font-semibold text-ink transition-colors group-hover:text-gold-2 md:text-lg">
                    {a.name}
                  </span>
                  <span className="mt-0.5 hidden truncate text-[13px] text-dim md:block">{a.desc}</span>
                </span>
                <span className="hidden shrink-0 text-right text-[11px] leading-relaxed text-white/45 lg:block">
                  {a.classes.split("·")[0]}
                  <br />
                  {a.venue}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold-2" aria-hidden />
              </Anchor>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   THE CREW OF FIVE — clubs share the spotlight
   ============================================================ */
function CrewChapter() {
  const { isFair } = useMode();
  return (
    <section className="relative z-10 nebula grain py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          eyebrow={isFair ? "Organised by the crew" : "Beyond the classroom"}
          title={isFair ? "Five clubs, one voyage" : "The clubs of the campus"}
          align="center"
          sub={
            isFair
              ? "Genesis is run by the whole crew — from ALSSM's lab to AYGSM's field, every club commands a mission control of its own. Each one keeps its own page here."
              : "Five student clubs keep the campus alive after the last bell — science, code, language, sport and debate — each with its own weekly circle and its own page on this site."
          }
        />
      </div>

      <Reveal delay={0.2} className="relative z-10 mt-14">
        <div className="scrollbar-film flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          {CLUBS.map((c) => (
            <Anchor
              key={c.slug}
              to={`/clubs/${c.slug}`}
              className="group relative w-[300px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/10 transition-colors duration-500 hover:border-white/25 md:w-[340px]"
            >
              <div className={`relative h-44 ${isFair ? "photo-night" : ""}`}>
                <img
                  src={c.image}
                  alt={`${c.name} banner`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                <span
                  className="club-code-chip font-mono2 absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.25em]"
                  style={{ color: c.color, border: `1px solid ${c.color}88`, backdropFilter: "blur(6px)" }}
                >
                  {c.code}
                </span>
              </div>
              <div className="relative px-6 pb-6 pt-5">
                <img
                  src={c.logo}
                  alt=""
                  className="absolute -top-8 right-5 h-14 w-14 rounded-xl object-contain"
                  style={{ background: "rgba(4,7,15,0.55)", border: `1px solid ${c.color}44`, backdropFilter: "blur(8px)", padding: "6px" }}
                />
                <h3 className="font-display text-xl font-semibold text-ink transition-colors" style={{}}>
                  {c.shortName}
                </h3>
                <p className="font-bangla mt-1 text-[13px] leading-relaxed text-white/60">{c.taglineBn}</p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-white/45">
                  <Clock className="h-3 w-3" style={{ color: c.color }} aria-hidden />
                  {c.meetingEn} · {c.venue}
                </div>
                <span
                  className="font-display mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: c.color }}
                >
                  Enter the club <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-80"
                style={{ background: `linear-gradient(90deg, transparent, ${c.color}, transparent)` }}
              />
            </Anchor>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.3} className="mt-6 text-center">
        <Anchor to="/clubs" className="font-display inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-gold-2">
          All club pages <ArrowRight className="h-4 w-4" aria-hidden />
        </Anchor>
      </Reveal>
    </section>
  );
}

/* ============================================================
   MOMENTS — the admin-curated gallery strip (real photos only)
   ============================================================ */
function MomentsChapter() {
  const items = useGallery();
  const shown = items.slice(0, 8);

  return (
    <section className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Campus in pictures"
            title="Moments from campus"
            sub="Photographs chosen by the school office — classrooms, corridors, clubs and the crest."
          />
          <Reveal delay={0.25}>
            <Anchor to="/gallery" className="btn-ghost !py-3">
              Open the gallery <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Reveal>
        </div>
      </div>

      {shown.length === 0 ? (
        <Reveal delay={0.15} className="mx-auto mt-12 max-w-7xl px-5 md:px-10">
          <div className="panel flex items-center gap-4 rounded-3xl p-8 text-dim">
            <ImageOff className="h-5 w-5 shrink-0" aria-hidden />
            <p className="text-sm">The gallery is being curated — photos will appear here once the office publishes them.</p>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={0.15} className="mt-12">
          <div className="scrollbar-film flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
            {shown.map((g, i) => (
              <Anchor
                key={g.id}
                to="/gallery"
                className={`group relative block shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 ${
                  i % 3 === 0 ? "h-64 w-80 md:h-72 md:w-[26rem]" : "h-64 w-64 md:h-72 md:w-80"
                }`}
              >
                <img
                  src={g.src}
                  alt={g.title || "Campus photograph"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/25 to-transparent" />
                <p className="absolute bottom-0 left-0 right-0 p-4 text-left text-[12.5px] font-medium leading-snug text-white/90">
                  {g.title}
                </p>
              </Anchor>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}

/* ============================================================
   JOURNAL — the written word, deliberately quiet
   ============================================================ */
function JournalChapter() {
  const posts = useWire(3);
  return (
    <section className="relative z-10 nebula grain py-24 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="From the school desk"
            title="Campus journal"
            sub="Notices, club bulletins and short stories from the week — written by students and staff."
          />
          <Reveal delay={0.25}>
            <Anchor to="/press" className="font-display inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-gold-2">
              All entries <ArrowRight className="h-4 w-4" aria-hidden />
            </Anchor>
          </Reveal>
        </div>

        <div className="mt-10 divide-y divide-white/8 border-y border-white/8">
          {posts.length === 0
            ? [0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse bg-white/[0.03]" />)
            : posts.map((p, i) => (
                <Reveal key={p.id} delay={0.07 * i} y={16}>
                  <Anchor
                    to={`/press/${p.slug}`}
                    className="group flex items-baseline gap-5 py-5 transition-colors md:gap-8"
                  >
                    <span className="font-mono2 shrink-0 text-[11px] tracking-[0.18em] text-white/40">
                      {formatDate(p.date).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-display block text-[15px] font-medium leading-snug text-ink transition-colors group-hover:text-gold-2 md:text-[17px]">
                        {p.title}
                      </span>
                    </span>
                    <span className="hidden shrink-0 md:block"><CategoryChip post={p} /></span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 self-center text-white/25 transition-all group-hover:translate-x-1 group-hover:text-gold-2" aria-hidden />
                  </Anchor>
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAIR FINALE — countdown + last call (CSS light, no photo)
   ============================================================ */
function FairFinale() {
  return (
    <section className="relative z-10 pb-24 pt-4 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
            <div aria-hidden className="aurora" />
            <div className="grain absolute inset-0" aria-hidden />
            <StarDots count={18} />
            <div className="relative z-10 flex flex-col items-center px-8 py-16 text-center md:px-16 md:py-20">
              <p className="font-mono2 text-[10px] uppercase tracking-[0.4em] text-white/45">
                T-minus · until ignition
              </p>
              <div className="mt-6">
                <Countdown />
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <span className="chip"><CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.datesLabel}</span>
                <span className="chip"><MapPin className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.venue}</span>
                <span className="chip"><TicketCheck className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.entry}</span>
              </div>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <Anchor to="/genesis" className="btn-gold">
                    See the two-day programme <ArrowRight className="h-4 w-4" aria-hidden />
                  </Anchor>
                </Magnetic>
                <Magnetic>
                  <Anchor to="/clubs" className="btn-ghost">
                    Meet the crew
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

/* ============================================================
   NORMAL · SNAPSHOT — the school in four numbers
   ============================================================ */
function SnapshotBand() {
  return (
    <section className="relative z-10 border-y border-white/8 bg-white/[0.03] py-16 backdrop-blur [data-mode='normal']:border-black/10 [data-mode='normal']:bg-black/[0.03]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 md:grid-cols-4 md:px-10">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <div className="font-display text-gold-gradient text-4xl font-bold md:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="font-display mt-2 text-sm font-medium uppercase tracking-[0.18em] text-ink/90">{s.label}</p>
            <p className="mt-1 text-xs text-white/45">{s.sub}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   NORMAL · FACILITIES — what the campus offers
   ============================================================ */
function FacilitiesBand() {
  return (
    <section className="relative z-10 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          eyebrow="The campus"
          title="Everything a school day needs"
          sub="Buses across Kalai, residential hostels with supervised study, a compulsory computer lab, a 2,000-book library — and a canteen that never runs out of shingara."
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {FACILITIES.map((f) => (
            <StaggerItem key={f.title}>
              <TiltCard max={5} className="panel flex h-full flex-col rounded-3xl p-6 transition-colors duration-500 hover:border-gold/40">
                <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl text-gold-2">
                  <IconFor name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-5 text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">{f.detail}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ============================================================
   NORMAL · ADMISSIONS — how to join
   ============================================================ */
function AdmissionsBand() {
  return (
    <section className="relative z-10 pb-24 pt-4 md:pb-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
            <div aria-hidden className="aurora" />
            <div className="grain absolute inset-0" aria-hidden />
            <div className="relative z-10 grid gap-10 px-8 py-14 md:grid-cols-[1.3fr_1fr] md:px-14 md:py-16">
              <div>
                <p className="font-bangla text-sm text-gold-2" style={{ letterSpacing: "0.08em" }}>ভর্তি চলছে · ২০২৬ শিক্ষাবর্ষ</p>
                <h2 className="font-display mt-3 text-3xl font-bold leading-tight text-ink md:text-5xl">
                  Admissions open — play group to class ten.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
                  Forms are available at the school office during working hours. Bring a birth
                  certificate copy, previous academic records and two photographs. Hostel seats
                  and bus routes are arranged with the office.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Magnetic>
                    <a href={`tel:${SITE.phoneAdmission.replace(/-/g, "")}`} className="btn-gold" data-cursor="link">
                      <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phoneAdmission}
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <Anchor to="/contact" className="btn-ghost">
                      Visit the office <ArrowRight className="h-4 w-4" aria-hidden />
                    </Anchor>
                  </Magnetic>
                </div>
              </div>
              <div className="glass rounded-3xl p-6 md:p-7">
                <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/45">The office</p>
                <ul className="mt-5 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    {SITE.address}
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                    {SITE.hours}
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                    {SITE.phone} · {SITE.phone2}
                  </li>
                  <li>
                    <a
                      href={SITE.mainSite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold-2 transition-colors hover:text-gold-2"
                    >
                      omarkgschool.com <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
