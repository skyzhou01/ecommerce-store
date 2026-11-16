/**
 * Storefront product shapes and pure helpers. Safe to import from client
 * components; database reads live in `@/lib/catalog`.
 */

export type ProductImage = { src: string; alt: string };

export type ProductSize = { label: string; available: boolean };

export type Product = {
  id: number;
  slug: string;
  name: string;
  /** Category display name, e.g. "Ready-to-wear". */
  category: string;
  categoryId: number;
  categorySlug: string;
  /** Price in USD cents. */
  price: number;
  /** Primary image, used on cards and first in the gallery. */
  image: string;
  alt: string;
  /** Additional gallery images (detail crops) shown on the product page. */
  gallery: ProductImage[];
  color: string;
  description: string;
  details: string[];
  /** Units on hand across all sizes. */
  stock: number;
  /** Size run for apparel/shoes; empty for one-size items. */
  sizes: ProductSize[];
  badge?: "New" | "Limited";
};

export type CategoryTile = {
  slug: string;
  label: string;
  image: string;
  alt: string;
};

/** Below this many units we tell shoppers stock is running low. */
export const LOW_STOCK_THRESHOLD = 3;

export type StockState =
  | { status: "in-stock"; label: string }
  | { status: "low-stock"; label: string }
  | { status: "sold-out"; label: string };

export function getStockState(product: Product): StockState {
  if (product.stock <= 0) return { status: "sold-out", label: "Sold out" };
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return { status: "low-stock", label: `Only ${product.stock} left` };
  }
  return { status: "in-stock", label: "In stock" };
}

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(cents: number) {
  return priceFormat.format(cents / 100);
}
