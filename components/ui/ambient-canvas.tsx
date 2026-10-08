"use client";

import { useEffect, useRef } from "react";

type Boid = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

type Pointer = {
  x: number;
  y: number;
  active: boolean;
};

const MAX_DPR = 1.5;
const BOID_COUNT = 46;
const TAU = Math.PI * 2;

function createBoids(width: number, height: number): Boid[] {
  return Array.from({ length: BOID_COUNT }, (_, index) => {
    const angle = (index / BOID_COUNT) * TAU;
    const speed = 0.25 + (index % 5) * 0.04;
    return {
      x: width * (0.18 + ((index * 0.137) % 0.64)),
      y: height * (0.12 + ((index * 0.191) % 0.72)),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1 + (index % 3) * 0.35,
    };
  });
}

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frame = 0;
    let active = true;
    let visible = true;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let boids = createBoids(width, height);
    let previousTime = performance.now();
    let palette = { primary: "#a78bfa", secondary: "#56ccf2" };
    const pointer: Pointer = { x: width / 2, y: height / 2, active: false };

    const updatePalette = () => {
      const theme = document.querySelector("main")?.getAttribute("data-theme");
      palette = theme === "light"
        ? { primary: "#6941c6", secondary: "#147fa3" }
        : { primary: "#a78bfa", secondary: "#56ccf2" };
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      boids = createBoids(width, height);
    };

    const draw = (time: number) => {
      const elapsed = Math.min(time - previousTime, 32);
      previousTime = time;

      if (active && visible) {
        context.clearRect(0, 0, width, height);
        const step = reducedMotion ? 0 : elapsed;
        const neighborRadius = Math.min(150, width * 0.16);

        boids.forEach((boid, index) => {
          let alignmentX = 0;
          let alignmentY = 0;
          let cohesionX = 0;
          let cohesionY = 0;
          let separationX = 0;
          let separationY = 0;
          let neighbors = 0;

          boids.forEach((neighbor, neighborIndex) => {
            if (index === neighborIndex) return;
            const dx = neighbor.x - boid.x;
            const dy = neighbor.y - boid.y;
            const distance = Math.hypot(dx, dy);
            if (distance > neighborRadius || distance === 0) return;
            alignmentX += neighbor.vx;
            alignmentY += neighbor.vy;
            cohesionX += neighbor.x;
            cohesionY += neighbor.y;
            if (distance < 34) {
              separationX -= dx / distance;
              separationY -= dy / distance;
            }
            neighbors += 1;
          });

          if (neighbors > 0) {
            alignmentX = alignmentX / neighbors - boid.vx;
            alignmentY = alignmentY / neighbors - boid.vy;
            cohesionX = (cohesionX / neighbors - boid.x) * 0.0007;
            cohesionY = (cohesionY / neighbors - boid.y) * 0.0007;
          }

          let cursorX = 0;
          let cursorY = 0;
          if (pointer.active) {
            const dx = pointer.x - boid.x;
            const dy = pointer.y - boid.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 260 && distance > 0) {
              const force = (1 - distance / 260) * 0.045;
              cursorX = (dx / distance) * force;
              cursorY = (dy / distance) * force;
            }
          }

          boid.vx += (alignmentX * 0.008 + cohesionX + separationX * 0.012 + cursorX) * step;
          boid.vy += (alignmentY * 0.008 + cohesionY + separationY * 0.012 + cursorY) * step;
          const speed = Math.hypot(boid.vx, boid.vy);
          const maxSpeed = 0.48;
          if (speed > maxSpeed) {
            boid.vx = (boid.vx / speed) * maxSpeed;
            boid.vy = (boid.vy / speed) * maxSpeed;
          }
          boid.x = (boid.x + boid.vx * step + width) % width;
          boid.y = (boid.y + boid.vy * step + height) % height;

          const angle = Math.atan2(boid.vy, boid.vx);
          const trail = 7 + speed * 20;
          context.beginPath();
          context.moveTo(boid.x - Math.cos(angle) * trail, boid.y - Math.sin(angle) * trail);
          context.lineTo(boid.x, boid.y);
          context.strokeStyle = index % 5 === 0 ? palette.secondary : palette.primary;
          context.globalAlpha = pointer.active ? 0.18 : 0.11;
          context.lineWidth = boid.size;
          context.stroke();
          context.fillStyle = context.strokeStyle;
          context.globalAlpha = pointer.active ? 0.34 : 0.2;
          context.fillRect(boid.x, boid.y, boid.size, boid.size);
        });
        context.globalAlpha = 1;
      }

      frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };
    const onVisibility = () => { active = document.visibilityState === "visible"; };
    const onMotionPreference = (event: MediaQueryListEvent) => { reducedMotion = event.matches; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    const main = document.querySelector("main");
    const themeObserver = new MutationObserver(updatePalette);

    resize();
    updatePalette();
    observer.observe(canvas);
    if (main) themeObserver.observe(main, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", onMotionPreference);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.matchMedia("(prefers-reduced-motion: reduce)").removeEventListener("change", onMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-canvas" />;
}
