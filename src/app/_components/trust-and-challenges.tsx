import { Eyebrow, SectionShell } from "./section-shell";

// Placeholder figures: replace with verified numbers before launch.
const PROOF_METRICS = [
  { value: "1,200+", label: "Agents placed with client teams" },
  { value: "40%", label: "Faster average resolution" },
  { value: "24/7", label: "Coverage across time zones" },
  { value: "14 days", label: "Typical team launch" },
] as const;

// Placeholder: confirm these are platforms your teams actually support before launch.
const PLATFORMS = ["Zendesk", "Salesforce", "HubSpot", "Microsoft 365", "Freshdesk", "Intercom"] as const;

const PAIN_POINTS = [
  {
    title: "Disconnected teams",
    body: "Your outsourced agents work in a silo. Context gets lost between handoffs, and customers repeat themselves every time.",
    cost: "Lost context, frustrated customers",
    icon: "M4 12h4m8 0h4M9 7l-2 5 2 5m6-10 2 5-2 5",
  },
  {
    title: "Slow resolution times",
    body: "Tickets bounce between queues and tiers. Simple questions wait hours, and escalations wait days.",
    cost: "Churn you only notice later",
    icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    title: "Manual data entry",
    body: "Skilled people spend their shifts copying data between systems instead of solving problems for customers.",
    cost: "Errors, rework, and burnout",
    icon: "M4 6h16M4 12h10M4 18h7m9-3-4 4-2-2",
  },
] as const;

export function TrustAndChallenges() {
  return (
    <SectionShell id="proof" labelledBy="problems-heading" className="border-t border-white/5">
      <div className="rounded-3xl border border-blue-400/15 bg-blue-950/30 p-5 sm:p-6 tall:sm:p-7">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
          {PROOF_METRICS.map((m) => (
            <div key={m.label} className="flex flex-col border-l border-blue-400/25 pl-4">
              <dt className="text-sm text-(--hero-subtle)">{m.label}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white tall:sm:text-4xl">{m.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 tall:mt-6 tall:pt-5 sm:flex-row sm:items-center sm:gap-6">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-(--hero-subtle)">
            Our teams work in
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base font-semibold tracking-tight text-white/55">
            {PLATFORMS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-[clamp(2rem,4svh,3.5rem)] grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-12">
        <div>
          <Eyebrow>The problem</Eyebrow>
          <h2 id="problems-heading" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl tall:lg:text-[2.75rem]">
            Outsourcing shouldn&apos;t feel like losing control.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-(--hero-muted) sm:text-lg">
          Most providers sell headcount. You end up managing gaps, chasing updates, and fixing
          mistakes your customers already noticed. Sound familiar?
        </p>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-3 tall:mt-8">
        {PAIN_POINTS.map((p) => (
          <li key={p.title} className="flex flex-col rounded-2xl border border-white/10 bg-white/3 p-5 tall:p-6">
            <span className="grid size-11 place-items-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                <path d={p.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-(--hero-muted)">{p.body}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300/90">{p.cost}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
