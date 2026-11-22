"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StockStatus } from "@/components/product/stock-status";
import { Button, ButtonLink, Heading } from "@/components/ui";
import {
  type BagLine,
  type BagProduct,
  MAX_LINE_QUANTITY,
  countUnits,
  reconcileBag,
  removeLine,
  setLineQuantity,
  useBag,
} from "@/lib/bag";
import { formatPrice, getStockState } from "@/lib/products";

/** Catalog lookups by slug; `null` marks a slug the catalog no longer has. */
type Catalog = Record<string, BagProduct | null>;

/**
 * Bag lines joined with live catalog data, plus the order summary. Lines come
 * from localStorage, so nothing renders until the browser has read them.
 */
export function BagContents() {
  const lines = useBag();
  const [catalog, setCatalog] = useState<Catalog>({});
  const [failed, setFailed] = useState(false);

  // Only fetch slugs we haven't looked up, so removing a line doesn't refetch.
  const missing = [...new Set(lines?.map((line) => line.slug))]
    .filter((slug) => !(slug in catalog))
    .join(",");

  useEffect(() => {
    if (!missing) return;
    let cancelled = false;
    fetch(`/api/bag?slugs=${encodeURIComponent(missing)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Bag lookup failed: ${response.status}`);
        return response.json() as Promise<BagProduct[]>;
      })
      .then((products) => {
        if (cancelled) return;
        const found = new Map(products.map((product) => [product.slug, product]));
        const fetched: Catalog = {};
        for (const slug of missing.split(",")) fetched[slug] = found.get(slug) ?? null;
        setCatalog((previous) => ({ ...previous, ...fetched }));
        setFailed(false);
        reconcileBag(fetched);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [missing]);

  if (failed) {
    return (
      <p role="alert" className="border-t py-section text-center text-lead text-muted">
        We couldn&rsquo;t load your bag. Please refresh the page.
      </p>
    );
  }

  if (!lines || missing) return <BagSkeleton />;

  // Pieces removed from the catalog are dropped (and pruned by `reconcileBag`).
  const items = lines.flatMap((line) => {
    const product = catalog[line.slug];
    return product ? [{ line, product }] : [];
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 border-t py-section text-center">
        <p className="text-lead text-muted">Your bag is empty.</p>
        <ButtonLink href="/collections/new">Shop new arrivals</ButtonLink>
      </div>
    );
  }

  const available = items.filter(({ product }) => product.stock > 0);
  const subtotal = available.reduce(
    (total, { line, product }) => total + product.price * Math.min(line.quantity, product.stock),
    0,
  );
  const units = countUnits(items.map(({ line }) => line));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,1fr)] lg:gap-12 xl:gap-20">
      <section aria-labelledby="bag-items-heading">
        <h2 id="bag-items-heading" className="border-b pb-4 font-sans text-caption text-muted">
          {units} {units === 1 ? "piece" : "pieces"}
        </h2>
        <ul role="list">
          {items.map(({ line, product }) => (
            <BagLineItem key={`${line.slug}:${line.size ?? ""}`} line={line} product={product} />
          ))}
        </ul>
      </section>

      <div>
        <aside
          aria-labelledby="bag-summary-heading"
          className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
        >
          <div className="flex flex-col gap-6 bg-canvas p-6 md:p-8">
            <Heading as="h2" size="title" id="bag-summary-heading">
              Order Summary
            </Heading>
            <dl className="flex flex-col gap-3 text-body">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd>Complimentary</dd>
              </div>
              <div className="flex justify-between gap-4 border-t pt-4 text-title">
                <dt>Total</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
            </dl>
            {/* TODO: no checkout or payments yet. */}
            <div className="flex flex-col gap-3">
              <Button block disabled>
                Checkout
              </Button>
              <p className="text-caption text-muted">
                Online checkout opens soon. Your bag is saved on this device.
              </p>
            </div>
          </div>

          <ul role="list" className="flex flex-col gap-2 text-caption text-muted">
            <li>Complimentary express shipping and returns</li>
            <li>Signature gift packaging on every order</li>
            <li>Free returns within 30 days</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function BagLineItem({ line, product }: { line: BagLine; product: BagProduct }) {
  const stock = getStockState(product);
  const soldOut = stock.status === "sold-out";
  const limit = Math.max(1, Math.min(MAX_LINE_QUANTITY, product.stock));
  const quantity = Math.min(line.quantity, limit);
  const href = `/products/${product.slug}`;

  return (
    <li className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b py-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
      <Link href={href} className="media-frame block" tabIndex={-1} aria-hidden="true">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 40rem) 8rem, 6rem"
          className="object-cover mix-blend-multiply"
        />
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-caption text-muted">{product.category}</p>
            <h3 className="font-sans text-body">
              <Link href={href} className="hover:underline hover:underline-offset-4">
                {product.name}
              </Link>
            </h3>
            <p className="text-caption text-muted">
              {product.color}
              {line.size && ` · Size ${line.size}`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className={soldOut ? "text-body text-subtle line-through" : "text-body"}>
              {formatPrice(product.price * quantity)}
            </p>
            {quantity > 1 && (
              <p className="text-caption text-muted">{formatPrice(product.price)} each</p>
            )}
          </div>
        </div>

        {stock.status !== "in-stock" && <StockStatus state={stock} />}

        <div className="mt-auto flex items-center justify-between gap-4">
          <label className="flex items-center gap-3">
            <span className="eyebrow text-muted">Qty</span>
            <select
              value={quantity}
              disabled={soldOut}
              onChange={(event) => setLineQuantity(line, Number(event.target.value))}
              className="h-10 min-w-16 border bg-paper px-3 text-caption hover:border-ink disabled:cursor-not-allowed disabled:text-subtle disabled:hover:border-line"
            >
              {Array.from({ length: limit }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => removeLine(line)}
            className="link cursor-pointer text-caption text-muted hover:text-ink"
          >
            Remove<span className="sr-only"> {product.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

/** Same geometry as the filled bag, shown until storage and catalog data load. */
function BagSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading bag"
      className="grid gap-10 motion-safe:animate-pulse lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,1fr)] lg:gap-12 xl:gap-20"
    >
      <div>
        <div className="border-b pb-4">
          <div className="h-4 w-16 bg-canvas" />
        </div>
        {Array.from({ length: 2 }, (_, i) => (
          <div
            key={i}
            className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b py-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
          >
            <div className="aspect-product bg-canvas" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-20 bg-canvas" />
              <div className="h-4 w-48 bg-canvas" />
              <div className="h-3 w-28 bg-canvas" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-80 bg-canvas" />
    </div>
  );
}
