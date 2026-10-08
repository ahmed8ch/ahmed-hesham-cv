"use client";

import { useEffect, useRef } from "react";

type ThemePalette = {
  base: string;
  colors: readonly [string, string, string];
};

type Pointer = {
  x: number;
  y: number;
  active: boolean;
};

const MAX_DPR = 1.25;
const MAX_RENDER_WIDTH = 360;
const PALETTES: Record<"dark" | "light", ThemePalette> = {
  dark: { base: "#131316", colors: ["#7c3aed", "#0ea5e9", "#f43f5e"] },
  light: { base: "#f9fafb", colors: ["#7c3aed", "#0284c7", "#e11d48"] },
};

type ChromaFlowProps = {
  intensity?: number;
  radius?: number;
};

export function ChromaFlow({ intensity = 1, radius = 3 }: ChromaFlowProps) {
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
    let renderWidth = 320;
    let renderHeight = 180;
    let palette = PALETTES.dark;
    const pointer: Pointer = { x: width / 2, y: height / 2, active: false };

    const updatePalette = () => {
      const theme = document.querySelector("main")?.getAttribute("data-theme");
      palette = theme === "light" ? PALETTES.light : PALETTES.dark;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderWidth = Math.min(MAX_RENDER_WIDTH, Math.max(180, Math.round(width / 3)));
      renderHeight = Math.max(120, Math.round(renderWidth * height / width));
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const paintFlow = (time: number) => {
      const seconds = time / 1000;
      const motion = reducedMotion ? 0 : seconds;
      const cursorX = pointer.active ? pointer.x / width : 0.5;
      const cursorY = pointer.active ? pointer.y / height : 0.45;
      const scaleX = width / renderWidth;
      const scaleY = height / renderHeight;

      context.save();
      context.scale(scaleX, scaleY);
      context.globalCompositeOperation = "source-over";
      context.fillStyle = palette.base;
      context.fillRect(0, 0, renderWidth, renderHeight);
      context.globalCompositeOperation = "screen";

      palette.colors.forEach((color, index) => {
        const phase = index * 2.1;
        const orbitX = 0.5 + Math.sin(motion * (0.18 + index * 0.04) + phase) * 0.36;
        const orbitY = 0.5 + Math.cos(motion * (0.22 + index * 0.03) + phase) * 0.38;
        const waveX = Math.sin(motion * 0.34 + phase) * 0.2;
        const waveY = Math.cos(motion * 0.29 + phase) * 0.2;
        const x = (orbitX + waveX * (1 - cursorX)) * renderWidth;
        const y = (orbitY + waveY * (1 - cursorY)) * renderHeight;
        const influence = pointer.active
          ? Math.max(0, 1 - Math.hypot(orbitX - cursorX, orbitY - cursorY) * 1.5)
          : 0;
        const blobRadius = renderWidth * (0.5 + influence * 0.35) * (radius / 3);
        const gradient = context.createRadialGradient(x, y, 0, x, y, blobRadius);
        gradient.addColorStop(0, `${color}f2`);
        gradient.addColorStop(0.28, `${color}b8`);
        gradient.addColorStop(0.72, `${color}38`);
        gradient.addColorStop(1, `${color}00`);
        context.fillStyle = gradient;
        context.beginPath();
        context.globalAlpha = Math.min(1, 1.35 * intensity);
        context.ellipse(x, y, blobRadius, blobRadius * (0.55 + index * 0.08), phase + motion * 0.05, 0, Math.PI * 2);
        context.fill();
      });

      if (pointer.active) {
        const cursorGradient = context.createRadialGradient(
          cursorX * renderWidth,
          cursorY * renderHeight,
          0,
          cursorX * renderWidth,
          cursorY * renderHeight,
          renderWidth * 0.42 * (radius / 3),
        );
        cursorGradient.addColorStop(0, `${palette.colors[1]}d9`);
        cursorGradient.addColorStop(0.35, `${palette.colors[0]}66`);
        cursorGradient.addColorStop(1, `${palette.colors[2]}00`);
        context.globalCompositeOperation = "source-over";
        context.globalAlpha = 0.95;
        context.fillStyle = cursorGradient;
        context.beginPath();
        context.arc(cursorX * renderWidth, cursorY * renderHeight, renderWidth * 0.42 * (radius / 3), 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "overlay";
      context.globalAlpha = 0.2;
      for (let line = 0; line < 12; line += 1) {
        const y = (line / 12) * renderHeight;
        context.fillStyle = palette.colors[line % palette.colors.length];
        context.fillRect(0, y + Math.sin(motion * 0.3 + line) * 4, renderWidth, 1);
      }
      context.restore();
      context.globalAlpha = 1;
    };

    const draw = (time: number) => {
      if (active && visible) paintFlow(time);
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
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    resize();
    updatePalette();
    observer.observe(canvas);
    if (main) themeObserver.observe(main, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionPreference);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-canvas" />;
}

export function AmbientCanvas() {
  return <ChromaFlow intensity={1} radius={3} />;
}
