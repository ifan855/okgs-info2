"use client";

/* Countdown — to Genesis ignition: 20 Nov 2026, 09:00 (+06) */

import { useEffect, useState } from "react";
import { FAIR } from "@/lib/genesis/data";

const TARGET = new Date(FAIR.startISO).getTime();

function diff() {
  const now = Date.now();
  const d = Math.max(TARGET - now, 0);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d % 86400000) / 3600000),
    mins: Math.floor((d % 3600000) / 60000),
    secs: Math.floor((d % 60000) / 1000),
  };
}

export default function Countdown({ compact = false }: { compact?: boolean }) {
  const [t, setT] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setT(diff()));
    const id = window.setInterval(() => setT(diff()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const cells = [
    { v: t?.days, label: "Days" },
    { v: t?.hours, label: "Hours" },
    { v: t?.mins, label: "Minutes" },
    { v: t?.secs, label: "Seconds" },
  ];

  return (
    <div className={compact ? "flex gap-2.5" : "flex flex-wrap gap-3 md:gap-4"} role="timer" aria-label="Countdown to Genesis 2026">
      {cells.map((c) => (
        <div
          key={c.label}
          className={`glass relative overflow-hidden rounded-2xl text-center ${
            compact ? "min-w-[64px] px-3 py-2.5" : "min-w-[86px] px-5 py-4 md:min-w-[104px]"
          }`}
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(240,180,41,0.7), transparent)" }}
          />
          <div className={`font-display font-bold tabular-nums text-gold-gradient ${compact ? "text-xl" : "text-3xl md:text-4xl"}`}>
            {c.v === undefined ? "--" : String(c.v).padStart(2, "0")}
          </div>
          <div className="font-mono2 mt-1 text-[9px] uppercase tracking-[0.3em] text-white/50">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
