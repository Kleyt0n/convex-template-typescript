import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // State
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let mouseInside = false;
    let idleAngle = 0;
    let raf: number;
    let prevW = 0;
    let prevH = 0;

    // Trail ring buffer
    const TRAIL_LENGTH = 30;
    const trail: TrailPoint[] = [];
    let trailIndex = 0;
    let frameCount = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      if (w !== prevW || h !== prevH) {
        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        prevW = w;
        prevH = h;

        // Initialize glow to center if not yet placed
        if (glowX === 0 && glowY === 0) {
          glowX = w / 2;
          glowY = h / 2;
          mouseX = glowX;
          mouseY = glowY;
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      const rect = parent!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseInside = true;
    }

    function onMouseLeave() {
      mouseInside = false;
    }

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    function render() {
      resize();

      const w = prevW;
      const h = prevH;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(render);
        return;
      }

      // Idle drift target: slow orbit around center
      if (!mouseInside) {
        idleAngle += 0.005;
        mouseX = w / 2 + Math.cos(idleAngle) * w * 0.15;
        mouseY = h / 2 + Math.sin(idleAngle * 0.7) * h * 0.1;
      }

      // Lerp glow toward target
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      // Add trail point every 2 frames
      frameCount++;
      if (frameCount % 2 === 0) {
        if (trail.length < TRAIL_LENGTH) {
          trail.push({ x: glowX, y: glowY, alpha: 1 });
        } else {
          trail[trailIndex] = { x: glowX, y: glowY, alpha: 1 };
        }
        trailIndex = (trailIndex + 1) % TRAIL_LENGTH;
      }

      // Detect dark mode
      const isDark = document.documentElement.classList.contains("dark");

      // Clear
      ctx!.clearRect(0, 0, w, h);

      // Draw trail dots (oldest first)
      for (let i = 0; i < trail.length; i++) {
        // Read in ring-buffer order: oldest to newest
        const idx = (trailIndex + i) % trail.length;
        const point = trail[idx];
        const age = i / trail.length; // 0 = oldest, 1 = newest

        const radius = 3 + age * 5;
        const baseAlpha = age * (isDark ? 0.18 : 0.12);

        const color = isDark
          ? `rgba(148, 163, 184, ${baseAlpha})` // slate-400
          : `rgba(100, 116, 139, ${baseAlpha})`; // slate-500

        ctx!.beginPath();
        ctx!.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
      }

      // Draw main radial glow
      const glowRadius = 250;
      const gradient = ctx!.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        glowRadius
      );

      if (isDark) {
        gradient.addColorStop(0, "rgba(148, 163, 184, 0.22)"); // slate-400
        gradient.addColorStop(0.5, "rgba(148, 163, 184, 0.08)");
        gradient.addColorStop(1, "rgba(148, 163, 184, 0)");
      } else {
        gradient.addColorStop(0, "rgba(100, 116, 139, 0.15)"); // slate-500
        gradient.addColorStop(0.5, "rgba(100, 116, 139, 0.05)");
        gradient.addColorStop(1, "rgba(100, 116, 139, 0)");
      }

      ctx!.beginPath();
      ctx!.arc(glowX, glowY, glowRadius, 0, Math.PI * 2);
      ctx!.fillStyle = gradient;
      ctx!.fill();

      raf = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
