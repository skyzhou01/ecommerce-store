import Link from "next/link";
import type { ComponentProps } from "react";

import { cx } from "@/lib/cx";

/** Small uppercase tracked label above headings, in nav, filters, etc. */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cx("eyebrow text-muted", className)} {...props} />;
}

const headingSizes = {
  display: "text-display",
  headline: "text-headline",
  title: "text-title",
} as const;

/** Serif editorial heading. Pick the semantic level and visual size independently. */
export function Heading({
  as: Tag = "h2",
  size = "headline",
  className,
  ...props
}: ComponentProps<"h2"> & {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: keyof typeof headingSizes;
}) {
  return (
    <Tag className={cx("font-serif", headingSizes[size], className)} {...props} />
  );
}

/**
 * Text link. `inline` underlines at rest (body copy); `reveal` underlines on
 * hover / aria-current (nav, footers).
 */
export function TextLink({
  variant = "inline",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: "inline" | "reveal" }) {
  return (
    <Link
      className={cx(variant === "inline" ? "link" : "link-reveal", className)}
      {...props}
    />
  );
}
