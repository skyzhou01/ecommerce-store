/**
 * Editorial storefront content: hero, collections, homepage curation and
 * navigation. Products, categories and stock live in Postgres (see
 * `@/lib/catalog`); `scripts/seed-data.ts` holds the sample catalog.
 */

export type Collection = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const hero = {
  eyebrow: "Autumn–Winter 2026",
  title: "The Quiet Season",
  description:
    "Soft tailoring, hand-finished knits and leather pieces made to be lived in.",
  imageWide: unsplash("1445205170230-053b83016050"),
  imageTall: unsplash("1617019114583-affb34d1b3cd"),
  alt: "Coats and knitwear hanging on a rail in a warmly lit atelier",
};

export const featuredCollections: Collection[] = [
  {
    slug: "women",
    eyebrow: "Women",
    title: "City Layers",
    description: "Long coats and fluid lines for the new season.",
    image: unsplash("1539109136881-3be0616acf4b"),
    alt: "Woman in a pale blue coat walking across a cathedral square",
  },
  {
    slug: "men",
    eyebrow: "Men",
    title: "Modern Tailoring",
    description: "Sharp suiting cut in lightweight wool.",
    image: unsplash("1507679799987-c73779587ccf"),
    alt: "Man buttoning a navy suit jacket",
  },
];

/** Product slugs for the homepage "New Arrivals" rail, in display order. */
export const newArrivalSlugs = [
  "marina-top-handle-bag",
  "riviera-woven-bag",
  "leather-biker-jacket",
  "fringed-knit-cape",
  "floral-satin-pump",
  "round-metal-sunglasses",
  "suede-bomber-jacket",
  "pearl-strand-necklace",
];

export const bagsEdit = {
  collection: {
    slug: "bags",
    eyebrow: "The Bag Edit",
    title: "Carried Through the Season",
    description:
      "Structured silhouettes in calfskin and hand-woven leather, finished with polished hardware.",
    image: unsplash("1566150905458-1bf1fc113f0d"),
    alt: "Blush leather shoulder bag with a chain strap on a white plinth",
  } satisfies Collection,
  productSlugs: [
    "blush-chain-shoulder-bag",
    "nylon-city-backpack",
    "marina-top-handle-bag",
    "riviera-woven-bag",
  ],
};

export const craftStory = {
  eyebrow: "The Atelier",
  title: "Made Slowly, by Hand",
  body: "Every knit is finished by a single maker in our workshop, from the first cast-on stitch to the final press. It takes longer. We think you can tell.",
  image: unsplash("1558769132-cb1aea458c5e"),
  alt: "Neutral-toned knitwear hanging beside dried pampas grass",
};

export const primaryNav = [
  { href: "/collections/women", label: "Women" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/bags", label: "Bags" },
  { href: "/collections/shoes", label: "Shoes" },
  { href: "/collections/jewelry", label: "Jewelry" },
];

export const footerNav = [
  {
    title: "Client Services",
    links: ["Contact us", "Shipping", "Returns", "Care guide"],
  },
  {
    title: "The House",
    links: ["Our story", "The atelier", "Sustainability", "Careers"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "Cookie settings", "Accessibility"],
  },
];
