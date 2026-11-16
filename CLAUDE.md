# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Never edit .env file.

@AGENTS.md

## Status

Next.js 16 storefront in early build-out. Auth and DB are wired. The header and footer live in the root layout. The homepage is `src/app/page.tsx`, which composes `src/components/storefront/` sections. The product detail page is `src/app/products/[slug]/page.tsx`, using parts in `src/components/product/`; it prerenders every product via `generateStaticParams`. There are no collection or cart routes yet, so nav and category links show `src/app/not-found.tsx`. Products, categories and stock come from Postgres (see Database conventions); editorial content stays static in `src/data/catalog.ts`. Gallery detail shots are imgix focal-point crops of Unsplash photos, which is why `next.config.ts` allows query strings on `images.unsplash.com/photo-*`. Under Cache Components, unknown product slugs render the not-found UI with a 200 status plus `noindex`, because `dynamicParams` is unavailable. There are no cart, order or variant models, auth pages or payments yet; add-to-bag and the newsletter only acknowledge locally.

## Commands

```bash
npm run dev          # dev server (Turbopack); auth sanity check: http://localhost:3000/api/auth/ok
npm run build
npm run lint         # ESLint (flat config, next core-web-vitals + typescript)
npm run typecheck    # tsc --noEmit
npm run db:generate  # diff src/db/tables.ts -> new SQL migration in drizzle/
npm run db:migrate   # apply pending migrations
npm run db:push      # push schema directly (dev only)
npm run db:seed      # idempotent upsert of the sample catalog (scripts/seed.ts)
npm run db:studio
```

There is no test framework configured yet. Verify changes with `npm run typecheck` and `npm run lint`.

Setup: `cp .env.example .env.local`, then fill in `DATABASE_URL` (Neon pooled connection string) and `BETTER_AUTH_SECRET` (`openssl rand -base64 32`). `drizzle.config.ts` and `scripts/seed.ts` load `.env.local` then `.env` via dotenv (same precedence as Next.js).

## Architecture

- **Env**: `src/env.ts` exposes lazy getters that throw on missing required vars (`DATABASE_URL`, `BETTER_AUTH_SECRET`). Read env through it rather than `process.env` in server code. The exception is `src/lib/auth-client.ts`, which runs in the browser and reads `NEXT_PUBLIC_APP_URL` directly.
- **DB**: `src/db/index.ts` creates a Drizzle instance on Neon's **`neon-http`** driver and re-exports `schema`. `db.transaction()` throws on this driver. If you need transactions, switch to the WebSocket `Pool` driver (`drizzle-orm/neon-serverless`).
- **Auth**: `src/lib/auth.ts` is the server Better Auth instance (Drizzle adapter, `provider: "pg"`, email+password enabled). It is mounted by the catch-all `src/app/api/auth/[...all]/route.ts`. `nextCookies()` must remain the **last** plugin. `src/lib/auth-client.ts` exports the browser helpers `signIn`, `signUp`, `signOut`, and `useSession`. Use the `Session` type exported from `auth.ts`.
- **Next config**: `cacheComponents` and `partialPrefetching` are enabled, and Tailwind v4 runs through the `@tailwindcss/turbopack` loader. Those caching semantics differ from older Next versions, so check `node_modules/next/dist/docs/` before writing data-fetching or caching code.
- **Design system**: Tailwind v4 is configured CSS-first in `src/app/globals.css`; there is no `tailwind.config` or PostCSS config. Tokens live in `@theme`: colors `ink/paper/canvas/muted/subtle/line/sale/error/success`, text sizes `micro…display`, containers, aspect ratios and easing. Responsive runtime vars (`--gutter`, `--section-y`, `--header-h`) are in `:root`. Component styles are `@utility` classes: `btn` plus a variant, `link`, `link-reveal`, `eyebrow`, `page-container`, `section-y`, `product-grid`, `media-frame`. React wrappers live in `src/components/ui`. Use tokens instead of raw hex or px values. Corners are square, and borders default to the hairline `line` colour. The UI is light-only. Fonts: Inter (`font-sans`) and Bodoni Moda (`font-serif`, editorial headings only), loaded in `layout.tsx`.
- Path alias: `@/*` -> `src/*`.

## Schema rules

- `src/db/schema.ts` is **generated** by the Better Auth CLI and holds only the core tables (`user`, `session`, `account`, `verification`). Don't hand-edit it. App tables live in their own modules (e.g. `src/db/catalog-schema.ts`), re-exported with it through the barrel `src/db/tables.ts`. `drizzle.config.ts` and `src/db/index.ts` point at that barrel; register new app modules there.
- To regenerate after changing auth config, run `npx auth generate --config <config> --output src/db/schema.ts`. The CLI comes from the `auth` package; `@better-auth/cli` is deprecated. The CLI does not resolve the `@/*` alias, so point it at a temporary copy of `src/lib/auth.ts` that uses relative imports, then delete the copy.
- After schema changes, run `npm run db:generate`, review the generated SQL, then `npm run db:migrate`. Migrations live in `drizzle/`. Use versioned migrations, not `db:push`, for anything that should persist.

## Database conventions

- **Catalog model**: `category` 1─* `product`; `product` 1─1 `product_stock`, 1─* `product_image`, 1─* `product_size`. Integer identity PKs; `slug` (unique) is the public key used in URLs and seeds. Ordering comes from a `position` column, not insertion order.
- **Money** is integer cents (`price_cents`), formatted with `formatPrice`. Never store floats.
- **Stock** is one quantity per product in `product_stock` (check `>= 0`), kept apart from catalog content. `product_size` is only a size run with an `available` flag, not variants: no per-size quantity, SKU or price.
- **Scope**: this first version deliberately has no carts, orders, payments, reviews, wishlists, variants or collection tables. Don't add them unless asked. Editorial content (hero, featured collections, nav, footer, curated homepage slug lists) stays static in `src/data/catalog.ts`.
- **Reads**: pages and components get catalog data only through `src/lib/catalog.ts`. Every function there uses `'use cache'` + `cacheLife("minutes")` + `cacheTag("catalog")` (Cache Components treats an uncached DB read as dynamic and breaks prerendering). Each function maps rows to the `Product` shape with `toProduct`. Any code that writes catalog or stock data must call `revalidateTag("catalog")`/`updateTag`.
- **Client boundary**: `src/lib/products.ts` holds the `Product` types and pure helpers (`getStockState`, `formatPrice`) for client components. It must never import `@/db`.
- **Writes**: on `neon-http`, group multi-statement writes in `db.batch([...])`, which runs as one transaction.
- **Seeding**: `npm run db:seed` runs `scripts/seed.ts` from `scripts/seed-data.ts`. Keep it idempotent: upsert by slug, and replace child rows. Scripts run on Node's native TypeScript support, so use relative imports with `.ts` extensions, not `@/*`.
- **Build**: `generateStaticParams` reads product slugs from the DB, so `npm run build` needs a reachable, migrated and seeded database.
