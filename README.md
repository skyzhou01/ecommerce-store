# atelier-store

Next.js 16 + TypeScript storefront scaffold. This repo currently contains **only
the project skeleton and wiring** — no storefront features, UI, or payments yet.

## Stack

| Concern  | Choice                                         |
| -------- | ---------------------------------------------- |
| Framework| Next.js 16 (App Router, Turbopack)             |
| Language | TypeScript (strict)                            |
| Styling  | Tailwind CSS v4                                |
| Auth     | Better Auth 1.7 (email + password enabled)     |
| ORM      | Drizzle ORM + drizzle-kit                      |
| Database | Neon serverless Postgres (`neon-http` driver)  |

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Neon database** at <https://console.neon.tech> and copy the
   pooled connection string.

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Fill in `DATABASE_URL`, and generate a secret:

   ```bash
   openssl rand -base64 32   # -> BETTER_AUTH_SECRET
   ```

4. **Push the auth tables to Neon**

   ```bash
   npm run db:migrate   # applies drizzle/0000_*.sql
   ```

5. **Run it**

   ```bash
   npm run dev
   ```

   Sanity check that auth is mounted: <http://localhost:3000/api/auth/ok>

## Scripts

| Script                | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Dev server (Turbopack)                         |
| `npm run build`       | Production build                               |
| `npm run start`       | Serve the production build                     |
| `npm run lint`        | ESLint                                         |
| `npm run typecheck`   | `tsc --noEmit`                                 |
| `npm run db:generate` | Diff schema -> new SQL migration in `drizzle/` |
| `npm run db:migrate`  | Apply pending migrations                       |
| `npm run db:push`     | Push schema straight to the DB (dev only)      |
| `npm run db:studio`   | Drizzle Studio                                 |

## Layout

```
src/
  app/
    api/auth/[...all]/route.ts   Better Auth catch-all handler (GET/POST)
    layout.tsx, page.tsx          Untouched create-next-app starter
  db/
    index.ts                      Neon client + Drizzle instance
    schema.ts                     Better Auth core tables (generated)
  lib/
    auth.ts                       Server-side Better Auth instance
    auth-client.ts                Browser client (signIn/signUp/signOut/useSession)
  env.ts                          Fail-fast env var accessor
drizzle/                          Generated SQL migrations
drizzle.config.ts                 drizzle-kit config
```

## Notes for whoever builds on this

- **`src/db/schema.ts` is generated.** It holds only Better Auth's four core
  tables (`user`, `session`, `account`, `verification`) — the adapter cannot
  function without them. No product/cart/order model exists yet. Regenerate it
  after changing auth config with:

  ```bash
  npx auth generate --config src/lib/auth.ts --output src/db/schema.ts
  ```

  The CLI does not resolve the `@/*` tsconfig alias, so it will fail to load
  `src/lib/auth.ts` as-is. Point it at a temporary copy of the config that uses
  relative imports, then delete that copy. (The CLI is the `auth` package;
  `@better-auth/cli` is deprecated and stuck on 1.4.x.)

  When you add your own tables, put them in a separate module and re-export both
  from a barrel so the generator never overwrites your work.

- **No transactions.** The `neon-http` driver throws on `db.transaction()`. This
  is fine today: Better Auth's adapter defaults `transaction: false`, and its
  only internal transaction paths are MySQL-specific. If you later need real
  transactions, switch `src/db/index.ts` to the WebSocket `Pool` driver
  (`drizzle-orm/neon-serverless`).

- **Auth is wired, not built.** `emailAndPassword` is enabled and the endpoints
  respond, but there are no sign-in/sign-up pages, no route protection, no email
  verification, and no social providers.
