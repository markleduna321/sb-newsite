# Homepage sections

### Phase 1: Compact post-hero homepage sections

- **Timestamp:** 2026-11-11
- **Mode:** Edit access yes · Terminal yes
- **Persona(s) Active:** 🎨 UI-UX + 🖥️ Frontend, 🧪 QA
- **Files Modified/Created:**
  - `src/app/_components/section-shell.tsx` — New. A shared "one screen view" wrapper (`lg:min-h-[calc(100svh-var(--nav-h))]`, content vertically centred, natural flow on mobile) and the `Eyebrow` label.
  - `src/app/_components/trust-and-challenges.tsx` — New. View 2 (`#proof`): trust bar with placeholder metrics and platform wordmarks, plus the problem section with three pain-point cards. Uses `tall:` variants so it fits at 720 and 768px viewport heights.
  - `src/app/_components/about-and-services.tsx` — New. View 3 (`#about`, `#services`): Who We Are value proposition and benefit breakdown, plus three service cards (AI-Assisted CX, Back-Office Operations, Business Process Automation).
  - `src/app/_components/how-it-works.tsx` — New. Feature → benefit → payoff grid, plus a case-study teaser linking to `/case-studies`.
  - `src/app/_components/faq-and-contact.tsx` — New. FAQ (native `<details>`, FAQPage JSON-LD) and the final CTA (`#contact`). The CTA is a mailto link because no form or validation library is installed. The CTA comes first on mobile.
  - `src/app/case-studies/page.tsx` — New route with metadata and three illustrative case studies, clearly labelled as examples.
  - `src/app/page.tsx` — Scroll cue `href` changed from `#about` to `#proof` (the only hero change). The starter `<main>` content is replaced with the four sections; the footer is kept.
- **Issues Encountered:**
  1. View 2 overflowed the viewport by 19–70px at 768 and 720px heights.
  2. Anchor offset was doubled (`scroll-mt` plus the existing `html` `scroll-padding-top`), so sections landed 144px down.
  3. QA failed placeholder marking: the FAQ said onboarding takes 2–4 weeks while the trust bar says 14 days, and some FAQ/CTA promises had no placeholder comment.
- **Resolution:**
  1. Tightened spacing with `tall:` variants and reduced the shared padding to `4svh`.
  2. Removed `scroll-mt`.
  3. Made the timeline consistent ("about two weeks"), added placeholder comments, and put the CTA first in the markup (`lg:order-last`), labelled by `contact-heading`.
  - Browser-verified: every group equals viewport minus nav at 1920×913, 1536×768, 1366×768 and 1280×720; no horizontal overflow (including 390×844).
- **QA Checklist Result:** ✅ All pass (tsc · lint · build) after one fix cycle.
- **Next Steps:**
  - Replace placeholder metrics, platforms, case studies and the contact email with verified content.
  - Build a real lead form (Server Action + Zod; needs package approval).
  - Add `#industries` and `#careers` content.
  - Optionally point the hero CTAs to `#contact`. Awaiting your approval.
