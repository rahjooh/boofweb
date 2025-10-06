# boofweb Experience Console

Next.js 15 control surface that mirrors the "boofweb Frontend Build Brief" and connects to the Go commerce API.
It provides:

- Catalog management views with search, status filters, and navigation to product details
- Order operations dashboard with fulfilment filters and live totals
- Home overview summarising platform scope, delivery checklist, and backend telemetry
- React Query data layer with mock fallbacks for offline development

## Prerequisites

- Node.js 18+
- Optional Go backend running locally at `http://localhost:8080`

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure environment variables (optional)

   Create a `.env.local` file if you need to override defaults:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_USE_API_MOCKS=false
   ```

   Set `NEXT_PUBLIC_USE_API_MOCKS=true` to force mock data without hitting the backend.

3. Run the development server

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to explore the console.

## Available scripts

| Command       | Description                                            |
| ------------- | ------------------------------------------------------ |
| `npm run dev` | Start Next.js in development mode with Turbopack       |
| `npm run build` | Create a production build                            |
| `npm run start` | Serve the production build                           |
| `npm run lint` | Run Biome static analysis across the codebase        |
| `npm run format` | Format files with Biome                             |

## Architectural notes

- React Query powers client-side data fetching with automatic fallback to curated mock data when the API is offline.
- Tailwind CSS v4 delivers the shared design language described in the brief, with gradients and tokens configured in `globals.css`.
- All routes live under the Next.js App Router:
  - `/` – strategic overview and health telemetry
  - `/products` – catalog explorer with detail pages under `/products/[id]`
  - `/orders` – operational order audit
- Types, API clients, and utilities are colocated in `src/lib` to encourage reuse across future platforms.

## Testing & quality

- `npm run lint` ensures code style via Biome.
- React Query Devtools activate automatically in development for introspecting cache state.

## Authentication, OTP & Password Reset

Accounts are provisioned through the `/login` page. Users can switch between "Sign in" and "Sign up" without leaving the flow:

- Signup collects name, email, mobile, and password, then triggers `/api/v1/users` followed by `/api/v1/auth/activate` once the OTP printed by the backend is entered.
- Login uses a two-step mobile/password plus `/api/v1/auth/login/verify` OTP exchange. All requests run with `credentials: "include"` so the Go API sets session cookies.
- A "Forgot password" tab lets users request a reset code via `/api/v1/auth/password/forgot` and complete the change with `/api/v1/auth/password/reset`. During development the OTP is logged by the Go backend.

For local development, OTP codes are logged by the Go server. Watch the backend terminal to copy the token until SMS delivery is integrated.

## Address book & checkout

The `/account` area now exposes a full address book powered by `/api/v1/addresses`:

- Create, edit, delete, and mark addresses as default.
- Address mutations automatically refresh the list and badge the default entry.
- A lightweight checkout demo lets you place a sample order using either a saved address (`address_id`) or a brand-new inline address (`shipping_address`).

Admin users (determined by `/auth/me`) continue to unlock catalog and order management, while operators see only the tooling relevant to them.

## Future enhancements

The console leaves room for further work highlighted in the original brief: richer analytics, Storybook coverage, OpenAPI-driven typings, and production-grade SMS + email pipelines.
