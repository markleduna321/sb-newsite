"use client";

import { useEffect, useRef, type ReactNode } from "react";

const EASE = 0.08;
const POINTER_PARALLAX = "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/**
 * Tracks the mouse over the hero and exposes a smoothed position as `--px` / `--py`
 * (-1 to 1) so the layers inside can shift by different amounts for a 2.5D depth effect.
 */
export function HeroStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const query = window.matchMedia(POINTER_PARALLAX);
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      el.style.setProperty("--px", current.x.toFixed(4));
      el.style.setProperty("--py", current.y.toFixed(4));
      const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !query.matches) return;
      const rect = el.getBoundingClientRect();
      target.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1);
      target.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1);
      start();
    };
    const reset = () => {
      target.x = 0;
      target.y = 0;
      start();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    query.addEventListener("change", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      query.removeEventListener("change", reset);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} data-hero-stage="" className={className}>
      {children}
    </div>
  );
}
