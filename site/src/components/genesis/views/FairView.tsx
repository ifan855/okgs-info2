"use client";

/* FairView — #/genesis — the full science fair programme */

import { useState } from "react";
import {
  Users, MapPin, CalendarDays, Trophy, Medal, Award, ChevronDown,
  ArrowRight, TicketCheck, Sparkles, ClipboardList, Rocket,
} from "lucide-react";
import { FAIR, ARENAS, SCHEDULE, RULES, FAQS, SITE } from "@/lib/genesis/data";
import { SplitText, Scramble, Reveal, StaggerGroup, StaggerItem, SectionHead, Anchor, TiltCard, StarDots } from "../FX";
import Countdown from "../Countdown";
import IconFor from "../IconFor";

export default function FairView() {
  return (
    <main className="relative z-10">
      <FairHero />
      <Overview />
      <ArenaDetails />
      <Routine />
      <Prizes />
      <RulesBlock />
      <Faq />
      <RegisterPanel />
    </main>
  );
}

/* ---------------- hero ---------------- */
function FairHero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-40 nebula grain md:pt-48">
      <div aria-hidden className="absolute inset-0">
        <img src="/media/hero-nebula.png" alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/50 to-void" />
      </div>
      <StarDots count={22} />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <Reveal y={14}>
          <p className="font-mono2 flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-white/50">
            <Anchor to="/" className="transition-colors hover:text-gold-2">Home</Anchor>
            <span className="text-gold">/</span> <span className="text-gold-2">The Science Fair</span>
          </p>
        </Reveal>

        <div className="mt-6 grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Scramble text="OKGS GENESIS 2026" className="eyebrow" />
            <h1 className="font-display mt-4 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              <SplitText text="OKGS Genesis" className="block text-ink" />
              <SplitText text="2026" delay={0.4} className="block" letterClassName="text-gold-gradient" />
            </h1>
            <p
              className="gen-rise font-display mt-5 text-xl text-white/80 md:text-2xl"
              style={{ animationDelay: "0.7s", animationDuration: "0.9s" }}
            >
              Exploring the <span className="italic text-gold-2">Universe</span> of Science
            </p>

            <Reveal delay={0.5} className="mt-8 flex flex-wrap gap-3">
              <span className="chip"><CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.datesLabel}</span>
              <span className="chip"><MapPin className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.venue}</span>
              <span className="chip"><TicketCheck className="h-3.5 w-3.5 text-gold" aria-hidden /> {FAIR.entry}</span>
            </Reveal>

            <Reveal delay={0.65} className="mt-10 flex flex-wrap gap-4">
              <Anchor to="/register" className="btn-gold" onClick={() => {}}>
                <Rocket className="h-4 w-4" aria-hidden /> Register — it&apos;s free
              </Anchor>
              <a href="#arenas" data-cursor="link" className="btn-ghost">
                Jump to arenas <ChevronDown className="h-4 w-4" aria-hidden />
              </a>
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
                  <span>Registration deadline</span>
                  <span className="font-medium text-gold-2">{FAIR.regDeadline}</span>
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

/* ---------------- register panel ---------------- */
function RegisterPanel() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="glass-gold relative overflow-hidden rounded-[2.5rem] p-10 text-center md:p-16">
            <StarDots count={16} />
            <Scramble text="SEAT IN ORBIT" className="eyebrow" />
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-4xl font-bold leading-tight text-ink md:text-5xl">
              Registration closes {FAIR.regDeadline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/70">
              Free for every OKGS student. Form online in two minutes, or collect one
              from the school office.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Anchor to="/register" className="btn-gold" onClick={() => {}}>
                Open the form <ArrowRight className="h-4 w-4" aria-hidden />
              </Anchor>
              <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="btn-ghost" data-cursor="link">
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
