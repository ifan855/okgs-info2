"use client";

/* ============================================================
   Overture — the grand cinematic opening.
   A pure-typography title card: the school line, then the fair's
   full title (name + ": " + tagline, always colon-combined),
   a light seam, a bloom — then the screen parts vertically and
   hands off to the hero's own entrance. ~2.9s once per session,
   click to skip, reduced-motion aware. No progress bar, ever.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { useMode } from "@/lib/press";
import { SITE } from "@/lib/genesis/data";

export default function Overture({ onDone }: { onDone: () => void }) {
  const { isFair, fairName, fairTagline } = useMode();
  const [seam, setSeam] = useState(false);
  const [parting, setParting] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setGone(true);
    onDoneRef.current();
  };

  useEffect(() => {
    /* QA affordance: ?overture forces the full sequence even under
       prefers-reduced-motion (headless browsers default to reduce). */
    const force = new URLSearchParams(window.location.search).has("overture");
    const reduce = !force && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = window.setTimeout(finish, 120);
      return () => window.clearTimeout(t);
    }
    const t1 = window.setTimeout(() => setSeam(true), 1550);
    const t2 = window.setTimeout(() => setParting(true), 2050);
    const t3 = window.setTimeout(finish, 2950);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
     
  }, []);

  const skip = () => {
    if (parting) return;
    setSeam(true);
    setParting(true);
    window.setTimeout(finish, 900);
  };

  if (gone) return null;

  const schoolLine = SITE.school.toUpperCase();
  const name = isFair ? fairName : "Omar Kindergarten School";
  const tagline = isFair ? fairTagline : "Quality education for all";

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer"
      onClick={skip}
      role="presentation"
      aria-hidden={parting}
      data-testid="overture"
    >
      {/* the two void panels */}
      <div className={`absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-void ${parting ? "ov-part-up" : ""}`}>
        <div className="aurora opacity-60" />
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-void ${parting ? "ov-part-down" : ""}`}>
        <div className="aurora opacity-40" style={{ transform: "scaleY(-1)" }} />
      </div>

      {/* the light seam */}
      {seam && !parting && (
        <div
          className="gen-seam pointer-events-none absolute left-1/2 top-1/2 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #a9f5e8, #ffdf8e, #a9f5e8, transparent)" }}
        />
      )}

      {/* the title card */}
      <div className={`absolute inset-0 flex items-center justify-center px-6 ${parting ? "ov-bloom" : ""}`}>
        <div aria-hidden className="aurora ov-glow opacity-50" />
        <div className="grain pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative z-10 max-w-5xl text-center">
          <p
            className="ov-fade font-mono2 text-[9px] uppercase tracking-[0.5em] text-white/45 md:text-[11px]"
            style={{ animationDelay: "0.15s" }}
          >
            {schoolLine}
          </p>

          <div className="mt-6 overflow-hidden md:mt-8">
            <h1 className="ov-line-up m-0 leading-[1.04]" style={{ animationDelay: "0.35s" }}>
              <span
                className="font-display font-bold tracking-[0.02em]"
                style={{ fontSize: "clamp(2.1rem, 7.2vw, 5.6rem)", color: "var(--c-ink)" }}
              >
                {name}
              </span>
              <span
                className="font-editorial italic"
                style={{ fontSize: "clamp(1.15rem, 3.2vw, 2.4rem)", color: "rgba(233,238,246,0.78)" }}
              >
                {tagline ? `: ${tagline}` : ""}
              </span>
            </h1>
          </div>

          <div
            className="ov-soft-in mx-auto mt-8 h-px w-28"
            style={{ animationDelay: "1.05s", background: "linear-gradient(90deg, transparent, rgba(240,180,41,0.9), transparent)" }}
          />
        </div>
      </div>

      {/* skip affordance */}
      {!parting && (
        <p
          className="ov-fade font-mono2 absolute bottom-8 left-0 right-0 text-center text-[9px] uppercase tracking-[0.42em] text-white/30"
          style={{ animationDelay: "1.4s" }}
        >
          Tap to enter
        </p>
      )}
    </div>
  );
}
