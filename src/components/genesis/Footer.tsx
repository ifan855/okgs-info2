"use client";

/* Footer — the bureau's sign-off, edition-aware.
   normal mode → dark ink footer over the paper site
   fair mode   → deep-space mission-control footer. */

import { Facebook, Youtube, Mail, Phone, MapPin, ExternalLink, Settings } from "lucide-react";
import { SITE, navLinksFor, CLUBS } from "@/lib/genesis/data";
import { useMode } from "@/lib/press";
import { Anchor } from "./FX";

export default function Footer() {
  const { isFair, fairName, fairTitle } = useMode();
  const links = navLinksFor(isFair ? "fair" : "normal");

  return (
    <footer className="relative z-10 mt-auto overflow-hidden border-t border-white/8 bg-[#04040c] [data-mode='normal']:border-black/20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: isFair
            ? "radial-gradient(50% 60% at 85% 110%, rgba(139,92,246,0.12), transparent 70%), radial-gradient(40% 50% at 10% 110%, rgba(240,180,41,0.07), transparent 70%)"
            : "radial-gradient(50% 60% at 85% 110%, rgba(217,119,6,0.1), transparent 70%), radial-gradient(40% 50% at 10% 110%, rgba(124,58,237,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          {/* brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <img src="https://res.cloudinary.com/tt7oyjd1/image/upload/okgs/okgs-logo.png" alt="OKGS crest" className="h-11 w-11 object-contain" />
              <div>
                <p className="font-display text-base font-bold tracking-wide text-ink md:text-lg">
                  {isFair ? (
                    <span className="text-gold-gradient">{fairName}</span>
                  ) : (
                    <>
                      OMAR K.G. <span className="text-gold-gradient">SCHOOL</span>
                    </>
                  )}
                </p>
                <p className="font-bangla mt-0.5 text-[13px] text-white/55">{SITE.schoolBn}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {isFair
                ? `${fairTitle} — two days of models, robots, quizzes, debates and big ideas, organised by the five clubs of OKGS, Kalai, Joypurhat.`
                : `${SITE.school} — the school's own corner of the web: campus life, the five clubs, official notices and the people of Kalai. ${SITE.sinceBn}`}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { href: SITE.facebook, icon: Facebook, label: "Facebook" },
                { href: SITE.youtube, icon: Youtube, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:scale-110 hover:text-gold-2"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:scale-110 hover:text-gold-2"
              >
                <Mail className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          {/* explore */}
          <div className="md:col-span-2">
            <p className="eyebrow !tracking-[0.3em]">Explore</p>
            <ul className="mt-5 space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Anchor to={l.href} className="text-sm text-white/60 transition-colors hover:text-gold-2">
                    {l.label}
                  </Anchor>
                </li>
              ))}
              <li>
                <Anchor to={isFair ? "/register" : "/contact"} className="text-sm text-white/60 transition-colors hover:text-gold-2">
                  {isFair ? "Sign in" : "Contact"}
                </Anchor>
              </li>
              <li>
                <Anchor to="/admin" className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-gold-2">
                  <Settings className="h-3 w-3" aria-hidden /> Admin studio
                </Anchor>
              </li>
            </ul>
          </div>

          {/* clubs */}
          <div className="md:col-span-3">
            <p className="eyebrow !tracking-[0.3em]">The Five Clubs</p>
            <ul className="mt-5 space-y-2.5">
              {CLUBS.map((c) => (
                <li key={c.slug}>
                  <Anchor
                    to={`/clubs/${c.slug}`}
                    className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold-2"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                    />
                    <span>{c.code}</span>
                    <span className="text-white/35 transition-colors group-hover:text-white/50">· {c.shortName}</span>
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="md:col-span-3">
            <p className="eyebrow !tracking-[0.3em]">{isFair ? "Info desk" : "Visit us"}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="transition-colors hover:text-gold-2">
                  {SITE.phone} · {SITE.phone2}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold-2">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.mainSite}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-gold-2/90 transition-colors hover:text-gold-2"
                >
                  omarkgschool.com <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={SITE.scienceHub}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-gold-2/90 transition-colors hover:text-gold-2"
                >
                  okgs.info <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[11px] tracking-wide text-white/40 md:flex-row">
          <p>© 2026 {SITE.school}. All rights reserved.</p>
          <p className="font-mono2 uppercase tracking-[0.25em]">
            {isFair ? "Exploring the universe of science" : `${SITE.mottoEn.toLowerCase()} · সবার জন্য মানসম্মত শিক্ষা`}
          </p>
        </div>
      </div>

      {/* giant watermark */}
      <div
        aria-hidden
        className="watermark pointer-events-none relative select-none text-center text-[18vw] leading-[0.75]"
        style={{ marginBottom: "-0.16em" }}
      >
        {isFair ? fairName.split(" ").slice(-1)[0].toUpperCase() : "OKGS"}
      </div>
    </footer>
  );
}
