import type { StockState } from "@/lib/products";
import { cx } from "@/lib/cx";

const dot: Record<StockState["status"], string> = {
  "in-stock": "bg-success",
  "low-stock": "bg-sale",
  "sold-out": "bg-subtle",
};

const text: Record<StockState["status"], string> = {
  "in-stock": "text-ink",
  "low-stock": "text-sale",
  "sold-out": "text-muted",
};

/** Availability line: colored dot plus label (color is never the only cue). */
export function StockStatus({ state }: { state: StockState }) {
  return (
    <p className={cx("flex items-center gap-2 text-caption", text[state.status])}>
      <span aria-hidden="true" className={cx("size-1.5 rounded-pill", dot[state.status])} />
      {state.label}
    </p>
  );
}
