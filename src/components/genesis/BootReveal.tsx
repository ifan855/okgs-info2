"use client";

/* BootReveal — the instant editorial opening.
   No progress bar, no waiting: content renders underneath from
   frame one while a slim masthead panel lifts away in ~1s.
   normal mode → paper masthead with serif wordmark
   fair mode   → deep-space curtain with the gold seam        */

import { useEffect, useState } from "react";
import { useMode } from "@/lib/press";

export default function BootReveal({ onDone }: { onDone: () => void }) {
  const { isFair } = useMode();
  const [lifted, setLifted] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setLifted(true), 10); // start lift almost immediately
    const t2 = window.setTimeout(() => {
      setGone(true);
      onDone();
    }, 1150);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden={lifted}>
      {/* the curtain */}
      <div
        className={`absolute inset-0 ${lifted ? "boot-lift" : ""}`}
        style={{
          background: isFair
            ? "radial-gradient(80% 60% at 50% 35%, #0a0a1c 0%, #05050f 70%)"
            : "linear-gradient(180deg, #faf8f3 0%, #f3efe4 100%)",
          boxShadow: isFair ? "none" : "0 30px 80px rgba(20,32,51,0.18)",
        }}
      >
        {/* masthead */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <div
            className="boot-rule mb-6 h-px w-24"
            style={{ background: isFair ? "linear-gradient(90deg, transparent, #f0b429, transparent)" : "rgba(20,32,51,0.35)" }}
          />
          <div className="overflow-hidden">
            <span
              className="boot-word block leading-none"
              style={{
                fontFamily: isFair ? "var(--font-display)" : '"Newsreader", Georgia, serif',
                fontWeight: isFair ? 700 : 600,
                fontSize: "clamp(3rem, 9vw, 6.5rem)",
                letterSpacing: isFair ? "0.08em" : "0.02em",
                color: isFair ? "#f2eee6" : "#16233a",
                fontStyle: isFair ? "normal" : "italic",
              }}
            >
              OKGS
            </span>
          </div>
          <span
            className="boot-tag mt-4 text-[10px] uppercase md:text-xs"
            style={{
              fontFamily: "var(--font-mono2)",
              letterSpacing: "0.42em",
              color: isFair ? "rgba(240,180,41,0.9)" : "#b45309",
            }}
          >
            {isFair ? "Genesis 2026 · Press Bureau" : "Press Bureau · Est. 2003"}
          </span>
          <div
            className="boot-rule mt-6 h-px w-40"
            style={{ background: isFair ? "rgba(255,255,255,0.14)" : "rgba(20,32,51,0.18)" }}
          />
        </div>

        {/* bottom coordinate line */}
        <div
          className="absolute bottom-7 left-0 right-0 flex items-center justify-between px-6 text-[9px] uppercase md:px-10"
          style={{
            fontFamily: "var(--font-mono2)",
            letterSpacing: "0.3em",
            color: isFair ? "rgba(255,255,255,0.35)" : "rgba(20,32,51,0.4)",
          }}
        >
          <span>Omar K.G. School</span>
          <span className="hidden sm:inline">Kalai · Joypurhat</span>
          <span>EST. 2003</span>
        </div>
      </div>

      {/* gold seam left behind as the curtain lifts (fair mode only) */}
      {lifted && isFair && (
        <div
          className="boot-rule pointer-events-none absolute top-0 left-0 h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, #ffdf8e, transparent)" }}
        />
      )}
    </div>
  );
}
