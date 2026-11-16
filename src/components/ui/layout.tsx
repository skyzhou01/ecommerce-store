import type { ComponentProps } from "react";

import { cx } from "@/lib/cx";

const widths = {
  page: "",
  content: "max-w-(--container-content)",
  prose: "max-w-(--container-prose)",
} as const;

/** Centered shell with responsive gutters. `width` narrows the max width. */
export function Container({
  width = "page",
  className,
  ...props
}: ComponentProps<"div"> & { width?: keyof typeof widths }) {
  return (
    <div className={cx("page-container", widths[width], className)} {...props} />
  );
}

/** Page section with the standard vertical rhythm and an optional top rule. */
export function Section({
  divided = false,
  className,
  ...props
}: ComponentProps<"section"> & { divided?: boolean }) {
  return (
    <section
      className={cx("section-y", divided && "border-t", className)}
      {...props}
    />
  );
}

/** Responsive 2/3/4-column grid for product cards. */
export function ProductGrid({ className, ...props }: ComponentProps<"ul">) {
  return <ul role="list" className={cx("product-grid", className)} {...props} />;
}

/** Vertical stack with a fixed gap step (Tailwind spacing units). */
export function Stack({
  gap = 4,
  className,
  ...props
}: ComponentProps<"div"> & { gap?: 1 | 2 | 3 | 4 | 6 | 8 | 12 }) {
  const gaps = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
    12: "gap-12",
  } as const;
  return <div className={cx("flex flex-col", gaps[gap], className)} {...props} />;
}
