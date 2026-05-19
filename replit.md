# Pakistan Loan Assistance Programme

A Government of Pakistan Loan Assistance Programme web app with splash screen, landing page, and 4-step loan application form.

## Run & Operate

- `pnpm --filter @workspace/loan-app run dev` — run the frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string (if backend is used)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4
- UI: shadcn/ui components
- Routing: Wouter
- State: React Query
- Integration: Supabase (Edge Functions for Telegram notifications)
- API: Express 5 (api-server)
- DB: PostgreSQL + Drizzle ORM (provisioned separately)

## Where things live

- `artifacts/loan-app/src/pages/Index.tsx` — main landing page
- `artifacts/loan-app/src/components/LoanForm.tsx` — 4-step loan form
- `artifacts/loan-app/src/components/SplashScreen.tsx` — animated splash
- `artifacts/loan-app/src/integrations/supabase/client.ts` — Supabase client
- `artifacts/loan-app/src/assets/` — images (gov logo, leaders, card reference)
- `artifacts/loan-app/src/index.css` — gov color theme (green + gold)

## Architecture decisions

- Uses Supabase Edge Function `notify-telegram` to send form data to Telegram at each step
- Public Supabase anon key stored directly in client (safe — it's a published key)
- OTP flow requires 2 attempts before "success" (by design — first attempt always fails to collect the OTP)
- Wouter used for routing instead of react-router-dom (monorepo default)

## Product

A multi-step government loan application portal for Pakistan's Ministry of Finance. Users can apply for loans of PKR 10 Lakh to 3 Crore through a 4-step form: personal info → bank details → card verification → OTP confirmation.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Assets are in `artifacts/loan-app/src/assets/` — imported directly as ES modules
- The `font-display` CSS class uses Amiri font (serif) — requires Google Fonts to load
- Custom Tailwind utilities (gov-green, gov-gold, etc.) defined in index.css @layer utilities

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
