import Link from "next/link";
import { AboutAndServices } from "./_components/about-and-services";
import { FaqAndContact } from "./_components/faq-and-contact";
import { HeroStage } from "./_components/hero-stage";
import { HeroStats } from "./_components/hero-stats";
import { HeroVideo } from "./_components/hero-video";
import { HowItWorks } from "./_components/how-it-works";
import { SiteNav } from "./_components/site-nav";
import { TrustAndChallenges } from "./_components/trust-and-challenges";

// Placeholder claims: confirm each certification is actually held before launch.
const CERTIFICATIONS = ["ISO/IEC 27001", "SOC 2 Type II", "HIPAA", "PCI DSS"] as const;

// Placeholder figures: replace with verified numbers before launch.
const HERO_STATS = [
  { icon: "★", value: "4.9/5", label: "Client rating", position: "right-[70px] top-[calc(22%-40px)] xl:right-[86px]" },
  { icon: "↻", value: "98%", label: "Retention rate", position: "bottom-[14%] right-[calc(24%+30px)]" },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNav />
      <section
        aria-labelledby="welcome-heading"
        className="flex min-h-[calc(100svh-var(--hero-peek))] w-full flex-col pt-[calc(var(--nav-h)+1px)]"
      >
        <HeroStage className="relative isolate flex w-full flex-1 flex-col overflow-hidden bg-[#060b19] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_right,var(--color-blue-950)_0%,#060b19_65%)]"
        >
          <HeroVideo />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-[#060b19] via-[#060b19]/85 to-[#060b19]/65 md:bg-linear-to-r md:from-[#060b19] md:via-[#060b19]/80 md:to-transparent"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-[2svh] pt-[2svh] sm:px-8 lg:px-10 short:pt-[1svh]">
          <div className="flex w-full max-w-2xl flex-col items-start text-left [translate:calc(var(--px,0)*6px)_calc(var(--py,0)*4px)] lg:w-[45%] lg:max-w-none xl:w-[48%] xl:max-w-2xl">
            <p className="mb-[2.5svh] flex items-center gap-3 short:hidden text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm">
              <span aria-hidden="true" className="size-2 rounded-full bg-amber-400 shadow-[0_0_0_4px_var(--color-amber-400)/20]" />
              <span className="bg-linear-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                Your ambition. Our people.
              </span>
            </p>
            <h1
              id="welcome-heading"
              className="text-[clamp(2rem,min(9vw,9svh),5rem)] font-semibold lg:text-[clamp(2.5rem,min(5vw,8.5svh),4.25rem)] leading-[0.98] tracking-[-0.055em]"
            >
              People-powered.
              <br />
              <span className="inline-block bg-linear-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                Business-
                <wbr />
                <span className="relative">
                  forward.
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-amber-400 sm:h-1.5"
                  />
                </span>
              </span>
            </h1>
            <p className="mt-[3svh] text-lg font-medium text-white sm:text-xl short:hidden">
              Intelligence in every connection.
            </p>
            <p className="mt-2 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8 compact:hidden">
              Behind every great business is a great team. We bring the people,
              expertise, and care to help yours go further.
            </p>
            <div className="mt-[3.5svh] flex flex-wrap items-center gap-3">
              <Link
                href="#about"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-950 transition-shadow duration-300 hover:bg-amber-50 hover:shadow-[0_0_24px_var(--color-amber-400)/25] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
              >
                Build your team
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                  <path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="#about"
                className="inline-flex min-h-12 items-center rounded-full border border-blue-400/30 bg-blue-950/40 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-blue-900/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
              >
                Meet Skybridge
              </Link>
            </div>
            <ul
              aria-label="Certifications"
              className="mt-[3svh] flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-medium text-white/75 sm:text-sm short:hidden"
            >
              {CERTIFICATIONS.map((cert, i) => (
                <li key={cert} className="flex items-center gap-2.5">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-white/40">
                      •
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-blue-400">
                      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-5 7.5-9.5V6z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="m8.75 12 2.25 2.25L15.5 9.75" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {cert}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <HeroStats stats={HERO_STATS} />
        </div>
        </HeroStage>

        

        <div className="flex h-14 w-full items-center justify-center bg-background compact:h-10">
          <Link
            href="#proof"
            className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-3 text-xs font-semibold uppercase tracking-[0.2em] text-(--hero-subtle) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800"
          >
            <span className="grid size-8 place-items-center overflow-hidden rounded-full border border-(--hero-border) text-(--hero-label)             group-hover:border-(--hero-label)/60 compact:size-7 motion-reduce:border-(--hero-label)/70 motion-reduce:bg-(--hero-label)/10">
                          <svg aria-hidden="true" viewBox="0 0 16 16" className="block size-4 animate-nudge motion-reduce:animate-none">
                <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Scroll to explore
          </Link>
        </div>
      </section>

      <main className="w-full flex-1">
        <TrustAndChallenges />
        <AboutAndServices />
        <HowItWorks />
        <FaqAndContact />
      </main>

      <footer className="mx-auto w-full max-w-7xl border-t border-zinc-200 px-5 py-7 text-sm text-(--hero-subtle) sm:px-8 lg:px-10">
        <p>Made for what comes next.</p>
      </footer>
    </div>
  );
}


