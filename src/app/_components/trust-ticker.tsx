"use client";

import { useId, useState, type ReactNode } from "react";

export function TrustTicker({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const trackId = useId();

  return (
    <div className="screen-two-ticker mt-3 flex flex-wrap items-center gap-3" data-paused={paused}>
      <div className="screen-two-ticker-window min-w-0 flex-1" aria-describedby="trust-placeholder-note">
        <div id={trackId} className="screen-two-ticker-track">
          {children}
        </div>
      </div>
      <button
        type="button"
        aria-controls={trackId}
        onClick={() => setPaused((value) => !value)}
        className="screen-two-ticker-toggle inline-flex min-h-11 w-36 shrink-0 items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transition-none"
      >
        {paused ? "Resume ticker" : "Pause ticker"}
      </button>
      <p className="screen-two-motion-note text-xs text-zinc-600">Ticker motion off: reduced-motion preference.</p>
    </div>
  );
}
