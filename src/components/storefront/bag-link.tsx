"use client";

import Link from "next/link";

import { countUnits, useBag } from "@/lib/bag";

import { BagIcon } from "./icons";

/** Header bag icon with a unit count; the count appears once storage is read. */
export function BagLink() {
  const lines = useBag();
  const count = lines ? countUnits(lines) : 0;

  return (
    <Link
      href="/bag"
      className="relative -mr-2 p-2"
      aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <BagIcon />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-pill bg-ink px-1 text-micro leading-none tracking-normal text-paper"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
