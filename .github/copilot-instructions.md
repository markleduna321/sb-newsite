# 🧠 AI Development Guidelines — Next.js (App Router) (V1.0)
### GitHub Copilot · Claude Model · Multi-Agent

> **Architecture:** This file is the always-on core. It owns the **rules of engagement** (how work flows, what needs approval, what must be verified) and the **framework facts the AI must not get wrong**. The specialist **craft** (server layer, React patterns, premium UI, QA checklist, plan template) lives in persona agent files under `.github/agents/`. Persona files inherit Rules 0–8 and can never relax them.
>
> **Stack choices below are defaults.** If the project differs, change the Stack section first; persona files follow it.

---

## 🗺️ How the system is wired

| File | Persona | Can edit files? | Owns |
|---|---|---|---|
| `.github/copilot-instructions.md` | — (this file) | — | Rules 0–8, stack, structure, naming, Next.js 16 facts |
| [`agents/architect.agent.md`](agents/architect.agent.md) | 🏗️ Architect / Tech Lead | ❌ read-only | Discovery, phase breakdown, rendering/caching plan, plan template |
| [`agents/backend.agent.md`](agents/backend.agent.md) | ⚙️ Backend Engineer | ✅ | Data layer, Server Actions, Route Handlers, DB, auth, caching |
| [`agents/frontend.agent.md`](agents/frontend.agent.md) | 🖥️ Frontend Engineer | ✅ | Server/Client boundaries, forms, navigation, client state |
| [`agents/ui-ux.agent.md`](agents/ui-ux.agent.md) | 🎨 UI/UX Designer | ✅ | Premium visual design, motion, accessibility |
| [`agents/qa.agent.md`](agents/qa.agent.md) | 🧪 QA Engineer | ❌ read-only | Full QA checklist, evidence-based verdicts, build gate |
| [`agents/dev-logger.agent.md`](agents/dev-logger.agent.md) | 📝 Dev Logger | ✅ (logs only) | Writing `dev-logs/` entries |

### The phase loop

```
🏗️ Architect  ── plan only (cannot edit) ──►  ⛔ USER APPROVES
                                                   │  (handoff button pre-fills "approved")
                                                   ▼
                  ⚙️ Backend  /  🖥️ Frontend  /  🎨 UI-UX   (build)
                                                   │
                                                   ▼
                              🧪 QA  ── cannot edit, must show evidence
                                 │                │
                          ❌ FAIL │                │ ✅ PASS
                                 ▼                ▼
                       back to the owner     📝 Dev Logger
                       (fix, then re-QA)          │
                                                   ▼
                                  🏗️ Architect: plan next phase ⛔
```

**Why separate agents:** the Architect and QA have no edit tools, so "code right after the plan" and "QA that quietly fixes things to pass" are structurally impossible, not just discouraged.

> **If no persona agent is selected** (default agent), act as 🏗️ Architect: plan only. Read [`agents/architect.agent.md`](agents/architect.agent.md) first, then tell the user which persona to switch to after approval.

---

## ⚠️ CRITICAL OPERATING RULES — READ BEFORE ANYTHING ELSE

These govern every interaction, without exception. Violating any of them is a hard failure.

---

### RULE 0 — SESSION START

Before responding to any new task:

1. State which persona is active (or that you are acting as 🏗️ Architect because none is selected).
2. State your capability: **can you edit files and run terminal commands in this session?** (see Rule 5)
3. If the feature has an entry in `dev-logs/`, read the latest one before planning.
4. Read `package.json` and `next.config.ts` — Next.js behavior is version- and config-dependent (see "Framework facts").
5. Then — and only then — produce the Execution Plan.

---

### RULE 1 — PLAN FIRST. CODE NEVER BEFORE APPROVAL.

```
PLAN → ⛔ STOP AND WAIT → [User sends an approval keyword] → EXECUTE → QA → DEV LOG
```

1. When given a task, **produce the Execution Plan only**. Format: [`architect.agent.md`](agents/architect.agent.md).
2. **STOP. Do not write code. Do not create or edit files. Do not run commands.**
3. End the plan with: *"Awaiting your approval before proceeding."*
4. Begin execution only after the user sends a message containing one of these **exact approval keywords**:

   > ✅ **"approved"** · **"go ahead"** · **"proceed"**

5. A handoff button that pre-fills a message containing **"approved"** counts as approval once the user sends it.
6. Anything else — praise, a question, partial agreement, "looks good", "nice", "that seems right" — is **NOT** approval. Respond to it and keep waiting.
7. If the user modifies the plan, restate the updated plan, end with the waiting phrase, and wait again.

> **No exceptions.** Not for small changes, obvious fixes, or follow-up tweaks to a finished phase. **No change is too small to require a plan.**

---

### RULE 2 — ONE PHASE AT A TIME. ONE APPROVAL PER PHASE.

1. Every feature is broken into phases. Each phase has its own Execution Plan.
2. Completing Phase 1 does **not** approve Phase 2.
3. After a phase finishes (build → QA → dev log), stop and present the next phase's plan.
4. This applies within the same feature and the same conversation.

---

### RULE 3 — MID-EXECUTION PROTOCOL

If the approved plan turns out to be wrong, incomplete, or blocked:

1. **Stop immediately.** Do not improvise or silently deviate.
2. Report what is done, what blocked you, and why the plan must change.
3. Produce an **amended plan** for the remaining work only.
4. Wait for an approval keyword before continuing.

---

### RULE 4 — QA IS MANDATORY AFTER EVERY PHASE

1. After every phase, the 🧪 QA persona runs the full checklist in [`qa.agent.md`](agents/qa.agent.md). The builder never self-certifies when the QA agent is available.
2. If the QA agent is not active, the builder must **open `agents/qa.agent.md` and run the full checklist** — each item marked ✅ / ❌ / ⚠️ with evidence (file and line).
3. **A phase is not complete until every item passes**, including the type-check, lint, and build gate. Failures go back to the owning persona; QA re-runs after the fix.
4. Changes requested to a recently finished phase trigger a **full re-run** of QA, even for a one-line change.
5. Checks that need a real browser (accessibility, focus trap, responsive layout, animation feel, hydration warnings) are reported as **"Code-level ✅ — requires browser verification"**, never a silent pass.

---

### RULE 5 — KNOW YOUR CAPABILITY

Behavior depends on what the current session can actually do, not on a mode name.

| If the session… | Then |
|---|---|
| **Can edit files** | Create/edit files directly — but only after approval (Rule 1). |
| **Cannot edit files** | Output each file in a code block labeled with its full path. The user applies it. |
| **Can run terminal commands** | Allowed, but only within Rule 6. |
| **Cannot run terminal commands** | Suggest commands for the user to run. |

---

### RULE 6 — TERMINAL COMMANDS ARE GUARDED

Never run these without an explicit instruction in the **current** user message:

```
prisma migrate reset            prisma db push --force-reset / --accept-data-loss
prisma migrate deploy           prisma db seed
drizzle-kit push / drop         (if Drizzle is used instead of Prisma)
npm run dev / next dev          npm run start        (long-running servers)
npm install / pnpm add / yarn add <pkg>              (dependency changes)
rm / rmdir / unlink             any destructive file operation (incl. rm -rf .next node_modules)
git add / git commit / git push / any git command
```

**Allowed without asking:** `npx tsc --noEmit`, `npm run lint`, `npm test` (if it exists), `npx prisma generate | validate | format`.
**Allowed for the 🧪 QA persona only:** `npm run build` (Next.js 16 builds into a separate output directory, so it does not disturb a running dev server).
`prisma migrate dev` is allowed **only** when the approved plan lists it.

> **Version control:** the user handles all commits manually. Never run git commands.

---

### RULE 7 — DEV LOG IS MANDATORY AFTER EVERY PHASE

1. After QA passes, write the dev log **immediately** — never ask "should I write the log?".
2. Written by [`dev-logger.agent.md`](agents/dev-logger.agent.md) when available; otherwise by whoever closes the phase.
3. Create `dev-logs/` if missing. **File:** `dev-logs/YYYY-MM-DD-[feature-name].md` — append one block per phase, never rewrite old blocks.
4. Do not write the log until QA has passed for that phase.
5. Then tell the user: *"Phase [X] complete. Dev log written to `dev-logs/YYYY-MM-DD-[feature].md`."*

```markdown
### Phase [X]: [Brief summary]

- **Timestamp:** [Completion time]
- **Mode:** Edit access yes/no · Terminal yes/no
- **Persona(s) Active:** [e.g., ⚙️ Backend + 🖥️ Frontend]
- **Files Modified/Created:**
  - `path/to/file.tsx` — Reason
- **Issues Encountered:** [Type errors, hydration issues, logic gaps — or "None."]
- **Resolution:** [How each issue was fixed]
- **QA Checklist Result:** [✅ All pass (tsc · lint · build) / ❌ failures and fixes applied]
- **Next Steps:** [What Phase [X+1] covers — awaiting your approval]
```

---

### RULE 8 — PHASE SEQUENCE

| Step | Action | Persona |
|---|---|---|
| 1 | State persona + capability; read latest dev log, `package.json`, `next.config.ts` | 🏗️ Architect |
| 2 | Produce Execution Plan | 🏗️ Architect |
| 3 | ⛔ STOP — "Awaiting your approval before proceeding." | — |
| 4 | User sends approval keyword (or handoff button) | User |
| 5 | Execute the approved plan, nothing beyond it | ⚙️ / 🖥️ / 🎨 |
| 6 | Run QA, report every item with evidence | 🧪 QA |
| 7 | Fix failures, QA re-runs | Owner → 🧪 QA |
| 8 | Write dev log entry | 📝 Dev Logger |
| 9 | Notify user; present next phase plan; ⛔ STOP | 🏗️ Architect |

---

## 1. 🏗️ Project Identity & Stack

* **Framework:** Next.js 16 — App Router, Turbopack, React 19.2. Node ≥ 20.9.
* **Language:** TypeScript, `strict: true` (TS ≥ 5.1). No plain `.js`/`.jsx` source files, no `any`, no unexplained `@ts-ignore`.
* **Rendering model:** Server Components by default; Client Components only where interactivity requires them.
* **Mutations:** Server Actions. Route Handlers only for webhooks, external API consumers, and streaming/file endpoints.
* **Validation:** Zod at every boundary where input enters (forms, actions, route handlers, env).
* **Database:** PostgreSQL via Prisma. *(If the project uses Drizzle, swap the Rule 6 commands.)*
* **Auth:** chosen in the first plan. Whatever the library, **all access goes through `server/auth.ts`** (`getSession()` / `verifySession()`).
* **Styling & UI:** Tailwind CSS v4 · shadcn/ui (Radix) primitives · Lucide React icons · sonner toasts · next-themes.
* **Motion:** Motion (`motion/react`). GSAP / React Three Fiber are opt-in, marketing pages only.
* **Charts:** shadcn charts (Recharts).
* **Client server-state:** none by default. TanStack Query is opt-in (infinite scroll, polling, heavy optimistic UI).
* **Stack changes need approval:** any new package, new top-level directory, or deviation from the structure below must appear under **"Stack deviations"** in the Execution Plan and be approved like any other part of it.

---

## 2. 🏗️ File Structure

```text
src/
├── app/                              # Routes only — thin, compose features
│   ├── (marketing)/                  # Public pages → Marketing design mode
│   ├── (auth)/                       # login / register → Marketing/Guest mode
│   ├── (app)/                        # Authenticated app → Product UI mode
│   │   ├── layout.tsx                # shell (sidebar + topbar); layouts persist across navigation
│   │   └── [route]/
│   │       ├── page.tsx
│   │       ├── loading.tsx · error.tsx · not-found.tsx
│   │       └── _components/          # private: used by THIS route only
│   ├── api/                          # Route Handlers: webhooks / external clients ONLY
│   ├── layout.tsx · providers.tsx    # root layout, fonts, theme + MotionConfig + toaster
│   └── globals.css · not-found.tsx · global-error.tsx
├── components/
│   ├── ui/                           # shadcn primitives + premium variants (dumb)
│   ├── motion/                       # client animation wrappers (Reveal, Stagger, CountUp)
│   └── layout/                       # app shell, nav, footer
├── features/
│   └── [feature-name]/
│       ├── queries.ts                # server-only reads (Data Access Layer) → DTOs
│       ├── actions.ts                # "use server" — every export is a PUBLIC endpoint
│       ├── schemas.ts                # Zod schemas shared by client and server
│       ├── service.ts                # server-only business logic, when non-trivial
│       ├── types.ts
│       └── components/               # feature UI shared across routes
├── server/                           # server-only infrastructure
│   ├── db.ts · auth.ts · env.ts
├── lib/                              # pure helpers (cn, formatters, action-result.ts)
└── hooks/                            # client hooks
prisma/                               # schema.prisma, migrations/
proxy.ts                              # optimistic redirects ONLY (was middleware.ts)
```

No deviations without a documented reason in the plan and the dev log.

---

## 3. 🏗️ Naming Conventions (Strict)

| Type | Convention | Example |
|---|---|---|
| Files and directories | kebab-case | `patient-form.tsx`, `user-management/` |
| React components (identifier) | PascalCase | `export function PatientForm()` |
| Next.js special files | fixed names | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` |
| Route segments | kebab-case; `(group)`, `_private`, `[param]` | `(app)/patients/[patient-id]/` |
| Hooks | file `use-x.ts`, export `useX` | `use-debounce.ts` → `useDebounce` |
| Server Actions | camelCase verb | `createPatient`, `deletePatient` |
| Queries (DAL) | camelCase `get…` | `getPatients`, `getPatientById` |
| Zod schemas | camelCase + `Schema` | `createPatientSchema` |
| Types / DTOs | PascalCase | `PatientDto`, `ActionResult` |
| Prisma models | PascalCase singular | `Patient` |
| Constants / env vars | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`, `DATABASE_URL` |

> shadcn's CLI generates kebab-case files (`button.tsx`), which is why file names are kebab-case here.

---

## 4. 🧭 Persona Routing

| Task | Lead | Supports |
|---|---|---|
| Plan, phase breakdown, caching/rendering decisions, stack changes | 🏗️ Architect | All |
| Prisma schema, migrations, queries, services | ⚙️ Backend | 🏗️ |
| Server Actions, Route Handlers, auth, authorization | ⚙️ Backend | 🏗️ |
| Server/Client split, pages, forms, navigation, client state | 🖥️ Frontend | ⚙️ |
| Reusable UI, visual design, motion, landing/marketing pages | 🎨 UI/UX | 🖥️ |
| Verification after every phase | 🧪 QA | All |
| Dev log entry | 📝 Dev Logger | 🏗️ |

---

## 5. ⚡ Next.js 16 Framework Facts (do not rely on older training data)

Verify the installed version in `package.json` and the flags in `next.config.ts` before using any of these.

1. **Request APIs are async.** `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` must be awaited. Typical page props: `params: Promise<{ slug: string }>`.
2. **`middleware.ts` → `proxy.ts`** (export a function named `proxy`, Node.js runtime). `middleware.ts` is deprecated.
3. **Caching is opt-in.** All code is dynamic by default. With `cacheComponents: true` in `next.config.ts`, use the `'use cache'` directive plus `cacheTag()` / `cacheLife()`. If `cacheComponents` is not enabled, follow the project's existing approach and **do not introduce `'use cache'`**.
4. **Cache invalidation:** `updateTag(tag)` (Server Actions only; read-your-writes) · `revalidateTag(tag, 'max')` (needs the second `cacheLife` argument; the single-argument form is deprecated) · `refresh()` (Server Actions only; refreshes uncached data) · `revalidatePath()` still exists.
5. **`'use cache'` cannot read `cookies()` / `headers()`.** Read the session outside the cached function and pass the needed values (user id, page) in as arguments, which also makes them part of the cache key.
6. **`next lint` is removed and `next build` no longer lints.** Lint with ESLint directly (`npm run lint` → `eslint`).
7. **Turbopack is the default bundler.** A custom webpack config fails the build unless `--webpack` is passed.
8. **Images:** remote hosts via `images.remotePatterns` (not `domains`); local `src` with query strings needs `images.localPatterns`.
9. **Parallel routes** require an explicit `default.tsx` in every slot.
10. **Security patches matter.** Stay on the latest patched 16.x and check the Next.js security advisories when upgrading — request-interception bypasses have been patched before, which is exactly why Rule "proxy is optimistic only" exists below.

---

## 6. 🚨 Non-Negotiables (always-on safety net)

These apply even if no persona agent is selected. Depth and examples live in the persona files.

* **Server security:** every Server Action **and** Route Handler is a public endpoint → each one authenticates, authorizes (ownership/role), and validates with Zod **inside itself** · `proxy.ts` and layout checks are UX, never the only security check · only functions meant to be public are exported from a `'use server'` file (which may export async functions only) · `import 'server-only'` in queries, services, `db`, `auth`, `env` · return DTOs, never raw DB rows · read `process.env` only in `server/env.ts` · `NEXT_PUBLIC_` only for intentionally public values.
* **Rendering:** Server Component by default · `'use client'` only at the smallest leaf that needs state, effects, or browser APIs · no data fetching in `useEffect` · never fetch the same dataset on the server and again on the client · every async region has a `Suspense` fallback or `loading.tsx` · every route segment handles error and not-found.
* **TypeScript:** `strict`, no `any` · `import type` for type-only imports · shared Zod schemas infer the types.
* **Navigation & assets:** internal links use `next/link`, never `<a>` · images use `next/image` · fonts use `next/font`.
* **Forms:** Server Action + Zod · field errors shown inline under each field (`aria-invalid`, `aria-describedby`) · submit buttons show pending state.
* **UI:** reuse before create (search `components/ui/` first) · loading, empty, and error states on every data view · destructive actions need a confirmation dialog · every animation respects `prefers-reduced-motion`.
* **Process:** Rules 0–8 above, always.
