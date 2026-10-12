"use client";

/* FairView — #/genesis — the full science fair programme.
   The fair's name + tagline come from the admin studio and are
   always rendered colon-combined. Sign-in replaces registration:
   the portal card is a placeholder with no functionality. */

import { useState } from "react";
import {
  Users, MapPin, CalendarDays, Trophy, Medal, Award, ChevronDown,
  TicketCheck, Sparkles, ClipboardList, LogIn, Lock,
} from "lucide-react";
import { FAIR, ARENAS, SCHEDULE, RULES, FAQS, SITE } from "@/lib/genesis/data";
import { filmsForEdition } from "@/lib/genesis/films";
import type { Film } from "@/lib/types";
import { useMode } from "@/lib/press";
import { SplitText, Reveal, CutIn, StaggerGroup, StaggerItem, SectionHead, Anchor, TiltCard, StarDots } from "../FX";
import { FilmCard, FilmModal } from "../FilmBox";
import Countdown from "../Countdown";
import IconFor from "../IconFor";

export default function FairView() {
  const [openFilm, setOpenFilm] = useState<Film | null>(null);
  return (
    <main className="relative z-10">
      <FairHero />
      <Overview />
      <ScreeningRoom onOpen={setOpenFilm} />
      <ArenaDetails />
      <Routine />
      <Prizes />
      <RulesBlock />
      <Faq />
      <LoginPanel />
      {openFilm && <FilmModal film={openFilm} onClose={() => setOpenFilm(null)} />}
    </main>
  );
}

/* ---------------- hero ---------------- */
function FairHero() {
  const { fairName, fairTagline } = useMode();
  return (
    <section className="relative overflow-hidden pb-20 pt-40 nebula grain md:pt-48">
      {/* pure-CSS deep sky */}
      <div aria-hidden className="aurora" />
      <StarDots count={24} />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <Reveal y={14}>
          <p className="font-mono2 flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-white/50">
            <Anchor to="/" className="transition-colors hover:text-gold-2">Home</Anchor>
            <span className="text-gold">/</span> <span className="text-gold-2">The Science Fair</span>
          </p>
        </Reveal>

        <div className="mt-6 grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1>
              <SplitText text={fairName} className="block text-ink" />
              <span className="font-editorial mt-3 block overflow-hidden text-2xl italic text-white/80 md:text-3xl">
                {fairTagline ? `: ${fairTagline}` : ""}
              </span>
            </h1>

            <Reveal delay={0.5} className="mt-8 flex flex-wrap gap-3">
              <span className="chip"><CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.datesLabel}</span>
              <span className="chip"><MapPin className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.venue}</span>
              <span className="chip"><TicketCheck className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.entry}</span>
            </Reveal>

            <Reveal delay={0.65} className="mt-10 flex flex-wrap gap-4">
              <a href="#arenas" data-cursor="link" className="btn-gold">
                Explore the arenas <ChevronDown className="h-4 w-4" aria-hidden />
              </a>
              <Anchor to="/register" className="btn-ghost">
                <LogIn className="h-4 w-4" aria-hidden /> Sign in
              </Anchor>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <div className="panel rounded-3xl p-6 md:p-8">
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/45">Launch window opens in</p>
              <div className="mt-5">
                <Countdown compact />
              </div>
              <div className="hairline my-6" />
              <ul className="space-y-3 text-sm text-dim">
                <li className="flex items-center justify-between gap-3">
                  <span>Award ceremony</span>
                  <span className="font-medium text-gold-2">21 Nov · 4:30 PM</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Open hours</span>
                  <span className="font-medium text-ink/85">{FAIR.hours}</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Arenas</span>
                  <span className="font-medium text-ink/85">7 competitions</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span>Info desk</span>
                  <span className="font-medium text-ink/85">{SITE.phone}</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- screening room — the last fair, on film ---------------- */
function ScreeningRoom({ onOpen }: { onOpen: (f: Film) => void }) {
  const fairFilms = filmsForEdition(true);
  return (
    <section className="relative z-10 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          eyebrow="Between the arenas"
          title="Screen the last fair"
          sub="Nineteen minutes from the school's own camera — the drone over Kalai, the plaque table, the crowd roar. Hover any card for a peek; click to watch with sound."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <CutIn delay={0.05}>
            <FilmCard film={fairFilms[0]} onOpen={onOpen} tall />
          </CutIn>
          <div className="grid gap-5 sm:grid-cols-2">
            {fairFilms.slice(1, 3).map((f, i) => (
              <CutIn key={f.id} delay={0.12 + i * 0.07}>
                <FilmCard film={f} onOpen={onOpen} />
              </CutIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- overview ---------------- */
function Overview() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <SectionHead eyebrow="About the fair" title="One stage for the whole school's science" />
            <div className="mt-7 max-w-2xl space-y-4">
              {FAIR.about.map((p, i) => (
                <Reveal key={i} delay={0.12 * i}>
                  <p className="text-[15px] leading-relaxed text-dim md:text-base">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <StaggerGroup className="grid grid-cols-2 gap-4 self-start" delay={0.1}>
            {FAIR.stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="panel rounded-3xl p-6 text-center">
                  <span className="font-display text-gold-gradient text-4xl font-bold md:text-5xl">
                    {s.value}{s.suffix}
                  </span>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/55">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
            <StaggerItem className="col-span-2">
              <div className="glass-gold flex items-center gap-4 rounded-3xl p-5">
                <Sparkles className="h-6 w-6 shrink-0 text-gold-2" aria-hidden />
                <p className="text-sm text-white/75">
                  Visitors welcome both days — no ticket, no RSVP. Just bring your curiosity.
                </p>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}

/* ---------------- arena details ---------------- */
function ArenaDetails() {
  return (
    <section id="arenas" className="relative scroll-mt-28 py-20 nebula grain md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          eyebrow="The arenas"
          title="Seven competitions, one cup"
          sub="Rules, class groups and judging criteria for every arena. Champions and runners-up in Junior (3–5), Middle (6–8) and Senior (9–10) groups where entries allow."
        />

        <div className="mt-16 space-y-6">
          {ARENAS.map((a, i) => (
            <Reveal key={a.id} delay={0.05 * i} id={a.id}>
              <TiltCard max={3} glare={false} className="panel scroll-mt-32 overflow-hidden rounded-[2rem]">
                <div className="grid gap-0 lg:grid-cols-[auto_1.5fr_1fr]">
                  {/* index + icon */}
                  <div className="relative flex items-center justify-center gap-5 border-b border-white/8 px-8 py-7 lg:w-52 lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:py-10">
                    <span className="text-outline font-display absolute right-4 top-4 text-6xl font-bold opacity-60 lg:hidden">{a.index}</span>
                    <span className="glass flex h-16 w-16 items-center justify-center rounded-2xl text-gold-2">
                      <IconFor name={a.icon} className="h-7 w-7" />
                    </span>
                    <span className="text-outline hidden font-display text-6xl font-bold lg:block">{a.index}</span>
                  </div>

                  {/* body */}
                  <div className="px-8 py-8 lg:py-10">
                    <h3 className="font-display text-2xl font-semibold text-ink">{a.name}</h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-dim">{a.desc}</p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <span className="chip !py-1.5"><Users className="h-3.5 w-3.5 text-gold" aria-hidden />{a.team}</span>
                      <span className="chip !py-1.5"><ClipboardList className="h-3.5 w-3.5 text-gold" aria-hidden />{a.classes}</span>
                      <span className="chip !py-1.5"><MapPin className="h-3.5 w-3.5 text-gold" aria-hidden />{a.venue}</span>
                    </div>
                  </div>

                  {/* criteria */}
                  <div className="border-t border-white/8 bg-white/[0.02] px-8 py-8 lg:border-l lg:border-t-0 lg:py-10">
                    <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-gold-2/90">Judged on</p>
                    <ul className="mt-4 space-y-2.5">
                      {a.criteria.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-dim">
                          <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- routine ---------------- */
function Routine() {
  const [day, setDay] = useState<"day1" | "day2">("day1");
  const data = SCHEDULE[day];

  return (
    <section id="routine" className="relative scroll-mt-28 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <SectionHead
          eyebrow="Mission timeline"
          title="The two-day routine"
          sub="Subject to light-speed fine-tuning — the final bulletin is posted on the school notice board."
        />

        <Reveal delay={0.15} className="mt-10">
          <div className="glass inline-flex rounded-full p-1.5">
            {(["day1", "day2"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`font-display relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
                  day === d ? "text-void" : "text-white/70 hover:text-white"
                }`}
              >
                {day === d && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(120deg,#ffdf8e,#f0b429)" }}
                  />
                )}
                <span className="relative">{SCHEDULE[d].label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div key={day} className="view-in mt-10">
            <p className="font-mono2 text-xs uppercase tracking-[0.3em] text-gold-2">{data.date}</p>
            <div className="relative mt-8 space-y-0 before:absolute before:bottom-2 before:left-[52px] before:top-2 before:w-px before:bg-gradient-to-b before:from-gold/60 before:via-nova/40 before:to-transparent md:before:left-[76px]">
              {data.events.map((e, i) => (
                <div
                  key={e.time + e.title}
                  className="group relative flex gap-5 py-4 md:gap-8"
                  style={{
                    opacity: 0,
                    animation: `rise-in 0.6s cubic-bezier(0.22,1,0.36,1) ${0.07 * i}s both`,
                  }}
                >
                  <div className="font-display w-10 shrink-0 pt-1 text-right text-sm font-semibold text-gold-2 tabular-nums md:w-14 md:text-base">
                    {e.time}
                  </div>
                  <span className="relative z-10 mt-2 h-3 w-3 shrink-0 rounded-full border-2 border-gold bg-void transition-all duration-300 group-hover:scale-125 group-hover:bg-gold" />
                  <div className="panel flex-1 rounded-2xl px-5 py-4 transition-colors duration-300 group-hover:border-gold/35">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-display text-base font-semibold text-ink md:text-lg">{e.title}</h4>
                      <span className="font-mono2 rounded-full border border-white/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-white/50">
                        {e.tag}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-dim">{e.detail}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-white/45">
                      <MapPin className="h-3 w-3 text-gold/70" aria-hidden /> {e.venue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- prizes ---------------- */
function Prizes() {
  const prizes = [
    { icon: Trophy, name: "The Genesis Cup", detail: "Awarded to the single best project of the fair across all arenas — kept at school with the winning crew's names engraved.", tint: "#f0b429" },
    { icon: Medal, name: "Arena Champions", detail: "Each arena crowns a champion and runner-up with crests, certificates and science kits.", tint: "#c4b5fd" },
    { icon: Award, name: "Certificates for all", detail: "Every participant receives an official Genesis 2026 certificate signed by the principal.", tint: "#7dd3fc" },
  ];
  return (
    <section className="relative nebula grain py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead eyebrow="Glory awaits" title="Prizes & honours" align="center" />
        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {prizes.map((p) => (
            <StaggerItem key={p.name}>
              <TiltCard className="panel relative h-full overflow-hidden rounded-3xl p-8 text-center">
                <span
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: `${p.tint}1f`, border: `1px solid ${p.tint}55`, boxShadow: `0 0 34px ${p.tint}33` }}
                >
                  <p.icon className="h-7 w-7" style={{ color: p.tint }} aria-hidden />
                </span>
                <h3 className="font-display mt-6 text-xl font-semibold text-ink">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dim">{p.detail}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ---------------- rules ---------------- */
function RulesBlock() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHead eyebrow="Ground control rules" title="Six rules of the fair" />
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-dim">
                Short, simple and strictly enforced — so every crew gets a fair
                launch window and every project gets judged on its merits.
              </p>
            </Reveal>
          </div>
          <StaggerGroup className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
            {RULES.map((r) => (
              <StaggerItem key={r.n}>
                <div className="panel group h-full rounded-3xl p-6 transition-colors duration-500 hover:border-gold/40">
                  <span className="font-mono2 text-xs tracking-[0.3em] text-gold/80">{r.n}</span>
                  <h4 className="font-display mt-3 text-lg font-semibold text-ink">{r.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{r.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}

/* ---------------- faq ---------------- */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative nebula grain py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <SectionHead eyebrow="Before you ask" title="Frequently asked questions" align="center" />
        <div className="mt-14 space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={0.06 * i}>
                <div className={`panel overflow-hidden rounded-2xl transition-colors duration-500 ${isOpen ? "border-gold/40" : ""}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-base font-semibold text-ink md:text-lg">{f.q}</span>
                    <span
                      className={`shrink-0 transition-all duration-500 ${isOpen ? "rotate-180 text-gold-2" : "text-white/50"}`}
                    >
                      <ChevronDown className="h-5 w-5" aria-hidden />
                    </span>
                  </button>
                  <div className={`acc-panel ${isOpen ? "open" : ""}`}>
                    <div>
                      <p className="px-6 pb-6 text-sm leading-relaxed text-dim md:text-[15px]">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- sign-in panel (placeholder — no functionality) ---------------- */
function LoginPanel() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="glass-gold relative overflow-hidden rounded-[2.5rem] p-10 md:p-16">
            <StarDots count={14} />
            <div className="mx-auto max-w-md text-center">
              <span className="glass mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-gold-2">
                <Lock className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="font-display mt-6 text-3xl font-bold leading-tight text-ink md:text-4xl">
                Fair portal sign-in
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                Participants, judges and crew will sign in here once the portal opens.
              </p>
              <form className="mt-8 space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="portal-email" className="mb-1.5 block text-xs font-medium text-white/55">Email or crew ID</label>
                  <input id="portal-email" type="email" placeholder="you@okgs.info" className="field" autoComplete="off" />
                </div>
                <div>
                  <label htmlFor="portal-pass" className="mb-1.5 block text-xs font-medium text-white/55">Password</label>
                  <input id="portal-pass" type="password" placeholder="••••••••" className="field" autoComplete="off" />
                </div>
                <button type="submit" disabled className="btn-gold mt-2 w-full justify-center opacity-55" title="The portal opens soon">
                  Continue
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-white/40">
                The portal opens soon — for now, the info desk at {SITE.phone} answers everything.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
