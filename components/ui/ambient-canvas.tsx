"use client";

import { useEffect, useRef } from "react";

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let active = true;
    let visible = true;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      context.scale(ratio, ratio);
    };
    const draw = () => {
      if (active && visible) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const image = context.createImageData(width, height);
        for (let index = 0; index < image.data.length; index += 4) {
          const value = Math.random() > 0.5 ? 255 : 0;
          image.data[index] = value;
          image.data[index + 1] = value;
          image.data[index + 2] = value;
          image.data[index + 3] = 5;
        }
        context.putImageData(image, 0, 0);
      }
      frame = window.requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);
    const onVisibility = () => {
      active = document.visibilityState === "visible";
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-canvas" />;
}
