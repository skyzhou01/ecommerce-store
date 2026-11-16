/**
 * Cached catalog reads. Every function uses the `minutes` cache profile so
 * results are still prerendered while stock refreshes about once a minute.
 * Call `revalidateTag("catalog")` after writing catalog or stock data.
 */
import { and, asc, desc, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { category, product } from "@/db/catalog-schema";
import type { CategoryTile, Product } from "@/lib/products";

const CATALOG_TAG = "catalog";

function cacheCatalog() {
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);
}

/** Relations every storefront product read needs. */
const productWith = {
  category: true,
  stock: true,
  images: { orderBy: (image, { asc }) => [asc(image.position)] },
  sizes: { orderBy: (size, { asc }) => [asc(size.position)] },
} satisfies NonNullable<Parameters<typeof db.query.product.findMany>[0]>["with"];

type ProductRow = NonNullable<
  Awaited<ReturnType<typeof db.query.product.findFirst<{ with: typeof productWith }>>>
>;

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category.name,
    categoryId: row.categoryId,
    categorySlug: row.category.slug,
    price: row.priceCents,
    image: row.imageUrl,
    alt: row.imageAlt,
    gallery: row.images.map((image) => ({ src: image.url, alt: image.alt })),
    color: row.color,
    description: row.description,
    details: row.details,
    stock: row.stock?.quantity ?? 0,
    sizes: row.sizes.map(({ label, available }) => ({ label, available })),
    badge: row.badge ?? undefined,
  };
}

export async function getProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheCatalog();
  const row = await db.query.product.findFirst({
    where: eq(product.slug, slug),
    with: productWith,
  });
  return row ? toProduct(row) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  "use cache";
  cacheCatalog();
  const rows = await db
    .select({ slug: product.slug })
    .from(product)
    .orderBy(asc(product.position));
  return rows.map((row) => row.slug);
}

/** Products in the order given; unknown slugs are skipped. */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  "use cache";
  cacheCatalog();
  if (slugs.length === 0) return [];
  const rows = await db.query.product.findMany({
    where: inArray(product.slug, slugs),
    with: productWith,
  });
  const bySlug = new Map(rows.map((row) => [row.slug, toProduct(row)]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
}

/** Same-category items first, then others, excluding the product itself. */
export async function getRelatedProducts(
  current: Pick<Product, "id" | "categoryId">,
  limit = 8,
): Promise<Product[]> {
  "use cache";
  cacheCatalog();
  const rows = await db.query.product.findMany({
    where: ne(product.id, current.id),
    with: productWith,
    orderBy: [
      desc(sql`${product.categoryId} = ${current.categoryId}`),
      asc(product.position),
    ],
    limit,
  });
  return rows.map(toProduct);
}

/** Categories that have a tile image, for the homepage. */
export async function getCategoryTiles(): Promise<CategoryTile[]> {
  "use cache";
  cacheCatalog();
  const rows = await db
    .select()
    .from(category)
    .where(and(isNotNull(category.imageUrl), isNotNull(category.imageAlt)))
    .orderBy(asc(category.position));
  return rows.map((row) => ({
    slug: row.slug,
    label: row.name,
    image: row.imageUrl!,
    alt: row.imageAlt!,
  }));
}
