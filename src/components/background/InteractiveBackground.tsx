// src/components/background/InteractiveBackground.tsx
// "Jardín de luz de Matthew" — fondo canvas interactivo (p5js: flow/twinkle/
// repulsion/click-spawn, scroll-driven). Canvas 2D puro: 0 dependencias, 60fps.
// Capas: orbes bokeh lentos + polvo de estrellas + corazones con repulsión
// al cursor + explosiones al clic. Pausa en tab oculta, respeta reduced-motion.
"use client";

import { useEffect, useRef } from "react";

const PALETTE = ["#F0ABFC", "#FCD34D", "#7DD3FC", "#FDA4AF", "#6EE7B7", "#F9A8D4"];

interface Orb { x: number; y: number; r: number; c: string; sp: number; ph: number; amp: number }
interface Dust { x: number; y: number; px: number; py: number; s: number; sp: number; ph: number; c: string }
interface HeartP { x: number; y: number; vx: number; vy: number; s: number; c: string; sway: number; ph: number; rot: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; decay: number; s: number; c: string }

function drawHeart(ctx: CanvasRenderingContext2D, s: number) {
  // Corazón centrado de tamaño s (ancho aprox 2s)
  ctx.beginPath();
  ctx.moveTo(0, s * 0.55);
  ctx.bezierCurveTo(-s * 1.1, -s * 0.25, -s * 0.55, -s * 1.05, 0, -s * 0.35);
  ctx.bezierCurveTo(s * 0.55, -s * 1.05, s * 1.1, -s * 0.25, 0, s * 0.55);
  ctx.closePath();
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, raf = 0, running = true;

    const mouse = { x: -9999, y: -9999, active: false };
    let scrollMul = 1;

    let orbs: Orb[] = [];
    let dust: Dust[] = [];
    let hearts: HeartP[] = [];
    let sparks: Spark[] = [];

    const R = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = () => PALETTE[(Math.random() * PALETTE.length) | 0];

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.floor(W * DPR);
      canvas!.height = Math.floor(H * DPR);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    }

    function seed() {
      const areaF = Math.min(Math.max((W * H) / (1440 * 900), 0.5), 1.3);
      const mobileF = W < 640 ? 0.55 : 1;
      const nOrb = Math.round(11 * areaF);
      const nDust = Math.round(60 * areaF * mobileF);
      const nHeart = Math.round(13 * areaF * mobileF);
      orbs = Array.from({ length: nOrb }, () => ({
        x: R(0, W), y: R(0, H), r: R(90, 220) * areaF,
        c: pick(), sp: R(0.06, 0.16), ph: R(0, 6.28), amp: R(20, 60),
      }));
      dust = Array.from({ length: nDust }, () => ({
        x: R(0, W), y: R(0, H), px: 0, py: 0, s: R(1, 2.6),
        sp: R(0.12, 0.4), ph: R(0, 6.28), c: pick(),
      }));
      dust.forEach((d) => { d.px = d.x; d.py = d.y; });
      hearts = Array.from({ length: nHeart }, () => ({
        x: R(0, W), y: R(0, H), vx: 0, vy: 0, s: R(7, 15),
        c: pick(), sway: R(0.4, 1.1), ph: R(0, 6.28), rot: R(-0.2, 0.2),
      }));
      sparks = [];
    }

    function burst(x: number, y: number) {
      for (let i = 0; i < 12; i++) {
        const a = R(0, 6.283);
        const v = R(1.5, 4.5);
        sparks.push({
          x, y,
          vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1,
          life: 1, decay: R(0.012, 0.028), s: R(2, 4.5), c: pick(),
        });
      }
      if (sparks.length > 220) sparks.splice(0, sparks.length - 220);
    }

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) { mouse.x = t.clientX; mouse.y = t.clientY; mouse.active = true; }
    };
    const onLeave = () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; };
    const onClick = (e: MouseEvent) => {
      // Explosión solo si el clic fue sobre el fondo (no botones/links)
      if (!(e.target as HTMLElement).closest("button,a")) burst(e.clientX, e.clientY);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      scrollMul = 1 + Math.min(Math.max(p, 0), 1) * 1.6;
    };
    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running && !reduced) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    };

    let last = performance.now();

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min((now - last) / 16.67, 3); // normalizado a 60fps
      last = now;
      const t = now / 1000;

      ctx!.clearRect(0, 0, W, H);

      // --- Capa 1: orbes bokeh (deriva sinusoidal lenta) ---
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        o.x += Math.cos(t * o.sp + o.ph) * 0.25 * dt * scrollMul;
        o.y += Math.sin(t * o.sp * 0.8 + o.ph) * 0.2 * dt * scrollMul;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const g = ctx!.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.c + "55");
        g.addColorStop(1, o.c + "00");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(o.x, o.y, o.r, 0, 6.283);
        ctx!.fill();
      }

      // --- Capa 2: polvo de estrellas (twinkle + subida + estela) ---
      ctx!.lineWidth = 1.4;
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.px = d.x; d.py = d.y;
        d.y -= d.sp * dt * scrollMul;
        d.x += Math.sin(t * 0.7 + d.ph) * 0.2 * dt;
        if (d.y < -8) { d.y = H + 8; d.x = Math.random() * W; d.px = d.x; d.py = d.y; }
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2 + d.ph));
        ctx!.strokeStyle = d.c;
        ctx!.globalAlpha = tw * 0.85; // stroke alpha alto: la estela sí se ve
        ctx!.beginPath();
        ctx!.moveTo(d.px, d.py);
        ctx!.lineTo(d.x, d.y - 6);
        ctx!.stroke();
        ctx!.globalAlpha = tw;
        ctx!.fillStyle = d.c;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.s, 0, 6.283);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // --- Capa 3: corazones (sway + repulsión cursor con retorno spring) ---
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.x += Math.sin(t * h.sway + h.ph) * 0.35 * dt * scrollMul;
        h.y -= 0.28 * dt * scrollMul;
        // Repulsión al cursor (radio 140)
        if (mouse.active) {
          const dx = h.x - mouse.x, dy = h.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 19600 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = ((140 - d) / 140) * 2.4;
            h.vx += (dx / d) * f * dt;
            h.vy += (dy / d) * f * dt;
          }
        }
        // Spring de retorno + fricción
        h.vx *= 0.94; h.vy *= 0.94;
        h.x += h.vx * dt; h.y += h.vy * dt;
        if (h.y < -30) { h.y = H + 30; h.x = Math.random() * W; h.vx = 0; h.vy = 0; }
        if (h.x < -30) h.x = W + 30; if (h.x > W + 30) h.x = -30;
        ctx!.save();
        ctx!.translate(h.x, h.y);
        ctx!.rotate(h.rot + Math.sin(t * 0.8 + h.ph) * 0.15);
        ctx!.globalAlpha = 0.5;
        ctx!.fillStyle = h.c;
        drawHeart(ctx!, h.s);
        ctx!.fill();
        ctx!.restore();
      }
      ctx!.globalAlpha = 1;

      // --- Capa 4: chispas de clic (física: fricción + gravedad + fade) ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.97; s.vy = s.vy * 0.97 + 0.06 * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        s.life -= s.decay * dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx!.globalAlpha = s.life;
        ctx!.fillStyle = s.c;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.s * s.life + 0.5, 0, 6.283);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    }

    resize();
    onScroll();
    if (reduced) {
      // Un frame estático: fondo bonito sin movimiento
      last = performance.now();
      running = true;
      frame(last);
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
