"use client";

/* Navbar — floating glass command bar, edition-aware.
   Frosted on scroll, active-route underline, edition CTA,
   full-screen menu on mobile. CSS-driven animations. */

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Menu, X, Rocket, ChevronUp, PenLine } from "lucide-react";
import { navLinksFor, SITE } from "@/lib/genesis/data";
import { useMode } from "@/lib/press";
import { Anchor } from "./FX";

export default function Navbar({ route }: { route: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { isFair } = useMode();
  const links = navLinksFor(isFair ? "fair" : "normal");

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  const isActive = (href: string) =>
    href === "/" ? route === "/" : route === href || route.startsWith(href + "/");

  return (
    <>
      <header
        className="gen-rise fixed inset-x-0 top-0 z-[80]"
        style={{ animationDelay: "0.15s", animationDuration: "0.7s" }}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-500 md:px-8 ${
            scrolled ? "py-2.5" : "py-4"
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-x-3 inset-y-1 rounded-2xl transition-all duration-500 md:inset-x-6 ${
              scrolled
                ? "glass shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)]"
                : "border border-transparent bg-transparent"
            }`}
          />

          {/* logo */}
          <Anchor to="/" className="group relative z-10 flex items-center gap-3 py-1.5 pl-2 pr-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/15 transition-all duration-500 group-hover:ring-gold/60">
              <img src="/media/okgs-logo.png" alt="OKGS crest" className="h-7 w-7 object-contain" />
              <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ boxShadow: "0 0 22px rgba(240,180,41,0.35)" }} />
            </span>
            <span className="leading-tight">
              <span className="font-display block text-[15px] font-bold tracking-[0.14em] text-ink">
                OKGS <span className={isFair ? "text-gold-gradient" : "font-editorial italic text-gold-2"}>{isFair ? "GENESIS" : "PRESS"}</span>
              </span>
              <span className="font-mono2 block text-[8.5px] uppercase tracking-[0.3em] text-white/45">
                {isFair ? "Science Fair 2026" : "Newsroom · Est. 2003"}
              </span>
            </span>
          </Anchor>

          {/* desktop links */}
          <nav className="relative z-10 hidden items-center gap-1 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <Anchor
                key={l.href}
                to={l.href}
                className={`group relative rounded-full px-4 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive(l.href) ? "text-gold-2" : "text-white/70 hover:text-ink"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500 ${
                    isActive(l.href) ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                />
              </Anchor>
            ))}
            {isFair ? (
              <Anchor to="/register" className="btn-gold ml-3 !px-5 !py-2.5 !text-[13px]" onClick={() => {}}>
                <Rocket className="h-4 w-4" aria-hidden />
                Register
              </Anchor>
            ) : (
              <Anchor to="/contact" className="btn-gold ml-3 !px-5 !py-2.5 !text-[13px]" onClick={() => {}}>
                <PenLine className="h-4 w-4" aria-hidden />
                News desk
              </Anchor>
            )}
          </nav>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="glass relative z-10 flex h-11 w-11 items-center justify-center rounded-xl text-ink lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      {/* mobile menu */}
      {open && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-void/95 backdrop-blur-2xl">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "radial-gradient(70% 50% at 50% 0%, rgba(139,92,246,0.14), transparent 70%)" }}
          />
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-display text-sm font-bold tracking-[0.2em] text-ink">
              OKGS {isFair ? <span className="text-gold">GENESIS</span> : <span className="font-editorial italic text-gold-2">PRESS</span>}
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="glass flex h-11 w-11 items-center justify-center rounded-xl text-ink"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav className="relative flex flex-1 flex-col items-start justify-center gap-1 px-8" aria-label="Mobile">
            {[
              ...links,
              isFair ? { href: "/register", label: "Register" } : { href: "/contact", label: "News desk" },
            ].map((l, i) => (
              <div key={l.href} className="menu-in" style={{ animationDelay: `${0.06 + i * 0.06}s` }}>
                <Anchor
                  to={l.href}
                  className="font-display flex items-baseline gap-4 py-2 text-4xl font-semibold text-ink transition-colors hover:text-gold-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="font-mono2 text-xs text-gold/70">0{i + 1}</span>
                  {l.label}
                </Anchor>
              </div>
            ))}
          </nav>
          <div
            className="font-mono2 gen-rise px-8 pb-10 text-[10px] uppercase tracking-[0.3em] text-white/40"
            style={{ animationDelay: "0.5s" }}
          >
            {SITE.school} · Kalai, Joypurhat
          </div>
        </div>
      )}

      {/* back-to-top */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="glass gen-rise fixed bottom-6 right-6 z-[75] flex h-11 w-11 items-center justify-center rounded-full text-gold-2 transition-transform hover:scale-110"
        >
          <ChevronUp className="h-5 w-5" aria-hidden />
        </button>
      )}
    </>
  );
}
