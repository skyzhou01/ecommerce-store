import Link from "next/link";

import { Container, TextLink } from "@/components/ui";
import { primaryNav } from "@/data/catalog";

import { BagIcon, SearchIcon, UserIcon } from "./icons";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <>
      <p className="bg-ink py-2 text-center eyebrow text-paper">
        Complimentary shipping and returns
        <span className="hidden sm:inline"> on every order</span>
      </p>
      <header className="sticky top-0 z-30 h-header border-b bg-paper/95 backdrop-blur-sm">
        <Container className="grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center">
            <MobileNav items={primaryNav} />
            <nav aria-label="Primary" className="hidden lg:block">
              <ul role="list" className="flex gap-7 eyebrow">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <TextLink variant="reveal" href={item.href}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link
            href="/"
            className="font-serif text-title tracking-[0.35em] uppercase lg:text-[1.625rem]"
            aria-label="Atelier home"
          >
            Atelier
          </Link>

          <div className="flex items-center justify-end gap-1 text-xl sm:gap-3">
            <Link href="/search" className="p-2" aria-label="Search">
              <SearchIcon />
            </Link>
            <Link
              href="/account"
              className="hidden p-2 sm:block"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
            <Link href="/bag" className="-mr-2 p-2" aria-label="Shopping bag, 0 items">
              <BagIcon />
            </Link>
          </div>
        </Container>
      </header>
    </>
  );
}
