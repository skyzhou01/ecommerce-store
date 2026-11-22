import type { ReactNode } from "react";

import { ButtonLink, Heading, TextLink } from "@/components/ui";
import { getAccountUser } from "@/lib/account";
import { cx } from "@/lib/cx";

import { SignOutButton } from "./sign-out-button";

// TODO: none of these sections exist yet; they render the not-found page.
const accountNav = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/details", label: "Personal details" },
];

const memberSince = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

/**
 * Account dashboard for the signed-in shopper, or a sign-in prompt. Reads
 * the session, so render it behind Suspense with `AccountOverviewSkeleton`.
 */
export async function AccountOverview() {
  const user = await getAccountUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-5 border-t py-section text-center">
        <Heading as="h2" size="title">
          Sign in to your account
        </Heading>
        <p className="max-w-md text-lead text-muted">
          Track orders, manage your saved addresses and update your details.
        </p>
        {/* TODO: sign-in and registration pages are not built yet. */}
        <div className="mt-3 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/sign-in">Sign in</ButtonLink>
          <ButtonLink href="/register" variant="secondary">
            Create account
          </ButtonLink>
        </div>
      </div>
    );
  }

  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <div className="grid gap-8 border-t pt-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 lg:pt-10 xl:gap-20">
      <nav aria-label="Account">
        <ul
          role="list"
          className="-mx-(--gutter) flex gap-6 overflow-x-auto border-b px-(--gutter) pb-4 eyebrow whitespace-nowrap lg:mx-0 lg:flex-col lg:gap-4 lg:border-b-0 lg:px-0 lg:pb-0"
        >
          {accountNav.map((item) => (
            <li key={item.href}>
              <TextLink
                variant="reveal"
                href={item.href}
                aria-current={item.href === "/account" ? "page" : undefined}
              >
                {item.label}
              </TextLink>
            </li>
          ))}
          <li className="lg:mt-4 lg:border-t lg:pt-6">
            <SignOutButton className="eyebrow text-muted hover:text-ink" />
          </li>
        </ul>
      </nav>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Heading as="h2" size="headline">
            Welcome back, {firstName}
          </Heading>
          <p className="text-body text-muted">
            Member since {memberSince.format(user.memberSince)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel
            title="Recent orders"
            action={{ href: "/account/orders", label: "View all" }}
            className="md:col-span-2"
          >
            {/* TODO: no orders model yet, so there is never order history. */}
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-body text-muted">You haven&rsquo;t placed an order yet.</p>
              <ButtonLink href="/collections/new" variant="secondary" size="sm">
                Shop new arrivals
              </ButtonLink>
            </div>
          </Panel>

          <Panel title="Personal details" action={{ href: "/account/details", label: "Edit" }}>
            <dl className="flex flex-col gap-3 text-body">
              <div>
                <dt className="text-caption text-muted">Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div>
                <dt className="text-caption text-muted">Email</dt>
                <dd className="break-all">{user.email}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Addresses" action={{ href: "/account/addresses", label: "Manage" }}>
            <p className="text-body text-muted">
              No saved addresses. Add one for faster checkout.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/** Hairline-bordered section with an eyebrow title and an optional link. */
function Panel({
  title,
  action,
  className,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cx("flex flex-col gap-5 border p-6 md:p-8", className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="eyebrow">{title}</h3>
        {action && (
          <TextLink href={action.href} className="text-caption">
            {action.label}
            <span className="sr-only"> {title.toLowerCase()}</span>
          </TextLink>
        )}
      </div>
      {children}
    </section>
  );
}

/** Neutral placeholder while the session resolves (signed-in state unknown). */
export function AccountOverviewSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading account"
      className="grid gap-8 border-t pt-8 motion-safe:animate-pulse lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 lg:pt-10 xl:gap-20"
    >
      <div className="flex gap-6 lg:flex-col lg:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-3 w-20 bg-canvas" />
        ))}
      </div>
      <div className="flex flex-col gap-8">
        <div className="h-10 w-72 max-w-full bg-canvas" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-36 bg-canvas md:col-span-2" />
          <div className="h-44 bg-canvas" />
          <div className="h-44 bg-canvas" />
        </div>
      </div>
    </div>
  );
}
