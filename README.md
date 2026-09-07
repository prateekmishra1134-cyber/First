# AI Job Finder

AI Job Finder is a privacy-conscious, evidence-based personal job-search assistant. A candidate uploads a CV, reviews an AI-generated structured profile, selects jobs and locations, then receives normalized, deduplicated job results with direct application URLs and transparent match analysis.

> **Honesty boundary:** The app never invents jobs, companies, salaries, posting dates, requirements, application links, Fortune 500 status, or CV qualifications. Providers without a lawful, configured integration explicitly report that they were not searched.

## Architecture

```text
Next.js UI → validated API route → search pipeline → isolated providers
                                ├→ OpenAI (server-side JSON extraction/matching)
                                └→ Supabase/Postgres + private storage
```

- **Frontend:** Next.js App Router pages in `app/(app)`, with a responsive Tailwind UI.
- **API/security:** Zod schemas are applied at input boundaries; secrets are read server-side only.
- **AI:** Dedicated prompt module and strict structured-output schema validation.
- **Search:** Provider interface, normalization, canonical URL cleanup, duplicate removal, partial-failure handling, and explainable preliminary matching.
- **Persistence:** Supabase SQL schema with row-level security policies and user ownership.

## Folder structure

- `app/` — pages and API route handlers
- `components/` — shared layout/UI components
- `lib/ai/` — OpenAI client and dedicated prompts
- `lib/search/` — pipeline, providers, Fortune 500 seed dataset
- `lib/db/` — server database client boundary
- `lib/validation/` — Zod schemas
- `lib/utils/` — job normalization and duplicate detection
- `supabase/schema.sql` — Postgres schema, indexes, RLS
- `tests/` — Vitest unit tests

## Local setup

1. Use Node.js 20+.
2. Copy `.env.example` to `.env.local` and fill relevant values.
3. Install dependencies: `npm install`.
4. Start: `npm run dev`.
5. Run quality checks: `npm run typecheck && npm run lint && npm test && npm run build`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Server-side CV extraction and semantic job matching. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Browser auth client key (future auth wiring). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged operations; never expose it. |
| `BRAVE_SEARCH_API_KEY` | Optional permitted web-search integration. |
| `ENABLE_DEVELOPMENT_FIXTURES` | Explicit local-only fixture switch; do not enable in production. |

## Database and storage setup

Create a Supabase project and run `supabase/schema.sql` in the SQL editor or through migrations. Create a **private** CV bucket. Before enabling the upload endpoint in production, wire Supabase Auth session verification to every user-scoped API route and store file paths—not public URLs. RLS policies in the schema limit rows to `auth.uid()`.

## OpenAI setup

Set `OPENAI_API_KEY` only in the deployment environment. `lib/ai/prompts.ts` keeps prompts separate from routes. `extractCandidateProfile` uses structured JSON, Zod validation, and an explicit no-invention instruction. Do not log CV text or model input/output containing CV content.

## Search providers

Every provider implements `JobSearchProvider` (`lib/search/contracts.ts`). The shipped LinkedIn, Indeed, Naukri, and Wellfound modules are intentionally marked **manual/search integration required** because no unverified scraper is included. Do not bypass authentication, robots restrictions, CAPTCHAs, paywalls, or anti-bot controls.

To add a provider:

1. Confirm a permitted official API, feed, or public indexing path.
2. Implement `searchJobs(criteria)` in `lib/search/providers/` and return only observed fields.
3. Add it to `providers` in `lib/search/providers/index.ts`.
4. Preserve source and application URLs, normalize results, add tests, and document required environment variables.

## Fortune 500 data

`lib/search/fortune500.ts` is a deliberately small curated seed dataset containing year and rank metadata. Refresh it annually from a supported source before asserting Fortune 500 badges. Company career pages must remain official/permitted sources.

## Deployment to Vercel

Import the repository into Vercel, set all production environment variables in project settings, and deploy. Keep OpenAI and Supabase service-role values server-only. Apply database migrations before accepting traffic.

## Security and limitations

- CV upload validation limits type and size; production storage/auth session wiring is required before real user uploads are persisted.
- API routes validate payloads, but routes that access user data must verify Supabase sessions before release.
- A production provider adapter must be implemented for every real source. The current UI truthfully shows no live jobs without one.
- Use private object storage, least-privilege keys, deletion workflows, rate limiting, audit-safe error logs, and consent/retention controls before launch.

## Future-ready extensions

The provider/pipeline and normalized data model leave room for recurring searches, alerts, watchlists, resume tailoring, cover letters, salary analysis, interview preparation, and application analytics without coupling them to the UI.
