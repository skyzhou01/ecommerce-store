import { getImageProps } from "next/image";

import { ButtonLink, Container, Eyebrow, Heading } from "@/components/ui";
import { hero } from "@/data/catalog";

/**
 * Full-bleed campaign hero. Art-directed: a portrait crop below `md`, a wide
 * crop above, served through one <picture> so only one image downloads.
 */
export function Hero() {
  const common = { alt: hero.alt, fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: hero.imageWide });
  const {
    props: { srcSet: tall, ...img },
  } = getImageProps({ ...common, src: hero.imageTall, loading: "eager" });

  return (
    <section className="relative isolate flex h-[calc(100svh-var(--header-h)-2rem)] max-h-[60rem] min-h-[34rem] items-end overflow-hidden bg-ink text-paper">
      <picture>
        <source media="(min-width: 48rem)" srcSet={wide} />
        <source srcSet={tall} />
        <img
          {...img}
          alt={hero.alt}
          fetchPriority="high"
          className="-z-10 object-cover object-[50%_30%]"
        />
      </picture>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink/70 via-ink/15 to-transparent"
      />

      <Container className="pb-12 md:pb-16 lg:pb-24">
        <div className="flex max-w-2xl flex-col gap-5">
          <Eyebrow className="text-paper">{hero.eyebrow}</Eyebrow>
          <Heading as="h1" size="display">
            {hero.title}
          </Heading>
          <p className="max-w-md text-lead text-paper/85">{hero.description}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/collections/women" variant="inverse">
              Shop Women
            </ButtonLink>
            <ButtonLink href="/collections/men" variant="outline-inverse">
              Shop Men
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
