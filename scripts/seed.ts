/**
 * Seeds categories, products and stock from `seed-data.ts`. Safe to re-run:
 * rows are upserted by slug, and each product's images and sizes are replaced.
 *
 * Runs on Node's built-in TypeScript support (`node scripts/seed.ts`), so
 * imports are relative with `.ts` extensions; the `@/*` alias isn't available.
 */
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../src/db/catalog-schema.ts";
import { categories, products } from "./seed-data.ts";

const { category, product, productImage, productSize, productStock } = schema;

// Same precedence as Next.js: .env.local wins over .env.
config({ path: [".env.local", ".env"], quiet: true });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Missing required environment variable: DATABASE_URL");

const db = drizzle(neon(url), { schema });

/** `SET col = excluded.col` for an upsert. */
const excluded = (column: string) => sql.raw(`excluded."${column}"`);

const categoryRows = await db
  .insert(category)
  .values(
    categories.map((c, position) => ({
      slug: c.slug,
      name: c.name,
      imageUrl: c.image ?? null,
      imageAlt: c.alt ?? null,
      position,
    })),
  )
  .onConflictDoUpdate({
    target: category.slug,
    set: {
      name: excluded("name"),
      imageUrl: excluded("image_url"),
      imageAlt: excluded("image_alt"),
      position: excluded("position"),
      updatedAt: sql`now()`,
    },
  })
  .returning({ id: category.id, slug: category.slug });

const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

const productRows = await db
  .insert(product)
  .values(
    products.map((p, position) => {
      const categoryId = categoryIds.get(p.category);
      if (!categoryId) throw new Error(`Unknown category "${p.category}" on ${p.slug}`);
      return {
        slug: p.slug,
        categoryId,
        name: p.name,
        description: p.description,
        color: p.color,
        priceCents: p.price,
        imageUrl: p.image,
        imageAlt: p.alt,
        details: p.details,
        badge: p.badge ?? null,
        position,
      };
    }),
  )
  .onConflictDoUpdate({
    target: product.slug,
    set: {
      categoryId: excluded("category_id"),
      name: excluded("name"),
      description: excluded("description"),
      color: excluded("color"),
      priceCents: excluded("price_cents"),
      imageUrl: excluded("image_url"),
      imageAlt: excluded("image_alt"),
      details: excluded("details"),
      badge: excluded("badge"),
      position: excluded("position"),
      updatedAt: sql`now()`,
    },
  })
  .returning({ id: product.id, slug: product.slug });

const productIds = new Map(productRows.map((row) => [row.slug, row.id]));
const ids = [...productIds.values()];
const idFor = (slug: string) => productIds.get(slug)!;

const images = products.flatMap((p) =>
  p.gallery.map((image, position) => ({
    productId: idFor(p.slug),
    url: image.src,
    alt: image.alt,
    position,
  })),
);

const sizes = products.flatMap((p) =>
  (p.sizes ?? []).map((size, position) => ({
    productId: idFor(p.slug),
    label: size.label,
    available: size.available,
    position,
  })),
);

// neon-http runs a batch as a single transaction (db.transaction() throws).
await db.batch([
  db
    .insert(productStock)
    .values(products.map((p) => ({ productId: idFor(p.slug), quantity: p.stock })))
    .onConflictDoUpdate({
      target: productStock.productId,
      set: { quantity: excluded("quantity"), updatedAt: sql`now()` },
    }),
  db.delete(productImage).where(inArray(productImage.productId, ids)),
  db.delete(productSize).where(inArray(productSize.productId, ids)),
  db.insert(productImage).values(images),
  db.insert(productSize).values(sizes),
]);

console.log(
  `Seeded ${categoryRows.length} categories, ${productRows.length} products, ` +
    `${images.length} gallery images and ${sizes.length} sizes.`,
);
