import { Eyebrow, SectionShell } from "./section-shell";

const BENEFITS = [
  { title: "One connected team", body: "Our agents work inside your tools and rituals, not in a separate silo." },
  { title: "AI that assists people", body: "Automation handles the busywork so people can focus on the customer." },
  { title: "Security by default", body: "Controlled access, audited processes, and data handled with care." },
] as const;

const SERVICES = [
  {
    title: "AI-Assisted Customer Experience",
    outcome: "Resolve more on first contact.",
    points: ["Route each customer to the right agent", "Give agents live answers and context", "Support voice, chat, and email around the clock"],
    icon: "M4 6h16v10H8l-4 4V6Zm4 4h8m-8 3h5",
  },
  {
    title: "Back-Office Operations",
    outcome: "Keep the work moving behind the scenes.",
    points: ["Process orders, claims, and invoices", "Keep records clean and up to date", "Scale capacity with demand"],
    icon: "M4 7h16v12H4zM9 7V5h6v2M4 12h16",
  },
  {
    title: "Business Process Automation",
    outcome: "Remove repetitive steps entirely.",
    points: ["Map and redesign key workflows", "Automate data entry and handoffs", "Measure the results every week"],
    icon: "M12 4v3m0 10v3M4 12h3m10 0h3M7 7l2 2m6 6 2 2m0-10-2 2m-6 6-2 2M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
  },
] as const;

export function AboutAndServices() {
  return (
    <SectionShell id="about" labelledBy="about-heading" className="border-t border-zinc-200">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div>
          <Eyebrow>Who we are</Eyebrow>
          <h2 id="about-heading" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
            People who care,{" "}
            <span className="bg-linear-to-r from-blue-800 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              powered by AI.
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-(--hero-muted) sm:text-lg">
            Skybridge builds dedicated teams that feel like part of your company. We pair skilled
            people with practical AI, so your customers get faster answers and your business keeps
            its standards.
          </p>
        </div>
        <ul className="grid content-end gap-3 sm:grid-cols-3 lg:gap-4">
          {BENEFITS.map((b) => (
            <li key={b.title} className="border-l-2 border-amber-500 pl-4">
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm leading-6 text-(--hero-muted)">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div id="services" className="mt-[clamp(2.5rem,6svh,4rem)]">
        <h2 className="sr-only">Core services</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {SERVICES.map((s) => (
            <li
              key={s.title}
              className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
            >
              <span className="grid size-11 place-items-center rounded-xl border border-blue-200 bg-blue-50 text-blue-800">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                  <path d={s.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm font-medium text-blue-800">{s.outcome}</p>
              <ul className="mt-4 space-y-2 text-sm text-(--hero-muted)">
                {s.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 size-3.5 shrink-0 text-amber-700">
                      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {pt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
