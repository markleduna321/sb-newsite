"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Placeholder anchors: point these at real routes/sections as they are built.
const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#about", label: "About" },
  { href: "#careers", label: "Careers" },
] as const;

const SOLID_AFTER_PX = 24;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  // Always fixed in place. At the top it is a solid white band above the hero (the hero
  // reserves --nav-h for it, so the video is never covered); once scrolled it turns frosted.
  return (
    <header
      data-solid={solid}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out motion-reduce:transition-none ${
        solid
          ? "border-slate-200 bg-white/85 shadow-[0_8px_30px_rgb(15_23_42/0.18)] backdrop-blur-lg"
          : "border-slate-200 bg-white shadow-none backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex h-(--nav-h) w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link href="/" className={`rounded text-lg font-semibold tracking-[-0.04em] text-slate-900 ${focusRing}`}>
          skybridge
        </Link>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-7 rounded-full border border-slate-200 bg-slate-50/80 px-6 py-2 backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded text-sm font-medium text-slate-600 hover:text-slate-900 ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#contact"
            className={`hidden min-h-10 items-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-blue-700 sm:inline-flex short:min-h-8 ${focusRing}`}
          >
            Contact us
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-lg text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 md:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
        className="border-t border-slate-200 md:hidden"
      >
        <ul className="mx-auto flex w-full max-w-7xl flex-col px-5 py-3 sm:px-8">
          {[...NAV_LINKS, { href: "#contact", label: "Contact us" }].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-lg px-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}