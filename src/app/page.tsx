import Link from "next/link";
import { HeroVideo } from "./_components/hero-video";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="rounded text-lg font-semibold tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          skybridge
        </Link>
        <nav aria-label="Main navigation">
          <Link
            href="#about"
            className="rounded text-sm font-medium text-(--hero-muted) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            About
          </Link>
        </nav>
      </header>

      <main className="w-full flex-1 pb-16 sm:pb-20">
        <section
          aria-labelledby="welcome-heading"
          className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 pt-8 sm:gap-10 sm:px-8 sm:pt-12 md:gap-12 lg:block lg:px-10 lg:pt-12"
        >
          <div className="pointer-events-none order-1 max-w-2xl lg:absolute lg:inset-14 lg:z-20 lg:flex lg:items-center">
            <div className="max-w-xl">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-(--hero-label) sm:text-sm">
                A fresh start
              </p>
              <h1
                id="welcome-heading"
                className="text-5xl font-medium leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                Welcome to
                <br />
                <span className="text-(--hero-label)">Skybridge.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-(--hero-muted) sm:mt-6 sm:text-lg sm:leading-8">
                A simple starting point for what comes next. Make yourself at
                home and let your ideas take shape.
              </p>
              <Link
                href="#about"
                className="pointer-events-auto mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-(--hero-label) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                Get started
              </Link>
            </div>
          </div>

          <div className="relative order-2 isolate">
            <HeroVideo />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden aspect-video bg-linear-to-r from-black/80 via-black/50 to-transparent lg:block"
            />
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <section
            id="about"
            aria-labelledby="about-heading"
            className="mt-16 grid gap-5 border-t border-(--hero-border) pt-8 sm:mt-20 sm:grid-cols-[1fr_2fr] sm:gap-10 sm:pt-10"
          >
            <h2
              id="about-heading"
              className="text-xs font-medium uppercase tracking-[0.18em] text-(--hero-label) sm:text-sm"
            >
              The beginning
            </h2>
            <p className="max-w-2xl text-base leading-7 text-(--hero-muted)">
              This is your home page. Use it as a place to introduce your
              project, share what you are building, or simply start with a
              clean slate.
            </p>
          </section>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-7xl px-5 pb-7 text-sm text-(--hero-subtle) sm:px-8 lg:px-10">
        <p>Made for what comes next.</p>
      </footer>
    </div>
  );
}
