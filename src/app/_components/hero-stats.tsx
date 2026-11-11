"use client";

import { useEffect, useRef } from "react";

type HeroStat = { icon: string; value: string; label: string; position: string };

const POINTER_PARALLAX = "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";
// Extra reach beyond the pill's own size at which it starts moving away.
const DODGE_RADIUS = 140;
const DODGE_MAX = 180;
const PARALLAX_PX = 14;
const SPRING = 0.14;
const EDGE = 16;
const NAV_CLEARANCE = 16;

export function HeroStats({ stats }: { stats: readonly HeroStat[] }) {
  const anchorRefs = useRef<(HTMLLIElement | null)[]>([]);
  const moverRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage = anchorRefs.current[0]?.closest<HTMLElement>("[data-hero-stage]");
    if (!stage) return;

    const query = window.matchMedia(POINTER_PARALLAX);
    const offsets = stats.map(() => ({ x: 0, y: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    const targetFor = (anchor: HTMLLIElement, bounds: DOMRect) => {
      if (!pointer) return { x: 0, y: 0 };
      // The anchor isn't transformed, so its rect is the pill's resting position.
      const rect = anchor.getBoundingClientRect();
      const nx = ((pointer.x - bounds.left) / bounds.width) * 2 - 1;
      const ny = ((pointer.y - bounds.top) / bounds.height) * 2 - 1;
      let x = nx * PARALLAX_PX;
      let y = ny * PARALLAX_PX;

      const dx = rect.left + rect.width / 2 - pointer.x;
      const dy = rect.top + rect.height / 2 - pointer.y;
      const distance = Math.hypot(dx, dy);
      const reach = DODGE_RADIUS + Math.max(rect.width, rect.height) / 2;
      if (distance < reach) {
        const push = (1 - distance / reach) ** 1.4 * DODGE_MAX;
        const ux = distance > 1 ? dx / distance : 0;
        const uy = distance > 1 ? dy / distance : -1;
        x += ux * push;
        y += uy * push;
      }

      const minX = bounds.left + EDGE - rect.left;
      const maxX = bounds.right - EDGE - rect.right;
      const minY = bounds.top + NAV_CLEARANCE - rect.top;
      const maxY = bounds.bottom - EDGE - rect.bottom;
      const clampedX = Math.max(minX, Math.min(maxX, x));
      // When pinned against a side, escape vertically instead of staying under the cursor.
      const lost = Math.abs(x - clampedX);
      if (lost > 0) y += (dy >= 0 ? 1 : -1) * lost;
      return { x: clampedX, y: Math.max(minY, Math.min(maxY, y)) };
    };

    const tick = () => {
      const bounds = stage.getBoundingClientRect();
      let settled = true;
      anchorRefs.current.forEach((anchor, i) => {
        const mover = moverRefs.current[i];
        if (!anchor || !mover) return;
        const target = targetFor(anchor, bounds);
        const offset = offsets[i];
        offset.x += (target.x - offset.x) * SPRING;
        offset.y += (target.y - offset.y) * SPRING;
        if (Math.abs(target.x - offset.x) > 0.1 || Math.abs(target.y - offset.y) > 0.1) settled = false;
        mover.style.transform = `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`;
      });
      frame = settled && !pointer ? 0 : requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !query.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      start();
    };
    const reset = () => {
      pointer = null;
      start();
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", reset);
    query.addEventListener("change", reset);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", reset);
      query.removeEventListener("change", reset);
      cancelAnimationFrame(frame);
    };
  }, [stats]);

  return (
    <ul aria-label="Skybridge at a glance" className="hidden lg:block short:hidden">
      {stats.map((stat, i) => (
        <li
          key={stat.label}
          ref={(node) => {
            anchorRefs.current[i] = node;
          }}
          className={`pointer-events-none absolute ${stat.position}`}
        >
          <div
            ref={(node) => {
              moverRefs.current[i] = node;
            }}
            className="will-change-transform"
          >
            <div
              className="flex animate-float items-center gap-3 rounded-2xl border border-blue-400/25 bg-[#0F2356]/65 px-5 py-4 shadow-lg backdrop-blur-md motion-reduce:animate-none"
              style={{ animationDelay: `${i * -3}s` }}
            >
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl border border-amber-400/30 bg-amber-400/15 text-lg text-amber-400">
                {stat.icon}
              </span>
              <span className="flex flex-col">
                <span className="text-xl font-semibold leading-6 tracking-[-0.02em] text-white">{stat.value}</span>
                <span className="text-sm text-white/75">{stat.label}</span>
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
