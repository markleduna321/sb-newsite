import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case studies | Skybridge",
  description: "How Skybridge teams combine skilled people and practical AI to improve customer experience and operations.",
};

// Placeholder content: every story below is illustrative. Replace with verified, approved client stories before launch.
const CASE_STUDIES = [
  {
    industry: "E-commerce",
    service: "AI-Assisted Customer Experience",
    metric: "40%",
    metricLabel: "faster resolution",
    challenge: "Seasonal ticket spikes left customers waiting for days.",
    approach: "A dedicated 30-agent team with AI routing and answer suggestions inside the existing help desk.",
    quote: "It stopped feeling like a vendor. It felt like our own team, just bigger.",
    author: "Head of Support",
  },
  {
    industry: "Healthcare",
    service: "Back-Office Operations",
    metric: "99.5%",
    metricLabel: "claims accuracy",
    challenge: "A growing backlog of claims and frequent data-entry errors.",
    approach: "A trained claims team working in controlled systems with automated quality checks on every file.",
    quote: "The backlog was gone in six weeks, and it has stayed gone.",
    author: "Operations Director",
  },
  {
    industry: "Logistics",
    service: "Business Process Automation",
    metric: "1,800 hrs",
    metricLabel: "saved per month",
    challenge: "Staff copied shipment data between four systems by hand.",
    approach: "Mapped the workflow, automated the handoffs, and moved people to exception handling.",
    quote: "Our people finally work on problems instead of spreadsheets.",
    author: "VP Operations",
  },
] as const;

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800";

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className={`font-semibold tracking-tight text-blue-900 ${focusRing}`}>
            Skybridge
          </Link>
          <Link
            href="/#contact"
            className={`inline-flex min-h-10 items-center rounded-full bg-blue-800 px-5 text-sm font-semibold text-white hover:bg-blue-700 ${focusRing}`}
          >
            Contact us
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <Link href="/" className={`text-sm text-blue-800 hover:text-blue-950 ${focusRing}`}>
          &larr; Back to home
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Case studies</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-(--hero-muted)">
          Outcomes from people and AI working together. The stories below are illustrative examples
          while verified client stories are being approved.
        </p>

        <ul className="mt-12 grid gap-6">
          {CASE_STUDIES.map((c) => (
            <li key={c.industry}>
              <article
                aria-labelledby={`case-${c.industry}`}
                className="grid gap-8 rounded-3xl border border-blue-100 bg-white p-7 shadow-sm sm:p-9 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-800">
                    {c.industry} · Illustrative example
                  </p>
                  <h2 id={`case-${c.industry}`} className="mt-5">
                    <span className="block text-5xl font-semibold tracking-tight">{c.metric}</span>
                    <span className="mt-1 block text-base font-normal text-(--hero-muted)">{c.metricLabel}</span>
                  </h2>
                  <p className="mt-5 inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-medium text-blue-900">
                    {c.service}
                  </p>
                </div>
                <div className="grid gap-5">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-(--hero-subtle)">Challenge</h3>
                    <p className="mt-1.5 leading-7">{c.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-(--hero-subtle)">Approach</h3>
                    <p className="mt-1.5 leading-7">{c.approach}</p>
                  </div>
                  <figure className="border-l-2 border-amber-500 pl-4">
                    <blockquote className="text-lg leading-8 text-blue-950">&ldquo;{c.quote}&rdquo;</blockquote>
                    <figcaption className="mt-2 text-sm text-(--hero-subtle)">{c.author}, sample client</figcaption>
                  </figure>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
