"use client";

/* ClubsView — #/clubs — the council of five club sites */

import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { CLUBS } from "@/lib/genesis/data";
import { SplitText, Reveal, StaggerGroup, StaggerItem, SectionHead, TiltCard, Anchor, Marquee } from "../FX";

export default function ClubsView() {
  return (
    <main className="relative z-10">
      <ClubsHero />
      <ClubCards />
      <ClubSitesStrip />
    </main>
  );
}

function ClubsHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 nebula grain md:pt-48">
      <div aria-hidden className="aurora" />
      <div className="relative mx-auto max-w-7xl px-5 text-center md:px-10">
        <Reveal y={14}>
          <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50">
            <Anchor to="/" className="transition-colors hover:text-gold-2">Home</Anchor>
            <span className="mx-2 text-gold">/</span>
            <span className="text-gold-2">The Clubs</span>
          </p>
        </Reveal>
        <h1 className="font-display mt-6 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
          <SplitText text="The Council" className="block" letterClassName="text-cosmic-gradient" />
          <SplitText text="of Five" delay={0.35} className="block text-ink" />
        </h1>
        <Reveal delay={0.45}>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-dim md:text-base">
            Five student clubs power everything that happens beyond the classroom —
            including the school's science fair. Each crew runs its own page here,
            a weekly rendezvous and its own corner of okgs.info.
          </p>
        </Reveal>
        <Reveal delay={0.55} className="mt-8 flex flex-wrap justify-center gap-3">
          {CLUBS.map((c) => (
            <a
              key={c.slug}
              href={`#/clubs/${c.slug}`}
              data-cursor="link"
              className="chip transition-all hover:-translate-y-0.5"
              style={{ borderColor: `${c.color}55`, color: c.color }}
            >
              {c.code}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function ClubCards() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <StaggerGroup className="grid gap-7 md:grid-cols-2" stagger={0.12}>
          {CLUBS.map((c, i) => (
            <StaggerItem key={c.slug} className={i === 0 ? "md:col-span-2" : ""}>
              <TiltCard max={4} className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10">
                <img
                  src={c.image}
                  alt={`${c.name} artwork`}
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-75"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/10 ${i === 0 ? "md:bg-gradient-to-r" : ""}`} />

                <div className={`relative flex h-full min-h-[340px] flex-col justify-end p-8 md:p-10 ${i === 0 ? "md:max-w-xl" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="font-mono2 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.25em]"
                      style={{ background: c.colorSoft, color: c.color, border: `1px solid ${c.color}44` }}
                    >
                      {c.code}
                    </span>
                    <span className="font-mono2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/55">
                      <CalendarDays className="h-3 w-3" aria-hidden /> {c.meetingEn}
                    </span>
                    <span className="font-mono2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/55">
                      <MapPin className="h-3 w-3" aria-hidden /> {c.venue}
                    </span>
                  </div>

                  <h2 className="font-display mt-4 text-3xl font-semibold text-ink md:text-4xl">{c.shortName}</h2>
                  <p className="mt-1.5 text-sm font-medium italic text-white/65">{c.full}</p>
                  <p className="font-bangla mt-3 text-[15px] leading-relaxed text-white/75">{c.taglineBn}</p>
                  <p className="mt-2 text-sm italic text-white/50">{c.taglineEn}</p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <span className="font-mono2 flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/45">
                      <Users className="h-3.5 w-3.5" aria-hidden /> {c.meetingEn.toUpperCase()} · {c.venue.toUpperCase()}
                    </span>
                    <Anchor
                      to={`/clubs/${c.slug}`}
                      className="font-display inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:gap-3"
                      onClick={() => {}}
                    >
                      <span style={{ color: c.color }}>Enter club site</span>
                      <ArrowUpRight className="h-4 w-4" style={{ color: c.color }} aria-hidden />
                    </Anchor>
                  </div>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-70"
                  style={{ background: `linear-gradient(90deg, transparent, ${c.color}, transparent)` }}
                />
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function ClubSitesStrip() {
  return (
    <section className="relative border-t border-white/8 py-12">
      <p className="eyebrow mx-auto block max-w-7xl px-5 text-center md:px-10">Each club · its own page</p>
      <div className="mt-6 text-gold/40">
        <Marquee
          separator="✦"
          items={CLUBS.map((c) => (
            <span key={c.slug} className="font-display text-2xl font-semibold tracking-wide md:text-3xl" style={{ color: `${c.color}cc` }}>
              {c.code.toLowerCase()}.okgs.info
            </span>
          ))}
        />
      </div>
    </section>
  );
}
