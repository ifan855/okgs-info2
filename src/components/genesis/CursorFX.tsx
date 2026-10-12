"use client";

/* CursorFX — billion-dollar cursor system (fine pointers only):
   · glowing core dot + lagging halo ring (lerped)
   · star-dust particle trail while moving
   · golden burst on click
   · ring grows + shows label on [data-cursor] targets
   · ring morphs over links/buttons */

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; hue: number; g: number;
}

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    document.body.classList.add("custom-cursor");
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sizeCanvas = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();

    const pos = { x: w / 2, y: h / 2, rx: w / 2, ry: h / 2 };
    let scale = 1, targetScale = 1;
    let ringColor = "rgba(240,180,41,0.55)";
    let targetColor = ringColor;
    let visible = false;
    const particles: Particle[] = [];
    let lastSpawn = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      visible = true;
      pos.x = e.clientX; pos.y = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";

      const el = (e.target as HTMLElement)?.closest?.(
        "a,button,[data-cursor],input,select,textarea,[role='button']",
      ) as HTMLElement | null;
      if (el) {
        const kind = el.getAttribute("data-cursor");
        targetScale = 2.1;
        targetColor = "rgba(240,180,41,0.85)";
        label.textContent = kind && kind !== "link" ? kind : "";
        label.style.opacity = kind && kind !== "link" ? "1" : "0";
      } else {
        targetScale = 1;
        targetColor = "rgba(240,180,41,0.55)";
        label.style.opacity = "0";
      }

      // spawn stardust (throttled)
      const now = performance.now();
      if (!reduced && now - lastSpawn > 26) {
        lastSpawn = now;
        particles.push({
          x: pos.x, y: pos.y,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7 + 0.35,
          life: 0, maxLife: 34 + Math.random() * 26,
          size: 0.7 + Math.random() * 1.7,
          hue: Math.random() < 0.55 ? 46 : 268,
          g: 0.012,
        });
      }
    };

    const onDown = (e: MouseEvent) => {
      targetScale = 0.7;
      if (!reduced) {
        for (let i = 0; i < 22; i++) {
          const a = (Math.PI * 2 * i) / 22 + Math.random() * 0.4;
          const sp = 1.6 + Math.random() * 2.6;
          particles.push({
            x: e.clientX, y: e.clientY,
            vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
            life: 0, maxLife: 40 + Math.random() * 26,
            size: 1 + Math.random() * 2,
            hue: Math.random() < 0.6 ? 46 : 38,
            g: 0.02,
          });
        }
      }
    };
    const onUp = () => { targetScale = 1; };
    const onLeave = () => { visible = false; dot.style.opacity = "0"; ring.style.opacity = "0"; };

    const tick = () => {
      // lerp ring toward dot
      pos.rx += (pos.x - pos.rx) * 0.16;
      pos.ry += (pos.y - pos.ry) * 0.16;
      scale += (targetScale - scale) * 0.18;

      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.borderColor = targetColor;
      ringColor = targetColor;

      label.style.transform = `translate3d(${pos.rx}px, ${pos.ry + 34}px, 0) translate(-50%, 0)`;

      // particles canvas
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        p.vx *= 0.985;
        const alpha = 1 - p.life / p.maxLife;
        if (alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha + 0.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 74%, ${alpha * 0.9})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", sizeCanvas);

    return () => {
      document.body.classList.remove("custom-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, []);

  return (
    <>
      {/* particle canvas */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[95]" />
      {/* core dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[97] h-[7px] w-[7px] rounded-full opacity-0"
        style={{
          background: "radial-gradient(circle, #ffe9ad 0%, #f0b429 60%, rgba(240,180,41,0) 100%)",
          boxShadow: "0 0 12px 2px rgba(240,180,41,0.65)",
          transition: "opacity 0.3s",
        }}
      />
      {/* halo ring */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[96] h-[38px] w-[38px] rounded-full opacity-0"
        style={{
          border: "1.5px solid rgba(240,180,41,0.55)",
          boxShadow: "0 0 22px rgba(240,180,41,0.18), inset 0 0 12px rgba(240,180,41,0.12)",
          transition: "opacity 0.3s",
        }}
      />
      {/* cursor label */}
      <div
        ref={labelRef}
        aria-hidden
        className="font-mono2 pointer-events-none fixed left-0 top-0 z-[97] rounded-full border border-gold/40 bg-void/80 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold-2 opacity-0 backdrop-blur"
        style={{ transition: "opacity 0.25s" }}
      />
    </>
  );
}
