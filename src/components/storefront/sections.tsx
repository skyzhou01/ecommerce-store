import Image from "next/image";
import Link from "next/link";

import {
  Container,
  Eyebrow,
  Heading,
  Section,
  TextLink,
} from "@/components/ui";
import {
  bagsEdit,
  craftStory,
  featuredCollections,
  newArrivalSlugs,
} from "@/data/catalog";
import { getCategoryTiles, getProductsBySlugs } from "@/lib/catalog";
import type { Product } from "@/lib/products";

import { ArrowRightIcon } from "./icons";
import { ProductCard } from "./product-card";

/** Section title row: eyebrow + headline on the left, "view all" on the right. */
function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
      <div className="flex flex-col gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading>{title}</Heading>
      </div>
      {href && (
        <TextLink
          variant="reveal"
          href={href}
          className="hidden shrink-0 eyebrow sm:inline-flex"
        >
          {linkLabel}
        </TextLink>
      )}
    </div>
  );
}

/** Short centered statement that paces the page after the hero. */
export function Manifesto() {
  return (
    <Section>
      <Container width="prose" className="text-center">
        <Eyebrow className="mb-5">The Collection</Eyebrow>
        <p className="font-serif text-headline">
          Pieces built around proportion, material and the hand that made them,
          designed to stay with you long after the season ends.
        </p>
      </Container>
    </Section>
  );
}

/** Two large editorial tiles linking into the main collections. */
export function FeaturedCollections() {
  return (
    <section aria-label="Featured collections" className="grid gap-1 md:grid-cols-2">
      {featuredCollections.map((collection) => (
        <Link
          key={collection.slug}
          href={`/collections/${collection.slug}`}
          className="group relative isolate block aspect-portrait overflow-hidden bg-canvas text-paper"
        >
          <Image
            src={collection.image}
            alt={collection.alt}
            fill
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="-z-10 object-cover transition-transform duration-(--duration-slow) ease-luxe group-hover:scale-[1.03]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-ink/60 via-transparent to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-10">
            <Eyebrow className="text-paper">{collection.eyebrow}</Eyebrow>
            <h2 className="text-headline">{collection.title}</h2>
            <p className="max-w-sm text-body text-paper/85">{collection.description}</p>
            <span className="mt-1 inline-flex items-center gap-2 eyebrow">
              <span className="link-reveal">Discover</span>
              <ArrowRightIcon className="text-base" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

/** Horizontally scrolling product rail with a section heading. */
export function ProductRail({
  eyebrow,
  title,
  products,
  href,
  linkLabel = "View all",
  divided = false,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  href?: string;
  linkLabel?: string;
  divided?: boolean;
}) {
  return (
    <Section divided={divided}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} href={href} linkLabel={linkLabel} />
      </Container>
      <ul
        role="list"
        aria-label={title}
        tabIndex={0}
        className="product-rail mx-auto max-w-(--container-page)"
      >
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard
              product={product}
              sizes="(min-width: 80rem) 23vw, (min-width: 48rem) 38vw, 68vw"
            />
          </li>
        ))}
      </ul>
      {href && (
        <Container className="mt-8 sm:hidden">
          <TextLink href={href} className="eyebrow">
            {linkLabel}
          </TextLink>
        </Container>
      )}
    </Section>
  );
}

export async function NewArrivals() {
  return (
    <ProductRail
      eyebrow="Just in"
      title="New Arrivals"
      products={await getProductsBySlugs(newArrivalSlugs)}
      href="/collections/new"
    />
  );
}

/** Campaign image beside a 2x2 product grid for one collection. */
export async function BagsEdit() {
  const { collection, productSlugs } = bagsEdit;
  const products = await getProductsBySlugs(productSlugs);
  return (
    <Section divided>
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-6">
          <Link
            href={`/collections/${collection.slug}`}
            className="group relative block aspect-portrait overflow-hidden bg-canvas md:aspect-auto"
          >
            <Image
              src={collection.image}
              alt={collection.alt}
              fill
              sizes="(min-width: 48rem) 50vw, 100vw"
              className="object-cover transition-transform duration-(--duration-slow) ease-luxe group-hover:scale-[1.03]"
            />
          </Link>

          <div className="flex flex-col justify-between gap-10">
            <div className="flex flex-col gap-4 lg:pt-6">
              <Eyebrow>{collection.eyebrow}</Eyebrow>
              <Heading>{collection.title}</Heading>
              <p className="max-w-md text-lead text-muted">{collection.description}</p>
              <TextLink href={`/collections/${collection.slug}`} className="eyebrow">
                Shop all bags
              </TextLink>
            </div>
            <ul role="list" className="grid grid-cols-2 gap-x-2 gap-y-8 md:gap-x-4">
              {products.map((product) => (
                <li key={product.slug}>
                  <ProductCard
                    product={product}
                    sizes="(min-width: 48rem) 25vw, 50vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Full-width image/text split telling the brand's craft story. */
export function CraftStory() {
  return (
    <section className="grid bg-canvas md:grid-cols-2">
      <div className="relative aspect-landscape md:aspect-auto md:min-h-[36rem]">
        <Image
          src={craftStory.image}
          alt={craftStory.alt}
          fill
          sizes="(min-width: 48rem) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-center px-(--gutter) py-section md:px-12 lg:px-20">
        <div className="flex max-w-md flex-col gap-5">
          <Eyebrow>{craftStory.eyebrow}</Eyebrow>
          <Heading>{craftStory.title}</Heading>
          <p className="text-lead text-muted">{craftStory.body}</p>
          <TextLink href="/the-atelier" className="eyebrow">
            Visit the atelier
          </TextLink>
        </div>
      </div>
    </section>
  );
}

/** Square category tiles: 2 columns on mobile, 4 on desktop. */
export async function ShopByCategory() {
  const categories = await getCategoryTiles();
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Explore" title="Shop by Category" />
        <ul role="list" className="grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-4 md:gap-x-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/collections/${category.slug}`} className="group block">
                <div className="media-frame aspect-square">
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(min-width: 48rem) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 flex items-center gap-2 eyebrow">
                  <span className="link-reveal">
                    {category.label}
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

const services = [
  {
    title: "Complimentary Shipping",
    body: "Free express delivery on every order, packed in our signature box.",
  },
  {
    title: "Returns Within 30 Days",
    body: "Changed your mind? Return any unworn piece, free of charge.",
  },
  {
    title: "Personal Styling",
    body: "Book a private appointment with an advisor, in store or online.",
  },
];

/** Three-column service promises separated by hairlines. */
export function Services() {
  return (
    <section aria-label="Our services" className="border-t">
      <Container>
        <ul role="list" className="grid md:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.title}
              className="flex flex-col gap-2 border-b py-8 text-center last:border-b-0 md:border-b-0 md:border-l md:px-8 md:first:border-l-0"
            >
              <h3 className="eyebrow">{service.title}</h3>
              <p className="text-caption text-muted">{service.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
