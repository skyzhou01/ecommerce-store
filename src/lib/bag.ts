/**
 * Shopping bag kept in the browser (localStorage). There is no cart model or
 * checkout yet, so a line only records what the shopper picked; names, prices
 * and stock are looked up from the catalog when the bag is shown.
 *
 * Safe to import from client components; it must never import `@/db`.
 */
import { useSyncExternalStore } from "react";

import type { Product } from "@/lib/products";

/** Catalog fields the bag page needs, served by `/api/bag`. */
export type BagProduct = Pick<
  Product,
  "slug" | "name" | "category" | "price" | "image" | "alt" | "color" | "stock"
>;

export type BagLine = {
  slug: string;
  /** Size label for apparel/shoes; undefined for one-size items. */
  size?: string;
  quantity: number;
};

const STORAGE_KEY = "atelier:bag";
/** Per-line cap; stock may cap it lower. */
export const MAX_LINE_QUANTITY = 10;

const listeners = new Set<() => void>();
const EMPTY: BagLine[] = [];
// Cache the parsed value by its raw string so snapshots stay referentially stable.
let cache: { raw: string | null; lines: BagLine[] } = { raw: null, lines: EMPTY };

function read(): BagLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode, disabled site data): behave as empty.
  }
  if (raw === cache.raw) return cache.lines;
  let lines = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) lines = parsed.filter(isLine);
  } catch {
    // Corrupt value: ignore it; the next write replaces it.
  }
  cache = { raw, lines };
  return lines;
}

function isLine(value: unknown): value is BagLine {
  const line = value as BagLine;
  return (
    typeof line?.slug === "string" &&
    (line.size === undefined || typeof line.size === "string") &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

function write(lines: BagLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage full or blocked; the bag simply won't persist.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const sameLine = (a: Pick<BagLine, "slug" | "size">, b: Pick<BagLine, "slug" | "size">) =>
  a.slug === b.slug && a.size === b.size;

/** Adds one unit, merging with an existing line for the same product and size. */
export function addToBag(slug: string, size?: string) {
  const lines = read();
  const existing = lines.find((line) => sameLine(line, { slug, size }));
  write(
    existing
      ? lines.map((line) =>
          line === existing
            ? { ...line, quantity: Math.min(line.quantity + 1, MAX_LINE_QUANTITY) }
            : line,
        )
      : [...lines, { slug, size, quantity: 1 }],
  );
}

export function setLineQuantity(target: Pick<BagLine, "slug" | "size">, quantity: number) {
  write(
    read().map((line) =>
      sameLine(line, target)
        ? { ...line, quantity: Math.max(1, Math.min(quantity, MAX_LINE_QUANTITY)) }
        : line,
    ),
  );
}

export function removeLine(target: Pick<BagLine, "slug" | "size">) {
  write(read().filter((line) => !sameLine(line, target)));
}

/**
 * Brings stored lines in line with a catalog lookup, so the header count
 * matches the bag page: drops slugs the catalog no longer has (`null`) and
 * caps quantities at current stock. Sold-out lines are kept so they can be
 * shown. Slugs missing from `catalog` are left alone.
 */
export function reconcileBag(catalog: Record<string, Pick<BagProduct, "stock"> | null>) {
  const lines = read();
  const next = lines.flatMap((line) => {
    const product = catalog[line.slug];
    if (product === undefined) return [line];
    if (product === null) return [];
    const cap = Math.max(1, Math.min(MAX_LINE_QUANTITY, product.stock));
    return [line.quantity > cap ? { ...line, quantity: cap } : line];
  });
  if (next.some((line, i) => line !== lines[i]) || next.length !== lines.length) write(next);
}

/** Bag lines, or `null` during SSR/hydration before storage can be read. */
export function useBag(): BagLine[] | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function countUnits(lines: BagLine[]) {
  return lines.reduce((total, line) => total + line.quantity, 0);
}
