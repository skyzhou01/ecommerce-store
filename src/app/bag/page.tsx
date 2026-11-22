import type { Metadata } from "next";
import Link from "next/link";

import { BagContents } from "@/components/bag/bag-contents";
import { Services } from "@/components/storefront/sections";
import { Container, Eyebrow, Heading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shopping Bag | Atelier",
  robots: { index: false },
};

// The bag lives in the browser, so the shell prerenders and the lines fill
// in on the client.
export default function BagPage() {
  return (
    <main className="flex-1">
      <Container>
        <nav aria-label="Breadcrumb" className="py-4 lg:py-6">
          <ol role="list" className="flex flex-wrap items-center gap-2 text-caption text-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              Shopping Bag
            </li>
          </ol>
        </nav>

        <header className="flex flex-col gap-3 pt-4 pb-8 md:pt-6 md:pb-10">
          <Eyebrow>Your selection</Eyebrow>
          <Heading as="h1" size="headline">
            Shopping Bag
          </Heading>
        </header>

        <div className="pb-section">
          <BagContents />
        </div>
      </Container>
      <Services />
    </main>
  );
}
