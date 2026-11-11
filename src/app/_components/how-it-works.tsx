import Link from "next/link";
import { Eyebrow, SectionShell } from "./section-shell";

const FEATURES = [
  {
    feature: "AI routing",
    benefit: "Connects each customer to the right agent instantly.",
    payoff: "Shorter waits, less frustration.",
  },
  {
    feature: "Agent assist",
    benefit: "Suggests answers and surfaces history during every conversation.",
    payoff: "Confident agents, consistent answers.",
  },
  {
    feature: "Automated QA",
    benefit: "Reviews every interaction, not a small random sample.",
    payoff: "Issues caught before customers notice.",
  },
  {
    feature: "Live reporting",
    benefit: "Shows volume, quality, and SLAs in one shared dashboard.",
    payoff: "No more chasing status updates.",
  },
] as const;

export function HowItWorks() {
  return (
    <SectionShell id="how-it-works" labelledBy="how-heading" className="border-t border-zinc-200">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2 id="how-heading" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
            Every feature earns its place.
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <li key={f.feature} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold tabular-nums text-blue-800">0{i + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{f.feature}</h3>
                <p className="mt-1.5 text-sm leading-6 text-(--hero-muted)">{f.benefit}</p>
                <p className="mt-3 text-sm font-medium text-blue-800">{f.payoff}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Placeholder: illustrative result, replace with a verified client story before launch. */}
        <aside
          aria-labelledby="case-teaser-heading"
          className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-linear-to-br from-blue-50 to-white p-7 shadow-sm lg:p-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--hero-subtle)">Case study preview</p>
            <p className="mt-5 text-6xl font-semibold tracking-tight text-blue-900">40%</p>
            <h3 id="case-teaser-heading" className="mt-2 text-xl font-semibold">
              Faster resolution with AI-assisted agents
            </h3>
            <blockquote className="mt-5 border-l-2 border-amber-500 pl-4 text-base leading-7 text-zinc-700">
              &ldquo;It stopped feeling like a vendor. It felt like our own team, just bigger.&rdquo;
            </blockquote>
            <p className="mt-3 pl-4 text-sm text-zinc-600">Head of Support, sample client</p>
          </div>
          <Link
            href="/case-studies"
            className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-900 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800"
          >
            Read case studies
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
              <path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </aside>
      </div>
    </SectionShell>
  );
}
