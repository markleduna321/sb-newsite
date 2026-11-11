import { Eyebrow } from "./section-shell";
import { RocketStage } from "./rocket-stage";
import { TrustTicker } from "./trust-ticker";

const SAMPLE_LABELS = [
  { kind: "Client", label: "Sample client 01" },
  { kind: "Tool", label: "Sample CRM" },
  { kind: "Client", label: "Sample client 02" },
  { kind: "Tool", label: "Sample help desk" },
  { kind: "Client", label: "Sample client 03" },
  { kind: "Tool", label: "Sample workspace" },
] as const;

const PAIN_POINTS = [
  {
    title: "Disconnected Teams",
    body: "Your outsourced agents work in a silo. Context gets lost between handoffs, and customers repeat themselves every time.",
    cost: "Lost context, frustrated customers",
    category: "Context lost at every handoff",
  },
  {
    title: "Slow Resolution",
    body: "Tickets bounce between queues and tiers. Simple questions wait hours, and escalations wait days.",
    cost: "Churn you only notice later",
    category: "More queues. Less progress.",
  },
  {
    title: "Manual Data Entry",
    body: "Skilled people spend their shifts copying data between systems instead of solving problems for customers.",
    cost: "Errors, rework, and burnout",
    category: "Busywork instead of better work",
  },
] as const;

export function TrustAndChallenges() {
  return (
    <section id="proof" aria-labelledby="problems-heading" className="screen-two border-t border-zinc-200">
      <div className="screen-two-trust border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
            <h2 className="text-sm font-semibold text-blue-900">Illustrative clients &amp; tools</h2>
            <p id="trust-placeholder-note" className="max-w-prose text-xs leading-5 text-zinc-600">
              These ticker labels are illustrative placeholders only; they do not represent actual client affiliations, tool endorsements, or compliance certifications.
            </p>
          </div>
          <TrustTicker>
            {[false, true].map((clone) => (
              <ul
                key={String(clone)}
                aria-label={clone ? undefined : "Illustrative sample clients and tools"}
                aria-hidden={clone ? true : undefined}
                className={`screen-two-ticker-group${clone ? " screen-two-ticker-clone" : ""}`}
              >
                {SAMPLE_LABELS.map((sample) => (
                  <li key={sample.label} className="flex shrink-0 items-center gap-3 whitespace-nowrap">
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800">
                      {sample.kind}
                    </span>
                    <span className="text-base font-medium tracking-tight text-zinc-700">{sample.label}</span>
                  </li>
                ))}
              </ul>
            ))}
          </TrustTicker>
        </div>
      </div>

      <div className="screen-two-problems relative isolate overflow-hidden bg-zinc-50">
        <div aria-hidden="true" className="screen-two-ambient pointer-events-none absolute -inset-8 -z-10" />
        <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:gap-12">
            <div>
              <Eyebrow>The problem</Eyebrow>
              <h2 id="problems-heading" className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl tall:lg:text-5xl">
                Traditional outsourcing adds headcount, not intelligence.
              </h2>
            </div>
            <p className="max-w-prose text-base leading-7 text-zinc-600">
              More people shouldn&apos;t mean more complexity. When teams, tools, and knowledge
              stay disconnected, your customers feel the gaps.
            </p>
          </div>

          <RocketStage cards={PAIN_POINTS} />
        </div>
      </div>
    </section>
  );
}
