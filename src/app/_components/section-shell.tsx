import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

// One "screen view": fills the viewport below the fixed nav on desktop, flows naturally on mobile.
export function SectionShell({ id, labelledBy, children, className = "" }: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`flex flex-col justify-center py-14 sm:py-16 lg:min-h-[calc(100svh-var(--nav-h))] lg:py-[4svh] ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-400" />
      {children}
    </p>
  );
}
