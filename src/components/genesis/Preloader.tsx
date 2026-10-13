"use client";

/* Preloader — the grand opening.
   0→100 progress, GENESIS letters materialising from stardust,
   mission-log status lines, then a big-bang flash that parts the sky.
   Pure CSS/state driven for bulletproof cross-browser behaviour. */

import { useEffect, useRef, useState } from "react";

const STATUS_LINES = [
  "Calibrating star charts…",
  "Fueling the curiosity engines…",
  "Warming up the robotics bay…",
  "Aligning five club satellites…",
  "Counting down to Genesis…",
];

const LETTERS = "GENESIS".split("");

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const DURATION = 2600;
    let timeoutId = 0;
    let doneTimerId = 0;

    const tick = (t: number) => {
      const p = Math.min((t - t0) / DURATION, 1);
      const eased = p < 0.7 ? p * 1.25 : 0.875 + ((p - 0.7) / 0.3) * 0.125;
      setProgress(Math.min(Math.round(eased * 100), 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        timeoutId = window.setTimeout(() => setExiting(true), 500);
      }
    };
    raf = requestAnimationFrame(tick);

    const statusTimer = window.setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS_LINES.length),
      620,
    );

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(statusTimer);
      window.clearTimeout(timeoutId);
      window.clearTimeout(doneTimerId);
    };
  }, []);

  /* sky parts → notify parent (CSS animation duration ≈ 1s) */
  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(onDone, 1150);
    return () => window.clearTimeout(t);
  }, [exiting]);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden={exiting}>
      {/* ── backdrop: two void halves that part at the end ── */}
      <div
        className={`absolute inset-x-0 top-0 z-0 h-1/2 bg-void ${exiting ? "gen-part-up" : ""}`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 z-0 h-1/2 bg-void ${exiting ? "gen-part-down" : ""}`}
      />

      {/* ── the loading screen content ── */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? "scale(1.06)" : "scale(1)",
          filter: exiting ? "blur(6px)" : "none",
          transition: "opacity 0.45s ease-out, transform 0.45s ease-out, filter 0.45s ease-out",
        }}
      >
        {/* radial glow + stars */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 42%, rgba(139,92,246,0.16), transparent 70%), radial-gradient(45% 40% at 50% 55%, rgba(240,180,41,0.10), transparent 70%)",
          }}
        />
        <div className="absolute inset-0">
          {Array.from({ length: 42 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${(i * 23.7 + 7) % 100}%`,
                top: `${(i * 41.3 + 13) % 100}%`,
                width: i % 6 === 0 ? 2 : 1,
                height: i % 6 === 0 ? 2 : 1,
                opacity: 0.25 + ((i * 7) % 5) * 0.14,
                animation: `twinkle ${2 + (i % 5) * 0.7}s ease-in-out ${(i % 9) * 0.4}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <div className="eyebrow gen-rise" style={{ animationDelay: "0.15s" }}>
            Omar K.G. School presents
          </div>

          <div className="mt-5 flex items-baseline justify-center">
            <div className="font-display flex justify-center overflow-hidden text-[15vw] font-bold leading-none tracking-[0.06em] sm:text-[11vw] lg:text-[9rem]">
              {LETTERS.map((ch, i) => {
                const born = progress > (i + 1) * 9;
                return (
                  <span key={i} aria-hidden className="inline-block overflow-hidden">
                    <span
                      className={`inline-block ${born ? "gen-letter-in" : "opacity-0"}`}
                      style={born ? { animationDelay: "0.05s" } : undefined}
                    >
                      <span className="text-gold-gradient">{ch}</span>
                    </span>
                  </span>
                );
              })}
            </div>
            <span
              className={`font-display ml-3 inline-block overflow-hidden text-[7vw] font-bold leading-none sm:text-[5vw] lg:text-4xl ${
                progress > 70 ? "" : "opacity-0"
              }`}
            >
              <span className={`inline-block ${progress > 70 ? "gen-letter-in" : "opacity-0"}`}>
                <span className="text-outline-gold">2026</span>
              </span>
            </span>
          </div>

          <p
            className="font-display gen-rise mt-4 text-sm uppercase tracking-[0.5em] text-white/70 md:text-base"
            style={{ animationDelay: "1.1s" }}
          >
            Exploring the Universe of Science
          </p>

          <div className="mt-12 w-64 md:w-80">
            <div className="flex items-end justify-between">
              <span
                key={statusIdx}
                className="font-mono2 gen-rise inline-block text-[10px] uppercase tracking-[0.28em] text-white/55"
              >
                {STATUS_LINES[statusIdx]}
              </span>
              <span className="font-mono2 text-sm text-gold">{progress}%</span>
            </div>
            <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
              <div
                className="h-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #f0b429, #c4b5fd, #7dd3fc)",
                  boxShadow: "0 0 14px rgba(240,180,41,0.7)",
                  transition: "width 0.12s linear",
                }}
              />
            </div>
          </div>
        </div>

        <div className="font-mono2 absolute bottom-8 left-0 right-0 z-10 flex items-center justify-between px-6 text-[9px] uppercase tracking-[0.3em] text-white/35 md:px-10">
          <span>OKGS · Kalai, Joypurhat</span>
          <span className="hidden sm:inline">23.7205° N · 89.0408° E</span>
          <span>EST. 2003</span>
        </div>
      </div>

      {/* ── big-bang flash ── */}
      {exiting && (
        <div
          className="gen-flash pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(45% 45% at 50% 50%, rgba(255,224,138,0.95), rgba(240,180,41,0.4) 40%, transparent 70%)",
          }}
        />
      )}

      {/* ── genesis light seam ── */}
      {exiting && (
        <div
          className="gen-seam pointer-events-none absolute left-1/2 top-1/2 z-40 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #ffdf8e, transparent)" }}
        />
      )}
    </div>
  );
}
