"use client";

import { useEffect, useRef, useState } from "react";
import { plugins } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Gold dust / sparkler particles drifting upward (brief §5.4).
 * Lazy-loaded after the doors open. Opacity follows the day→night progress and peaks at the closing.
 * Skipped with reduced motion; CSS fallback on low-memory devices or without WebGL.
 */

const VERT = /* glsl */ `
attribute vec2 seed;
attribute vec4 rnd; // size, speed, phase, twinkle speed
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
varying float vTw;
varying float vWarm;
void main() {
  float speed = mix(0.025, 0.085, rnd.y);
  float y = mod(seed.y + uTime * speed + 1.2, 2.4) - 1.2;
  float sway = sin(uTime * (0.25 + rnd.z * 0.4) + rnd.z * 6.2831) * 0.035
             + sin(uTime * 0.11 + seed.y * 3.0) * 0.02;
  vec2 p = vec2(seed.x + sway, y);
  gl_Position = vec4(p, 0.0, 1.0);
  float edge = smoothstep(1.2, 0.7, abs(y));
  vTw = (0.55 + 0.45 * sin(uTime * (1.2 + rnd.w * 2.6) + rnd.z * 40.0)) * edge;
  vWarm = rnd.x;
  gl_PointSize = mix(3.0, 13.0, rnd.x * rnd.x) * uDpr;
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying float vTw;
varying float vWarm;
void main() {
  float d = length(gl_PointCoord - 0.5);
  // bright core + soft halo, like a spark seen through warm air
  float spark = smoothstep(0.22, 0.0, d);
  float halo = smoothstep(0.5, 0.0, d);
  float a = spark * 0.9 + halo * halo * 0.6;
  // gold-light (#E6CF95) → jasmine (#FFFDF7) core
  vec3 gold = vec3(0.902, 0.812, 0.584);
  vec3 core = vec3(1.0, 0.992, 0.969);
  vec3 deep = vec3(0.722, 0.573, 0.290); // #B8924A
  vec3 col = mix(mix(deep, gold, halo), core, spark * 0.55 * vWarm);
  gl_FragColor = vec4(col, a * vTw * uOpacity);
}
`;

function canUseWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function GoldDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"off" | "gl" | "css">("off");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const next = (mem !== undefined && mem < 4) || !canUseWebGL() ? "css" : "gl";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability detection must run on the client
    setMode(next);
  }, []);

  useEffect(() => {
    if (mode !== "gl" || !canvasRef.current) return;
    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const { Renderer, Program, Geometry, Mesh } = await import("ogl");
      if (disposed || !canvasRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const renderer = new Renderer({ canvas: canvasRef.current, dpr, alpha: true, premultipliedAlpha: false, antialias: false });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const count = window.innerWidth < 700 ? 260 : 420;
      const seed = new Float32Array(count * 2);
      const rnd = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        seed[i * 2] = Math.random() * 2.2 - 1.1;
        seed[i * 2 + 1] = Math.random() * 2.4 - 1.2;
        rnd.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      }
      const geometry = new Geometry(gl, {
        seed: { size: 2, data: seed },
        rnd: { size: 4, data: rnd },
      });
      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uAspect: { value: 1 }, uDpr: { value: dpr } },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
        setMode("css"); // shader failed on this GPU: use the CSS dots instead
        return;
      }
      program.setBlendFunc(gl.SRC_ALPHA, gl.ONE); // additive
      const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        program.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);
      cleanups.push(() => window.removeEventListener("resize", resize));

      // Closing boost: strongest at the very end of the page.
      let closing = 0;
      const st = plugins.ScrollTrigger.create({
        trigger: "footer",
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: (self) => (closing = self.progress),
      });
      cleanups.push(() => st.kill());

      const host = document.querySelector<HTMLElement>("[data-invitation]");
      const start = performance.now();
      let opacity = 0;
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const night = parseFloat(host?.style.getPropertyValue("--nightfall") || "0") || 0;
        const target = Math.min(1, night * 0.55 + closing * 0.45);
        opacity += (target - opacity) * 0.08;
        if (opacity < 0.005 && target < 0.005) return; // nothing to draw: save the battery
        program.uniforms.uTime.value = (now - start) / 1000;
        program.uniforms.uOpacity.value = opacity;
        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(frame);
      cleanups.push(() => {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      });
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
    };
  }, [mode]);

  if (mode === "off") return null;
  if (mode === "css") {
    return (
      <div className="gold-dust-fallback pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${-(i * 1.7)}s`,
              animationDuration: `${14 + (i % 5) * 3}s`,
              width: i % 3 ? 3 : 4,
              height: i % 3 ? 3 : 4,
            }}
          />
        ))}
      </div>
    );
  }
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />;
}
