"use client";

/* AboutView — #/about — the school behind the fair */

import { Landmark, ArrowUpRight, GraduationCap, BedDouble } from "lucide-react";
import { SITE, STATS, FACILITIES, PEOPLE } from "@/lib/genesis/data";
import { useMode } from "@/lib/press";
import { SplitText, Scramble, Reveal, StaggerGroup, StaggerItem, SectionHead, TiltCard, Counter, Anchor } from "../FX";
import IconFor from "../IconFor";

export default function AboutView() {
  return (
    <main className="relative z-10">
      <AboutHero />
      <StoryAndStats />
      <FacilitiesGrid />
      <PeopleGrid />
      <OfficialLinks />
    </main>
  );
}

function AboutHero() {
  const { isFair } = useMode();
  return (
    <section className="relative overflow-hidden pb-16 pt-40 nebula grain md:pt-48">
      <div aria-hidden className="aurora" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <Reveal y={12}>
          <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50">
            <Anchor to="/" className="transition-colors hover:text-gold-2">Home</Anchor>
            <span className="mx-2 text-gold">/</span>
            <span className="text-gold-2">The School</span>
          </p>
        </Reveal>
        <h1 className="font-display mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          <SplitText text="Omar Kindergarten School &" className="block text-ink" />
          <SplitText text="Omar Garden Academy" delay={0.3} className="block" letterClassName="text-gold-gradient" />
        </h1>
        <Reveal delay={0.5}>
          <p className="font-bangla mt-4 text-lg text-white/70">{SITE.schoolBn}</p>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-dim md:text-base">
            Since 2003, quality education in Kalai, Joypurhat — from Play group
            through Class 10, residential and non-residential.
            {isFair ? " The host and home of the OKGS Genesis science fair." : " Home to eleven hundred students and five clubs."}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function StoryAndStats() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHead
              eyebrow="Our story"
              title="Founded on a teacher's dream"
            />
            <div className="mt-7 max-w-2xl space-y-4">
              <Reveal>
                <p className="text-[15px] leading-relaxed text-dim md:text-base">
                  On the 1st of January 2003, the noted education enthusiast{" "}
                  <span className="font-medium text-ink">{SITE.founder}</span> laid the
                  foundation of what is today one of the best-known schools of Joypurhat
                  district. What began as a kindergarten in Kalai Sadar now teaches over
                  a thousand students — with a 100% public examination pass record.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-[15px] leading-relaxed text-dim md:text-base">
                  The campus carries its own library of 2,000+ books, a modern computer
                  laboratory where computer education is compulsory, separate hostels for
                  boys and girls, school buses, a canteen — and five active clubs whose
                  crews you met across this site.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-[15px] leading-relaxed text-dim md:text-base">
                  Quality education, discipline and human values — that is the mission
                  line every OKGS classroom hangs its stars on, and the spirit Genesis
                  2026 celebrates.
                </p>
              </Reveal>
            </div>
          </div>

          <StaggerGroup className="grid grid-cols-2 gap-4 self-start" stagger={0.09}>
            {STATS.map((s) => (
              <StaggerItem key={s.label}>
                <div className="panel h-full rounded-3xl p-6">
                  <span className="font-display text-gold-gradient text-4xl font-bold">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                  <p className="font-display mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/90">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/45">{s.sub}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* real campus strip */}
        <Reveal delay={0.2}>
          <div className="mt-14 grid gap-5 md:grid-cols-[1.6fr_1fr]">
            <figure className="group relative overflow-hidden rounded-[2rem] border border-white/10">
              <img
                src="/media/real/campus-1.jpg"
                alt="The school corridors at OKGS campus, Kalai"
                className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-80"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                <span className="font-editorial text-lg font-semibold text-ink">The corridors of the main academic block</span>
                <span className="font-mono2 text-[9px] uppercase tracking-[0.22em] text-white/60">Real campus · Kalai</span>
              </figcaption>
            </figure>
            <figure className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 p-8">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(217,119,6,0.09), transparent 70%)" }}
              />
              <img
                src="/media/real/crest.jpg"
                alt="The official OKGS crest"
                className="relative h-40 w-40 rounded-full object-cover shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <figcaption className="relative mt-6 text-center">
                <p className="font-editorial text-lg font-semibold text-ink">Established 2003 · Kalai, Joypurhat</p>
                <p className="font-bangla mt-1 text-sm text-white/55">{SITE.mottoBn} — {SITE.mottoEn}</p>
              </figcaption>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FacilitiesGrid() {
  return (
    <section className="relative nebula grain py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          eyebrow="Campus advantages"
          title="A beautiful place to learn"
          sub="Everything a student needs for a safe, joyful and modern school life."
        />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {FACILITIES.map((f) => (
            <StaggerItem key={f.title}>
              <TiltCard className="panel group h-full rounded-3xl p-7 transition-colors duration-500 hover:border-gold/40">
                <span className="glass flex h-12 w-12 items-center justify-center rounded-2xl text-gold-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
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

function PeopleGrid() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          eyebrow="Our faculty"
          title="Led by experienced hands"
          sub="The leadership team steering OKGS — and cheering loudest from the Genesis judging panel."
        />
        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.09}>
          {PEOPLE.map((p) => (
            <StaggerItem key={p.name}>
              <div className="panel group h-full rounded-3xl p-7 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold/25 to-nova/25 ring-1 ring-white/15">
                  <GraduationCap className="h-7 w-7 text-gold-2" aria-hidden />
                </span>
                <p className="font-bangla mt-4 text-[11px] uppercase tracking-[0.2em] text-gold-2/80">{p.bn}</p>
                <h3 className="font-display mt-1 text-lg font-semibold text-ink">{p.name}</h3>
                <p className="mt-1 text-sm text-white/50">{p.role}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.2}>
          <figure className="relative mx-auto mt-16 max-w-3xl rounded-[2rem] border border-gold/25 bg-gradient-to-br from-gold/10 via-transparent to-nova/10 p-10 text-center">
            <Landmark className="mx-auto h-6 w-6 text-gold/70" aria-hidden />
            <blockquote className="font-display mt-5 text-2xl font-medium italic leading-relaxed text-ink md:text-3xl">
              &ldquo;This is one of the best schools in Bangladesh.&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm text-white/55">
              Md. Meherul Islam · Country Manager, Vivacom BD Ltd
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

function OfficialLinks() {
  const links = [
    { icon: ArrowUpRight, title: "Main school website", href: SITE.mainSite, label: "omarkgschool.com" },
    { icon: BedDouble, title: "Admissions & hostel", href: `tel:${SITE.phoneAdmission.replace(/-/g, "")}`, label: SITE.phoneAdmission, tel: true },
  ];
  return (
    <section className="relative pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <StaggerGroup className="grid gap-5 md:grid-cols-2" stagger={0.12}>
          {links.map((l) => (
            <StaggerItem key={l.title}>
              <a
                href={l.href}
                target={l.tel ? undefined : "_blank"}
                rel={l.tel ? undefined : "noreferrer"}
                data-cursor="link"
                className="panel group flex items-center justify-between gap-6 rounded-3xl p-8 transition-all duration-500 hover:border-gold/40"
              >
                <div>
                  <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/45">{l.title}</p>
                  <p className="font-display mt-2 text-xl font-semibold text-ink group-hover:text-gold-2">{l.label}</p>
                </div>
                <span className="glass flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gold-2 transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" aria-hidden />
                </span>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
