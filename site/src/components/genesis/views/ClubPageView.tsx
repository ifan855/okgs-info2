"use client";

/* ClubPageView — #/clubs/[slug] — each club gets its own full page.
   Colored by club identity: hero, about, activities, events,
   achievements, leadership, join CTA. */

import {
  ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Users, Clock,
  Sparkles, Flag, Rocket, Trophy, Mail,
} from "lucide-react";
import { CLUBS } from "@/lib/genesis/data";
import { SplitText, Scramble, Reveal, StaggerGroup, StaggerItem, Anchor, TiltCard, StarDots } from "../FX";
import IconFor from "../IconFor";

export default function ClubPageView({ slug }: { slug: string }) {
  const club = CLUBS.find((c) => c.slug === slug);
  if (!club) return <ClubNotFound slug={slug} />;

  return (
    <main className="relative z-10">
      <ClubHero slug={slug} />
      <ClubAbout club={club} />
      <ClubActivities club={club} />
      <ClubEvents club={club} />
      <ClubAchievements club={club} />
      <ClubLeadership club={club} />
      <JoinCta club={club} />
    </main>
  );
}

/* ---------------- hero ---------------- */
function ClubHero({ slug }: { slug: string }) {
  const club = CLUBS.find((c) => c.slug === slug)!;
  return (
    <section className="relative overflow-hidden pb-24 pt-40 md:pt-48">
      {/* bg image + club color wash */}
      <div aria-hidden className="absolute inset-0">
        <img src={club.image} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/60 to-void" />
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(55% 60% at 25% 40%, ${club.color}22, transparent 70%)` }}
        />
      </div>
      <StarDots count={18} />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <Reveal y={12}>
          <Anchor
            to="/clubs"
            className="font-mono2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-gold-2"
            onClick={() => {}}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All clubs
          </Anchor>
        </Reveal>

        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="font-mono2 rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.3em]"
                style={{ background: club.colorSoft, color: club.color, border: `1px solid ${club.color}55` }}
              >
                {club.code}
              </span>
              <Scramble text="OKGS STUDENT CLUB" className="font-mono2 text-[10px] uppercase tracking-[0.32em] text-white/45" />
            </div>

            <h1 className="font-display mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
              <SplitText text={club.shortName} />
            </h1>
            <p
              className="gen-rise mt-3 text-base italic text-white/60"
              style={{ animationDelay: "0.5s", animationDuration: "0.8s" }}
            >
              {club.full}
            </p>

            <blockquote
              className="gen-rise mt-7 border-l-2 pl-5"
              style={{ borderColor: club.color, animationDelay: "0.65s", animationDuration: "0.9s" }}
            >
              <p className="font-bangla text-lg leading-relaxed text-white/85 md:text-xl">{club.taglineBn}</p>
              <p className="mt-1.5 text-sm italic text-white/50">{club.taglineEn}</p>
              <p className="font-bangla mt-3 text-sm" style={{ color: club.color }}>
                মূলপ্রতিষ্ঠানের শ্লোগান — “{club.mottoBn}”
              </p>
            </blockquote>
          </div>

          {/* quick facts */}
          <Reveal delay={0.35}>
            <div className="panel rounded-3xl p-6 md:p-8">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" style={{ color: club.color }} aria-hidden />
                  <div>
                    <p className="font-medium text-ink">{club.meetingEn}</p>
                    <p className="font-bangla text-xs text-white/50">{club.meetingBn}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: club.color }} aria-hidden />
                  <div>
                    <p className="font-medium text-ink">{club.venue}</p>
                    <p className="text-xs text-white/50">Weekly rendezvous point</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0" style={{ color: club.color }} aria-hidden />
                  <div>
                    <p className="font-medium text-ink">{club.committee}</p>
                    <p className="text-xs text-white/50">Student leadership · open membership</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Flag className="mt-0.5 h-4 w-4 shrink-0" style={{ color: club.color }} aria-hidden />
                  <div>
                    <p className="font-medium text-ink">Genesis 2026 duty</p>
                    <p className="text-xs leading-relaxed text-white/50">{club.fairRole}</p>
                  </div>
                </li>
              </ul>
              <a
                href={club.site}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="font-display mt-6 flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all hover:gap-3"
                style={{ borderColor: `${club.color}66`, color: club.color, background: club.colorSoft }}
              >
                Visit {club.code.toLowerCase()}.okgs.info <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- about ---------------- */
function ClubAbout({ club }: { club: typeof CLUBS[number] }) {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Scramble text="ABOUT THE CREW" className="eyebrow" />
            <div className="mt-6 space-y-5">
              {club.about.map((p, i) => (
                <Reveal key={i} delay={0.1 * i}>
                  <p className="max-w-2xl text-[15px] leading-relaxed text-dim md:text-base">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.2}>
            <TiltCard max={6} className="panel relative overflow-hidden rounded-3xl">
              <img src={club.image} alt={`${club.name} artwork`} className="h-64 w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-6">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{club.code} · {club.shortName}</p>
                  <p className="text-xs text-white/55">{club.venue}</p>
                </div>
                <span className="glass flex h-11 w-11 items-center justify-center rounded-full" style={{ color: club.color }}>
                  <IconFor name={club.icon} className="h-5 w-5" />
                </span>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- activities ---------------- */
function ClubActivities({ club }: { club: typeof CLUBS[number] }) {
  return (
    <section className="relative nebula grain py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Scramble text="WHAT WE DO" className="eyebrow" />
        <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {club.activities.map((a, i) => (
            <StaggerItem key={a}>
              <div className="panel group flex h-full items-start gap-4 rounded-2xl p-5 transition-all duration-500 hover:border-gold/35">
                <span
                  className="font-mono2 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                  style={{ background: club.colorSoft, color: club.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-relaxed text-white/80">{a}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ---------------- events ---------------- */
function ClubEvents({ club }: { club: typeof CLUBS[number] }) {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Scramble text="UPCOMING RENDEZVOUS" className="eyebrow" />
            <h2 className="font-display mt-4 text-3xl font-semibold text-ink md:text-4xl">
              On the club calendar
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-dim">
                Meetings, tournaments and fair duties — the next dates on the{" "}
                {club.code} flight plan. Weekly members meet {club.meetingEn.toLowerCase()} at {club.venue}.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex items-center gap-6">
                <div>
                  <p className="font-display text-gold-gradient text-3xl font-bold">{club.time}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">Session time</p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <p className="font-display text-gold-gradient text-3xl font-bold">
                    {1 + (parseInt(club.committee.match(/\d+/)?.[0] ?? "0", 10) || 0)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">Committee seats</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="space-y-4">
            {club.events.map((e, i) => (
              <Reveal key={e.title} delay={0.1 * i}>
                <TiltCard max={4} className="panel flex items-center gap-5 rounded-2xl p-5 transition-colors duration-500 hover:border-gold/40 md:p-6">
                  <div
                    className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl"
                    style={{ background: club.colorSoft, border: `1px solid ${club.color}44` }}
                  >
                    <Clock className="h-4 w-4" style={{ color: club.color }} aria-hidden />
                    <span className="mt-1 text-[9px] font-bold tracking-widest" style={{ color: club.color }}>
                      {e.date.split(" ")[0]} {e.date.split(" ")[1].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-base font-semibold text-ink md:text-lg">{e.title}</h4>
                      <span
                        className="font-mono2 rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-[0.18em]"
                        style={{ background: club.colorSoft, color: club.color }}
                      >
                        {e.type}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                      <MapPin className="h-3 w-3" aria-hidden /> {e.venue} · {e.date}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- achievements ---------------- */
function ClubAchievements({ club }: { club: typeof CLUBS[number] }) {
  return (
    <section className="relative nebula grain py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <Scramble text="MISSION LOG" className="eyebrow" />
        <h2 className="font-display mt-4 text-3xl font-semibold text-ink md:text-4xl">Recent achievements</h2>
        <div className="relative mt-12 space-y-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-gradient-to-b before:from-gold/60 before:via-nova/40 before:to-transparent">
          {club.achievements.map((a, i) => (
            <Reveal key={a.title} delay={0.1 * i} className="relative flex gap-6 pl-1">
              <span className="relative z-10 mt-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full" style={{ background: club.color, boxShadow: `0 0 14px ${club.color}` }} />
              <div className="pb-2">
                <span className="font-mono2 text-xs tracking-[0.25em]" style={{ color: club.color }}>{a.year}</span>
                <h4 className="font-display mt-1.5 text-lg font-semibold text-ink md:text-xl">{a.title}</h4>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-dim">{a.detail}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.25} className="flex gap-6 pl-1">
            <span className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-dashed border-white/30 bg-transparent" />
            <p className="text-sm italic text-white/40">
              More missions logging soon — the next entry could carry your name.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- leadership ---------------- */
function ClubLeadership({ club }: { club: typeof CLUBS[number] }) {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Scramble text="COMMAND DECK" className="eyebrow" />
        <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {club.leadership.map((l) => (
            <StaggerItem key={l.role}>
              <div className="panel h-full rounded-3xl p-6 text-center transition-colors duration-500 hover:border-gold/35">
                <span
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: club.colorSoft, border: `1px solid ${club.color}44` }}
                >
                  <Users className="h-6 w-6" style={{ color: club.color }} aria-hidden />
                </span>
                <p className="font-mono2 mt-4 text-[10px] uppercase tracking-[0.28em] text-white/45">{l.role}</p>
                <p className="font-display mt-2 text-[15px] font-semibold leading-snug text-ink">{l.name}</p>
              </div>
            </StaggerItem>
          ))}
          <StaggerItem>
            <Anchor to="/register" className="block h-full" onClick={() => {}}>
              <div
                className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed p-6 text-center transition-all duration-500 hover:scale-[1.02]"
                style={{ borderColor: `${club.color}55`, background: club.colorSoft }}
              >
                <Rocket className="h-6 w-6" style={{ color: club.color }} aria-hidden />
                <p className="font-display mt-3 text-[15px] font-semibold" style={{ color: club.color }}>
                  Join {club.code}
                </p>
                <p className="mt-1 text-xs text-white/50">New members welcome</p>
              </div>
            </Anchor>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ---------------- join CTA ---------------- */
function JoinCta({ club }: { club: typeof CLUBS[number] }) {
  return (
    <section className="relative pb-24 pt-4">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[2.5rem] border p-10 md:p-16"
            style={{ borderColor: `${club.color}44`, background: `linear-gradient(120deg, ${club.colorSoft}, rgba(10,10,28,0.9))` }}
          >
            <StarDots count={14} />
              <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div className="max-w-xl">
                <Scramble text="BOARDING OPEN" className="font-mono2 text-[10px] uppercase tracking-[0.32em]" />
                <h2 className="font-display mt-3 text-3xl font-bold leading-tight text-ink md:text-5xl">
                  Become a <span style={{ color: club.color }}>{club.code}</span> crew member.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-white/70">
                  {club.meetingEn} · {club.venue} · {club.time}. Walk in, or write to{" "}
                  <a href={`mailto:${club.email}`} className="underline decoration-dotted underline-offset-4 transition-colors hover:text-gold-2">
                    {club.email}
                  </a>{" "}
                  — the club replies through its adviser.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Anchor to="/contact" className="btn-gold" onClick={() => {}}>
                  <Mail className="h-4 w-4" aria-hidden /> Ask about joining
                </Anchor>
                <Anchor to="/clubs" className="btn-ghost" onClick={() => {}}>
                  Other clubs
                </Anchor>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 404 ---------------- */
function ClubNotFound({ slug }: { slug: string }) {
  return (
    <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 pt-32 text-center">
      <Trophy className="h-10 w-10 text-gold/60" aria-hidden />
      <h1 className="font-display mt-6 text-4xl font-bold text-ink">Club &quot;{slug}&quot; not in orbit</h1>
      <p className="mt-4 max-w-md text-dim">
        The crew you are looking for is not on our star map. Return to the council of five.
      </p>
      <Anchor to="/clubs" className="btn-gold mt-8" onClick={() => {}}>
        <ArrowLeft className="h-4 w-4" aria-hidden /> All clubs
      </Anchor>
    </main>
  );
}
