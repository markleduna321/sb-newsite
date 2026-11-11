import Link from "next/link";
import { Eyebrow, SectionShell } from "./section-shell";

// Placeholder: confirm the contact address before launch.
const CONTACT_EMAIL = "hello@skybridge.example";

// Placeholder: confirm these answers and timelines with operations before launch (keep in sync with PROOF_METRICS).
const FAQS = [
  {
    q: "How do you keep our data secure?",
    a: "Agents work with role-based access inside your approved tools. Every process is documented and audited, and we follow the security requirements in your contract.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most teams go live in about two weeks. That covers recruiting, training on your tools and tone, and a supervised pilot before full launch.",
  },
  {
    q: "How does AI fit with our existing systems?",
    a: "We add AI where it helps, such as routing, answer suggestions, and quality review, inside the platforms you already use. Nothing replaces your stack.",
  },
  {
    q: "Will AI replace the people on our account?",
    a: "No. AI handles repetitive steps so your dedicated agents can spend their time on customers. People stay accountable for every conversation.",
  },
  {
    q: "Can we start small?",
    a: "Yes. Many clients begin with one channel or one process, measure the results, and scale from there.",
  },
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function FaqAndContact() {
  return (
    <SectionShell id="contact" labelledBy="contact-heading" className="border-t border-zinc-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <div className="relative isolate flex flex-col justify-center overflow-hidden rounded-3xl border border-blue-900 bg-blue-900 p-7 text-white lg:order-last lg:p-9">
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-blue-700/50 blur-3xl" />
          <h2 id="contact-heading" className="text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
            Ready to build your team?
          </h2>
          {/* Placeholder: confirm the response-time promise before launch. */}
          <p className="mt-4 text-base leading-7 text-blue-50">
            Tell us what you need. We reply within one business day with a team plan and next steps.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Build my team")}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Start the conversation
            </a>
            <Link
              href="/case-studies"
              className="inline-flex min-h-12 items-center rounded-full border border-blue-200/50 bg-blue-800 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              See results
            </Link>
          </div>
          <p className="mt-5 text-sm text-blue-100">
            Or email <a className="text-white underline decoration-white/60 underline-offset-4 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-heading" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
            Questions buyers ask us first.
          </h2>
          <div className="mt-6 divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-blue-800 transition-transform group-open:rotate-45 motion-reduce:transition-none">
                    <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="pb-4 pr-8 text-sm leading-6 text-(--hero-muted)">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
