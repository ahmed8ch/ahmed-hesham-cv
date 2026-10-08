"use client";

import { useEffect, useRef } from "react";

type ChromaFlowProps = {
  intensity?: number;
  radius?: number;
};

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_intensity;
  uniform float u_radius;
  uniform vec3 u_colors[3];

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 centered = (uv - 0.5) * aspect;
    vec2 pointer = (u_pointer - 0.5) * aspect;
    float time = u_time * 0.08;
    float radius = max(0.6, u_radius);
    vec3 color = vec3(0.0);

    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float angle = fi * 2.094 + time * (0.55 + fi * 0.08);
      vec2 orbit = vec2(cos(angle), sin(angle) * 0.72) * (0.23 + fi * 0.035);
      vec2 flow = vec2(
        noise(centered * 2.0 + vec2(time + fi, -time)),
        noise(centered * 2.0 + vec2(-time, time + fi))
      ) - 0.5;
      vec2 source = orbit + flow * 0.22;
      source += (pointer - source) * 0.3;
      float distanceToSource = length(centered - source);
      float ink = smoothstep(0.72 * radius, 0.0, distanceToSource);
      ink *= 0.62 + noise(centered * 3.0 + time + fi) * 0.38;
      color += u_colors[i] * ink;
    }

    float cursorInk = smoothstep(0.7 * radius, 0.0, length(centered - pointer));
    color += mix(u_colors[1], u_colors[2], 0.45) * cursorInk * 0.3;
    color *= u_intensity;
    gl_FragColor = vec4(color, min(0.78, max(color.r, max(color.g, color.b))));
  }
`;

const palettes = {
  dark: [[0.48, 0.23, 0.92], [0.02, 0.58, 0.9], [0.96, 0.2, 0.42]],
  light: [[0.42, 0.16, 0.78], [0.0, 0.4, 0.72], [0.82, 0.08, 0.22]],
} as const;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("ChromaFlow shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ChromaFlow({ intensity = 1, radius = 3 }: ChromaFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: false });
    if (!canvas || !gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("ChromaFlow program error:", gl.getProgramInfoLog(program));
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const time = gl.getUniformLocation(program, "u_time");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");
    const radiusLocation = gl.getUniformLocation(program, "u_radius");
    const colors = [0, 1, 2].map((index) => gl.getUniformLocation(program, `u_colors[${index}]`));
    const pointer = { x: 0.5, y: 0.5 };
    let frame = 0;
    let active = true;
    let visible = true;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const draw = (now: number) => {
      if (active && visible) {
        const theme = document.querySelector("main")?.getAttribute("data-theme") === "light" ? palettes.light : palettes.dark;
        gl.useProgram(program);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform2f(pointerLocation, pointer.x, pointer.y);
        gl.uniform1f(time, reducedMotion ? 0 : now / 1000);
        gl.uniform1f(intensityLocation, intensity);
        gl.uniform1f(radiusLocation, radius);
        colors.forEach((location, index) => {
          if (location) gl.uniform3fv(location, theme[index]);
        });
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      frame = requestAnimationFrame(draw);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = 1 - event.clientY / window.innerHeight;
    };
    const onVisibility = () => { active = document.visibilityState === "visible"; };
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", (event) => { reducedMotion = event.matches; });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [intensity, radius]);

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-canvas" />;
}

export function AmbientCanvas() {
  return <ChromaFlow intensity={1} radius={3} />;
}
