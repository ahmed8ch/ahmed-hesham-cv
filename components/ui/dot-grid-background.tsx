"use client";

import { PointerEvent, ReactNode, useEffect, useRef } from "react";

type DotGridBackgroundProps = {
  children: ReactNode;
  cols?: number;
  dotSize?: number;
  dotSpacing?: number;
  dotColor?: string;
  backgroundColor?: string;
  scaleFactor?: number;
  inertiaDamping?: number;
  inertia?: boolean;
};

type Point = { x: number; y: number };

export default function DotGridBackground({
  children,
  cols = 24,
  dotSize = 5,
  dotSpacing = 4,
  dotColor = "#a78bfa",
  backgroundColor = "#131316",
  scaleFactor = 6,
  inertiaDamping = 0.92,
  inertia: useInertia = true,
}: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<Point>({ x: 0, y: 0 });
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const dragRef = useRef<{ origin: Point; last: Point; active: boolean }>({
    origin: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !viewport || !context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let deviceRatio = 1;
    const cell = dotSize * dotSpacing;
    const radius = dotSize / 2;

    const resize = () => {
      const bounds = viewport.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      deviceRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * deviceRatio);
      canvas.height = Math.round(height * deviceRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);

      if (!dragRef.current.active && useInertia) {
        offsetRef.current.x += velocityRef.current.x;
        offsetRef.current.y += velocityRef.current.y;
        velocityRef.current.x *= inertiaDamping;
        velocityRef.current.y *= inertiaDamping;
      }

      const spacing = cell;
      const columns = Math.max(cols, Math.ceil(width / spacing) + 8);
      const rows = Math.ceil(height / (spacing * 0.866)) + 8;
      const centerX = width / 2;
      const centerY = height / 2;
      const offsetX = ((offsetRef.current.x % spacing) + spacing) % spacing - spacing * 4;
      const offsetY = ((offsetRef.current.y % spacing) + spacing) % spacing - spacing * 4;
      const xStart = centerX - (columns * spacing) / 2 + offsetX;
      const yStart = centerY - (rows * spacing * 0.866) / 2 + offsetY;

      context.fillStyle = dotColor;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = xStart + column * spacing + (row % 2 ? spacing / 2 : 0);
          const y = yStart + row * spacing * 0.866;
          const distance = Math.hypot((x - centerX) / width, (y - centerY) / height);
          const scale = Math.max(0.18, 1 - Math.pow(Math.min(distance * 2.2, 1), scaleFactor));
          const dotRadius = Math.max(0.7, radius * scale);
          context.globalAlpha = 0.18 + scale * 0.58;
          context.beginPath();
          context.arc(x, y, dotRadius, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (!dragRef.current.active) return;
      const last = dragRef.current.last;
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      offsetRef.current.x += dx;
      offsetRef.current.y += dy;
      velocityRef.current = { x: dx, y: dy };
      dragRef.current.last = { x: event.clientX, y: event.clientY };
    };
    const endDrag = () => {
      dragRef.current.active = false;
      viewport.style.cursor = "grab";
    };
    const startDrag = (event: globalThis.PointerEvent) => {
      dragRef.current = {
        origin: { x: event.clientX, y: event.clientY },
        last: { x: event.clientX, y: event.clientY },
        active: true,
      };
      viewport.style.cursor = "grabbing";
    };
    const observer = new ResizeObserver(resize);

    resize();
    observer.observe(viewport);
    viewport.addEventListener("pointerdown", startDrag);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", endDrag);
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("pointerdown", startDrag);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
    };
  }, [backgroundColor, cols, dotColor, dotSize, dotSpacing, inertiaDamping, scaleFactor, useInertia]);

  return (
    <div ref={viewportRef} className="dot-grid-viewport">
      <canvas ref={canvasRef} aria-hidden="true" className="dot-grid-canvas" />
      <div className="dot-grid-content">{children}</div>
    </div>
  );
}
