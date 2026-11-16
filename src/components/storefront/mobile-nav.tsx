"use client";

import Link from "next/link";
import { useRef } from "react";

import { CloseIcon, MenuIcon } from "./icons";

type NavItem = { href: string; label: string };

/**
 * Full-screen menu for small viewports. Built on <dialog> so focus trapping,
 * Escape-to-close and the inert background come from the platform.
 */
export function MobileNav({ items }: { items: NavItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        className="-ml-2 p-2 text-xl lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper text-ink backdrop:bg-ink/20 lg:hidden"
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (event.target === dialog.current) close();
        }}
      >
        <div className="page-container flex h-header items-center justify-between border-b">
          <span className="eyebrow">Menu</span>
          <button
            type="button"
            className="-mr-2 p-2 text-xl"
            aria-label="Close menu"
            onClick={close}
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Primary" className="page-container py-6">
          <ul role="list">
            {items.map((item) => (
              <li key={item.href} className="border-b">
                <Link
                  href={item.href}
                  className="block py-5 font-serif text-headline"
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul role="list" className="mt-8 flex flex-col gap-4 eyebrow text-muted">
            <li>
              <Link href="/account" onClick={close}>
                Account
              </Link>
            </li>
            <li>
              <Link href="/client-services" onClick={close}>
                Client services
              </Link>
            </li>
          </ul>
        </nav>
      </dialog>
    </>
  );
}
