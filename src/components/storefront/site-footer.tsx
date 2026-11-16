import Link from "next/link";

import { Container, Eyebrow, Heading, TextLink } from "@/components/ui";
import { footerNav } from "@/data/catalog";

import { NewsletterForm } from "./newsletter";

const slugify = (label: string) => label.toLowerCase().replaceAll(" ", "-");

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="grid gap-12 py-section lg:grid-cols-[1.2fr_2fr] lg:gap-20">
        <div className="flex flex-col gap-5">
          <Eyebrow className="text-paper/70">Newsletter</Eyebrow>
          <Heading as="h2" size="headline">
            Hear about new collections first
          </Heading>
          {/* The form is light-on-dark here; invert its tokens locally. */}
          <div className="text-ink">
            <NewsletterForm />
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {footerNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="eyebrow text-paper/60">{group.title}</h3>
              <ul role="list" className="flex flex-col gap-3 text-body">
                {group.links.map((label) => (
                  <li key={label}>
                    <TextLink variant="reveal" href={`/${slugify(label)}`}>
                      {label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>

      <Container className="flex flex-col items-center gap-4 border-t border-paper/15 py-8 sm:flex-row sm:justify-between">
        <Link href="/" className="font-serif text-title tracking-[0.35em] uppercase">
          Atelier
        </Link>
        <p className="text-caption text-paper/60">
          © Atelier. Sample storefront for demonstration.
        </p>
      </Container>
    </footer>
  );
}
