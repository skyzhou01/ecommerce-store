import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  AccountOverview,
  AccountOverviewSkeleton,
} from "@/components/account/account-overview";
import { Services } from "@/components/storefront/sections";
import { Container, Eyebrow, Heading } from "@/components/ui";

export const metadata: Metadata = {
  title: "My Account | Atelier",
  robots: { index: false },
};

// The session is request data, so only `AccountOverview` reads it, behind
// Suspense; the breadcrumb and heading prerender into the static shell.
export default function AccountPage() {
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
              My Account
            </li>
          </ol>
        </nav>

        <header className="flex flex-col gap-3 pt-4 pb-8 md:pt-6 md:pb-10">
          <Eyebrow>Client services</Eyebrow>
          <Heading as="h1" size="headline">
            My Account
          </Heading>
        </header>

        <div className="pb-section">
          <Suspense fallback={<AccountOverviewSkeleton />}>
            <AccountOverview />
          </Suspense>
        </div>
      </Container>
      <Services />
    </main>
  );
}
