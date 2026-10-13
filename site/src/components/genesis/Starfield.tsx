"use client";

/* Starfield — parallax canvas: 3 depth layers of drifting, twinkling stars
   + occasional shooting stars + subtle mouse parallax. Fixed behind all. */

import { useEffect, useRef } from "react";

interface Star {
  x: number; y: number; z: number; r: number;
  baseAlpha: number; phase: number; speed: number; hue: number;
}
interface Meteor {
  x: number; y: number; vx: number; vy: number; life: number; maxLife: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let raf = 0;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let t = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const density = Math.min(Math.floor((w * h) / 5200), 340);
      stars = Array.from({ length: density }, () => {
        const z = Math.random(); // depth 0 (far) → 1 (near)
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.4 + z * 1.5 + (Math.random() < 0.04 ? 1.4 : 0),
          baseAlpha: 0.25 + z * 0.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.2,
          hue: Math.random() < 0.12 ? 46 : Math.random() < 0.5 ? 265 : 215,
        };
      });
    };

    const spawnMeteor = () => {
      const fromX = w * (0.3 + Math.random() * 0.7);
      meteors.push({
        x: fromX,
        y: -20,
        vx: -(3.2 + Math.random() * 2.4),
        vy: 2.4 + Math.random() * 1.6,
        life: 0,
        maxLife: 90 + Math.random() * 40,
      });
    };

    const draw = () => {
      t += 0.016;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      ctx.clearRect(0, 0, w, h);

      const px = (mouse.x - 0.5);
      const py = (mouse.y - 0.5);

      for (const s of stars) {
        const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const alpha = s.baseAlpha * tw;
        const drift = reduced ? 0 : Math.sin(t * 0.05 + s.phase) * 6 * s.z;
        const x = s.x + px * 34 * s.z + drift;
        const y = s.y + py * 22 * s.z;

        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 85%, ${78 + s.z * 12}%, ${alpha})`;
        ctx.fill();

        // glow for the near big stars
        if (s.r > 1.6) {
          ctx.beginPath();
          ctx.arc(x, y, s.r * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 90%, 70%, ${alpha * 0.12})`;
          ctx.fill();
        }
      }

      if (!reduced) {
        if (Math.random() < 0.0035 && meteors.length < 2) spawnMeteor();
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life++;
          m.x += m.vx;
          m.y += m.vy;
          const p = m.life / m.maxLife;
          const alpha = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
          const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
          grad.addColorStop(0, `rgba(255, 226, 150, ${0.85 * alpha})`);
          grad.addColorStop(1, "rgba(255,226,150,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14);
          ctx.stroke();
          if (m.life > m.maxLife || m.x < -160 || m.y > h + 160) meteors.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "transparent" }}
    />
  );
}
