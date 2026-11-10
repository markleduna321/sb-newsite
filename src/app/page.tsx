import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f3] text-[#20251f]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          skybridge
        </Link>
        <nav aria-label="Main navigation">
          <Link
            href="#about"
            className="text-sm font-medium text-[#5b625b] transition-colors hover:text-[#20251f]"
          >
            About
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-24 pt-16 sm:px-10 sm:pt-20">
        <section aria-labelledby="welcome-heading" className="max-w-3xl">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-[#647b60]">
            A fresh start
          </p>
          <h1
            id="welcome-heading"
            className="text-5xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-7xl"
          >
            Welcome to
            <br />
            <span className="text-[#647b60]">Skybridge.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5b625b]">
            A simple starting point for what comes next. Make yourself at home
            and let your ideas take shape.
          </p>
          <Link
            href="#about"
            className="mt-9 inline-flex items-center rounded-full bg-[#20251f] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3b4938] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#647b60]"
          >
            Get started
          </Link>
        </section>

        <section
          id="about"
          aria-labelledby="about-heading"
          className="mt-24 grid gap-5 border-t border-[#dfe1d9] pt-8 sm:grid-cols-[1fr_2fr] sm:gap-10"
        >
          <h2
            id="about-heading"
            className="text-sm font-medium uppercase tracking-[0.14em] text-[#647b60]"
          >
            The beginning
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[#5b625b]">
            This is your home page. Use it as a place to introduce your project,
            share what you are building, or simply start with a clean slate.
          </p>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-7 text-sm text-[#747a72] sm:px-10">
        <p>Made for what comes next.</p>
      </footer>
    </div>
  );
}
