import Link from "next/link";
import type { ComponentProps } from "react";

import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "inverse" | "outline-inverse";
type Size = "md" | "sm";

type ButtonStyleProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  inverse: "btn-inverse",
  "outline-inverse": "btn-outline-inverse",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
}: ButtonStyleProps = {}) {
  return cx("btn", variants[variant], size === "sm" && "btn-sm", block && "btn-block");
}

export function Button({
  variant,
  size,
  block,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      type={type}
      className={cx(buttonClasses({ variant, size, block }), className)}
      {...props}
    />
  );
}

/** A navigation that should look like a button (e.g. "Shop now"). */
export function ButtonLink({
  variant,
  size,
  block,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return (
    <Link
      className={cx(buttonClasses({ variant, size, block }), className)}
      {...props}
    />
  );
}
