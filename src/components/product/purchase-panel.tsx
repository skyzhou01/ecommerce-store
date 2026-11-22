"use client";

import { useId, useState } from "react";

import { Button, TextLink } from "@/components/ui";
import { addToBag } from "@/lib/bag";
import type { ProductSize, StockState } from "@/lib/products";
import { cx } from "@/lib/cx";

type Status = { kind: "idle" } | { kind: "needs-size" } | { kind: "added"; size?: string };

/**
 * Size selection and add-to-bag. Sold-out products get a disabled button and
 * a client services prompt instead of a size picker. The bag is browser-only
 * (see `@/lib/bag`).
 */
export function PurchasePanel({
  slug,
  sizes,
  stock,
}: {
  slug: string;
  sizes: ProductSize[];
  stock: StockState;
}) {
  const [size, setSize] = useState<string>();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const errorId = useId();

  if (stock.status === "sold-out") {
    return (
      <div className="flex flex-col gap-4">
        <Button block disabled>
          Sold out
        </Button>
        <p className="text-caption text-muted">
          This piece is currently unavailable.{" "}
          <TextLink href="/contact-us">Contact client services</TextLink> to ask about
          restocks.
        </p>
      </div>
    );
  }

  const needsSize = Boolean(sizes?.length);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (needsSize && !size) {
          setStatus({ kind: "needs-size" });
          return;
        }
        addToBag(slug, size);
        setStatus({ kind: "added", size });
      }}
    >
      {sizes && needsSize && (
        <fieldset aria-describedby={status.kind === "needs-size" ? errorId : undefined}>
          <div className="mb-3 flex items-center justify-between">
            <legend className="eyebrow">
              Size{size && <span className="text-muted"> — {size}</span>}
            </legend>
            <TextLink href="/size-guide" className="text-caption">
              Size guide
            </TextLink>
          </div>
          <div className="grid grid-cols-5 gap-1 sm:grid-cols-6">
            {sizes.map((option) => (
              <label key={option.label} className="relative">
                <input
                  type="radio"
                  name="size"
                  value={option.label}
                  disabled={!option.available}
                  checked={size === option.label}
                  onChange={() => {
                    setSize(option.label);
                    setStatus({ kind: "idle" });
                  }}
                  className="peer sr-only"
                />
                <span
                  className={cx(
                    "flex h-11 cursor-pointer items-center justify-center border text-caption transition-colors duration-(--duration-fast)",
                    "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper",
                    "peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                    "hover:border-ink",
                    "peer-disabled:cursor-not-allowed peer-disabled:border-line peer-disabled:text-subtle peer-disabled:line-through",
                  )}
                >
                  {option.label}
                </span>
                {!option.available && <span className="sr-only">(sold out)</span>}
              </label>
            ))}
          </div>
          {status.kind === "needs-size" && (
            <p id={errorId} role="alert" className="mt-3 text-caption text-error">
              Please select a size.
            </p>
          )}
        </fieldset>
      )}

      <div className="flex flex-col gap-3">
        <Button type="submit" block>
          Add to bag
        </Button>
        <p role="status" className="min-h-5 text-caption">
          {status.kind === "added" && (
            <>
              Added to your bag{status.size ? ` in size ${status.size}` : ""}.{" "}
              <TextLink href="/bag">View bag</TextLink>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
