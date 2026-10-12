"use client";

/* ============================================================
   FX — shared animation primitives for OKGS Genesis 2026
   SplitText · Scramble · Reveal · Counter · Marquee ·
   Magnetic · TiltCard · SectionHead · Anchor
   ============================================================ */

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef, useState, useMemo, type ReactNode, type MouseEvent } from "react";
import { navigateTo } from "@/lib/genesis/router";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- SplitText: letter-by-letter cinematic reveal ----------------
   NOTE: visual classes that use background-clip:text (gradients/outlines) must
   be passed via `letterClassName` so they sit on an inner STATIC span —
   animating filter/transform directly on a background-clip:text element makes
   the glyphs invisible in Chromium. */
export function SplitText({
  text,
  className = "",
  letterClassName = "",
  delay = 0,
  stagger = 0.035,
  once = true,
}: {
  text: string;
  className?: string;
  letterClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-8% 0px" });
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <motion.span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => {
            const i = charIndex++;
            return (
              <motion.span
                key={ci}
                aria-hidden
                className="inline-block will-change-transform"
                initial={{ opacity: 0, y: "0.7em", rotateX: -70, filter: "blur(10px)" }}
                animate={
                  inView
                    ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }
                    : {}
                }
                transition={{
                  duration: 0.85,
                  delay: delay + i * stagger,
                  ease: EASE,
                }}
              >
                <span className={letterClassName}>{ch}</span>
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/* ---------------- Scramble: decode effect for labels ---------------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ✦*·#%&";

export function Scramble({
  text,
  className = "",
  speed = 28,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const [out, setOut] = useState(text.replace(/[^\s]/g, "·"));

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let frame = 0;
    const total = text.length;
    const timeout = window.setTimeout(() => {
      const tick = () => {
        frame++;
        const revealed = Math.floor(frame / 2);
        let s = "";
        for (let i = 0; i < total; i++) {
          const ch = text[i];
          if (ch === " ") { s += " "; continue; }
          if (i < revealed) s += ch;
          else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOut(s);
        if (revealed <= total) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [inView, text, speed, startDelay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {out}
    </span>
  );
}

/* ---------------- Reveal: generic scroll-in wrapper ---------------- */
export function Reveal({
  children,
  delay = 0,
  y = 34,
  blur = true,
  className = "",
  once = true,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
  once?: boolean;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- CutIn: the quick-cut entrance ----------------
   A hard clip reveal — no blur drift, 0.4s. Used by the film
   desk so footage enters like an edit cut, not a soft fade. */
export function CutIn({
  children,
  delay = 0,
  className = "",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -14, clipPath: "inset(0 0 14% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.42, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Stagger container + item ---------------- */
export function StaggerGroup({
  children,
  className = "",
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Counter: animated numbers ---------------- */
export function Counter({
  value,
  suffix = "",
  className = "",
  duration = 1800,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {/* year-like values (1000–2999, no suffix) read better ungrouped: 2003, not 2,003 */}
      {value >= 1000 && value <= 2999 && !suffix
        ? String(n)
        : n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ---------------- Marquee: infinite band ---------------- */
export function Marquee({
  items,
  className = "",
  fast = false,
  separator = "✦",
}: {
  items: ReactNode[];
  className?: string;
  fast?: boolean;
  separator?: string;
}) {
  const row = (
    <>
      {items.map((it, i) => (
        <span key={i} className="mx-6 inline-flex items-center gap-6 md:mx-10 md:gap-10">
          <span className="inline-block">{it}</span>
          <span className="text-gold/70 inline-block text-sm">{separator}</span>
        </span>
      ))}
    </>
  );
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <div className={`inline-flex w-max items-center whitespace-nowrap ${fast ? "animate-marquee-fast" : "animate-marquee"}`}>
        <div className="inline-flex items-center">{row}</div>
        <div className="inline-flex items-center">{row}</div>
      </div>
    </div>
  );
}

/* ---------------- Magnetic: cursor-attracted element ---------------- */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- TiltCard: 3D hover tilt + glare ---------------- */
export function TiltCard({
  children,
  className = "",
  max = 9,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const srx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 160, damping: 16 });
  const sry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 160, damping: 16 });
  const [glow, setGlow] = useState({ x: 50, y: 50, o: 0 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px);
    my.set(py);
    setGlow({ x: px * 100, y: py * 100, o: 1 });
  };
  const reset = () => { mx.set(0.5); my.set(0.5); setGlow((g) => ({ ...g, o: 0 })); };

  return (
    <motion.div
      ref={ref}
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={{ rotateX: srx, rotateY: sry, perspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
          style={{
            opacity: glow.o,
            background: `radial-gradient(320px circle at ${glow.x}% ${glow.y}%, rgba(240,180,41,0.14), rgba(139,92,246,0.08) 40%, transparent 65%)`,
          }}
        />
      )}
    </motion.div>
  );
}

/* ---------------- SectionHead: eyebrow + split title + optional sub ---------------- */
export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <Reveal y={16}>
        <div className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
          <span className="inline-block h-px w-8 bg-gradient-to-r from-transparent to-gold/80" />
          <Scramble text={eyebrow} />
          {align === "center" && <span className="inline-block h-px w-8 bg-gradient-to-l from-transparent to-gold/80" />}
        </div>
      </Reveal>
      <SplitText
        text={title}
        className={`font-display mt-4 text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl`}
        letterClassName={dark ? "text-gold-gradient" : ""}
      />
      {sub && (
        <Reveal delay={0.25} y={18}>
          <p className={`mt-5 max-w-2xl text-[15px] leading-relaxed md:text-base ${align === "center" ? "mx-auto" : ""} text-dim`}>
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- Anchor: hash link styled as needed ---------------- */
export function Anchor({
  to,
  className = "",
  children,
  onClick,
  ariaLabel,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <a
      href={`#${to}`}
      aria-label={ariaLabel}
      data-cursor="link"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigateTo(to);
      }}
    >
      {children}
    </a>
  );
}

/* ---------------- Small star dot field (decorative, CSS-driven) ---------------- */
export function StarDots({ count = 26, className = "" }: { count?: number; className?: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 61.8 + 13) % 100,
        top: (i * 37.7 + 29) % 100,
        size: 1 + ((i * 7) % 3),
        delay: (i * 0.37) % 4,
        dur: 2.6 + ((i * 0.53) % 3),
      })),
    [count],
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
