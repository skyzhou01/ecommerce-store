/**
 * Seed catalog for `npm run db:seed`. This is the sample data the storefront
 * shipped with before products moved into Postgres. Images are Unsplash photos
 * (https://unsplash.com/license); pick unbranded subjects when adding more.
 */
import { unsplash } from "../src/data/catalog.ts";

export type SeedProduct = {
  slug: string;
  name: string;
  /** Category slug. */
  category: string;
  /** Price in USD cents. */
  price: number;
  image: string;
  alt: string;
  gallery: { src: string; alt: string }[];
  color: string;
  description: string;
  details: string[];
  stock: number;
  sizes?: { label: string; available: boolean }[];
  badge?: "New" | "Limited";
};

export type SeedCategory = {
  slug: string;
  name: string;
  /** Omit to keep the category off the homepage tiles. */
  image?: string;
  alt?: string;
};

/**
 * Close-up crop of an Unsplash photo via imgix focal-point zoom: x/y are the
 * focal point (0-1), z the zoom factor. Output is 3:4 to match product frames.
 */
const detail = (id: string, x: number, y: number, z: number) =>
  `${unsplash(id)}?fit=crop&crop=focalpoint&fp-x=${x}&fp-y=${y}&fp-z=${z}&w=1500&h=2000`;

const IMG = {
  marina: "1594223274512-ad4803739b7c",
  riviera: "1598532163257-ae3c6b2524b6",
  biker: "1521223890158-f9f7c3d5d504",
  cape: "1434389677669-e08b4cac3105",
  pump: "1543163521-1bf539c55dd2",
  sunglasses: "1511499767150-a48a237f0083",
  bomber: "1591047139829-d91aecb6caea",
  pearl: "1515562141207-7a88fb7ce338",
  blush: "1566150905458-1bf1fc113f0d",
  backpack: "1553062407-98eeb64c6a62",
  brogue: "1560343090-f0409e92791a",
  earrings: "1535632066927-ab7c9ab60908",
  pendant: "1599643478518-a784e5dc4c8f",
  denim: "1596755094514-f87e34085b2c",
  trousers: "1594633312681-425c7b97ccd1",
};

const apparelSizes = (soldOut: string[] = []) =>
  ["XS", "S", "M", "L", "XL"].map((label) => ({
    label,
    available: !soldOut.includes(label),
  }));

const shoeSizes = (soldOut: string[] = []) =>
  ["36", "37", "38", "39", "40", "41"].map((label) => ({
    label,
    available: !soldOut.includes(label),
  }));

export const products: SeedProduct[] = [
  {
    slug: "marina-top-handle-bag",
    name: "Marina Top Handle Bag",
    category: "bags",
    price: 289000,
    image: unsplash(IMG.marina),
    alt: "Petrol-blue pebbled leather top handle bag with a gold clasp",
    gallery: [
      { src: detail(IMG.marina, 0.6, 0.35, 2.2), alt: "Rolled handle and gold-tone rings" },
      { src: detail(IMG.marina, 0.55, 0.55, 2.4), alt: "Pebbled calfskin and push-lock clasp" },
    ],
    color: "Petrol",
    description:
      "A structured top handle bag cut from pebbled calfskin, with a push-lock flap and a single rolled handle. Sized to carry the essentials, with a detachable strap for wearing on the shoulder.",
    details: [
      "Pebbled calfskin with leather lining",
      "Gold-tone push-lock closure",
      "Detachable, adjustable shoulder strap",
      "W 24 × H 19 × D 11 cm",
      "Made in Italy",
    ],
    stock: 6,
    badge: "New",
  },
  {
    slug: "riviera-woven-bag",
    name: "Riviera Woven Bag",
    category: "bags",
    price: 215000,
    image: unsplash(IMG.riviera),
    alt: "Cognac woven leather bag with a gold chain strap",
    gallery: [
      { src: detail(IMG.riviera, 0.4, 0.6, 2.6), alt: "Hand-woven leather strips and chain strap" },
      { src: detail(IMG.riviera, 0.7, 0.7, 2.4), alt: "Soft woven leather body" },
    ],
    color: "Cognac",
    description:
      "Wide strips of supple nappa hand-woven into a slouchy, unstructured shape and hung from a polished chain. Roomy enough for every day, soft enough to fold away.",
    details: [
      "Hand-woven nappa leather",
      "Gold-tone chain shoulder strap",
      "Magnetic top closure; interior slip pocket",
      "W 38 × H 28 × D 10 cm",
      "Made in Italy",
    ],
    stock: 2,
  },
  {
    slug: "leather-biker-jacket",
    name: "Leather Biker Jacket",
    category: "ready-to-wear",
    price: 465000,
    image: unsplash(IMG.biker),
    alt: "Black leather biker jacket worn open over a black T-shirt",
    gallery: [
      { src: detail(IMG.biker, 0.35, 0.55, 2.2), alt: "Exposed zip and supple lambskin" },
      { src: detail(IMG.biker, 0.7, 0.35, 2.2), alt: "Snap-down lapel and asymmetric zip" },
    ],
    color: "Black",
    description:
      "A classic biker silhouette in supple lambskin, cut close through the body with an asymmetric zip, snap-down lapels and zipped cuffs.",
    details: [
      "100% lambskin; viscose lining",
      "Asymmetric front zip",
      "Three zip pockets",
      "Regular fit; true to size",
      "Professional leather clean only",
    ],
    stock: 3,
    sizes: apparelSizes(["XS", "XL"]),
    badge: "Limited",
  },
  {
    slug: "fringed-knit-cape",
    name: "Fringed Knit Cape",
    category: "ready-to-wear",
    price: 128000,
    image: unsplash(IMG.cape),
    alt: "Cream open-knit cape with fringed hem on a hanger",
    gallery: [
      { src: detail(IMG.cape, 0.5, 0.4, 2.2), alt: "V-neck and open-knit texture" },
      { src: detail(IMG.cape, 0.5, 0.65, 2.6), alt: "Hand-knotted fringe hem" },
    ],
    color: "Ecru",
    description:
      "An airy open-knit cape in cotton and linen, finished by hand with a knotted fringe. Layer it over tailoring or wear it alone on warmer evenings.",
    details: [
      "70% cotton, 30% linen",
      "Hand-knotted fringe",
      "One size, relaxed drape",
      "Hand wash cold; dry flat",
    ],
    stock: 14,
  },
  {
    slug: "floral-satin-pump",
    name: "Floral Satin Pump",
    category: "shoes",
    price: 98000,
    image: unsplash(IMG.pump),
    alt: "Pair of floral print stiletto pumps",
    gallery: [
      { src: detail(IMG.pump, 0.5, 0.4, 2.2), alt: "Floral print on satin upper" },
      { src: detail(IMG.pump, 0.5, 0.65, 2.6), alt: "Pointed toe and stiletto heel" },
    ],
    color: "Azure floral",
    description:
      "A pointed pump in printed silk satin on a slender 100mm heel. The botanical print is placed by hand so no two pairs are exactly alike.",
    details: [
      "Printed silk satin upper",
      "Leather lining and sole",
      "100mm stiletto heel",
      "Runs true to size",
      "Made in Italy",
    ],
    stock: 9,
    sizes: shoeSizes(["36", "41"]),
    badge: "New",
  },
  {
    slug: "round-metal-sunglasses",
    name: "Round Metal Sunglasses",
    category: "eyewear",
    price: 52000,
    image: unsplash(IMG.sunglasses),
    alt: "Gold-framed round sunglasses with green lenses",
    gallery: [
      { src: detail(IMG.sunglasses, 0.5, 0.4, 2.2), alt: "Fine gold-tone frame" },
      { src: detail(IMG.sunglasses, 0.5, 0.65, 2.6), alt: "Bottle-green mineral lens" },
    ],
    color: "Gold / Bottle green",
    description:
      "Slim round frames in gold-tone titanium with bottle-green mineral glass lenses. Adjustable nose pads keep them comfortable all day.",
    details: [
      "Titanium frame, gold-tone finish",
      "Mineral glass lenses, 100% UV protection",
      "Adjustable nose pads",
      "Includes leather case",
    ],
    stock: 22,
  },
  {
    slug: "suede-bomber-jacket",
    name: "Suede Bomber Jacket",
    category: "ready-to-wear",
    price: 310000,
    image: unsplash(IMG.bomber),
    alt: "Cognac bomber jacket held up on a hanger",
    gallery: [
      { src: detail(IMG.bomber, 0.5, 0.4, 2.2), alt: "Ribbed collar and centre zip" },
      { src: detail(IMG.bomber, 0.5, 0.65, 2.6), alt: "Soft suede body" },
    ],
    color: "Cognac",
    description:
      "A relaxed bomber in brushed goat suede with ribbed trims and a two-way zip. Lined in silk for a lightweight, easy layer.",
    details: [
      "100% goat suede; silk lining",
      "Ribbed collar, cuffs and hem",
      "Two-way front zip",
      "Relaxed fit",
      "Professional suede clean only",
    ],
    stock: 7,
    sizes: apparelSizes(["S"]),
  },
  {
    slug: "pearl-strand-necklace",
    name: "Pearl Strand Necklace",
    category: "jewelry",
    price: 76000,
    image: unsplash(IMG.pearl),
    alt: "Pearl necklace laid in an open jewelry box",
    gallery: [
      { src: detail(IMG.pearl, 0.5, 0.4, 2.2), alt: "Hand-knotted freshwater pearls" },
      { src: detail(IMG.pearl, 0.5, 0.65, 2.6), alt: "Pavé crystal clasp" },
    ],
    color: "White",
    description:
      "A single strand of freshwater pearls, individually knotted on silk and closed with a sculpted pavé clasp.",
    details: [
      "Freshwater pearls, 7–8 mm",
      "Hand-knotted on silk thread",
      "Sterling silver pavé clasp",
      "Length 45 cm",
    ],
    stock: 0,
  },
  {
    slug: "blush-chain-shoulder-bag",
    name: "Blush Chain Shoulder Bag",
    category: "bags",
    price: 245000,
    image: unsplash(IMG.blush),
    alt: "Blush leather shoulder bag with a chain strap",
    gallery: [
      { src: detail(IMG.blush, 0.5, 0.4, 2.2), alt: "Chevron inlay on the flap" },
      { src: detail(IMG.blush, 0.5, 0.65, 2.6), alt: "Grained leather surface" },
    ],
    color: "Blush",
    description:
      "A slim flap bag in grained calfskin with a chevron inlay, hung from a fine sliding chain that wears on the shoulder or across the body.",
    details: [
      "Grained calfskin with inlay",
      "Sliding chain strap",
      "Magnetic flap closure",
      "W 22 × H 14 × D 6 cm",
      "Made in Italy",
    ],
    stock: 11,
  },
  {
    slug: "nylon-city-backpack",
    name: "Nylon City Backpack",
    category: "bags",
    price: 135000,
    image: unsplash(IMG.backpack),
    alt: "Navy nylon backpack standing on a pale floor",
    gallery: [
      { src: detail(IMG.backpack, 0.5, 0.4, 2.2), alt: "Top handle and zip opening" },
      { src: detail(IMG.backpack, 0.5, 0.65, 2.6), alt: "Front pocket detail" },
    ],
    color: "Midnight",
    description:
      "A clean-lined backpack in recycled technical nylon with a padded laptop sleeve and leather-trimmed details.",
    details: [
      "Recycled technical nylon",
      "Padded sleeve fits a 15\" laptop",
      "Water-repellent finish",
      "W 30 × H 42 × D 14 cm",
    ],
    stock: 18,
  },
  {
    slug: "suede-brogue",
    name: "Suede Brogue",
    category: "shoes",
    price: 89000,
    image: unsplash(IMG.brogue),
    alt: "Green suede brogue on a pastel plinth",
    gallery: [
      { src: detail(IMG.brogue, 0.5, 0.65, 2.6), alt: "Brogue punching on the toe cap" },
    ],
    color: "Sage",
    description:
      "A laceless brogue in soft sage suede with traditional wingtip punching, built on a flexible leather sole.",
    details: [
      "Calf suede upper",
      "Leather lining and sole",
      "Blake-stitched construction",
      "Runs half a size large",
    ],
    stock: 5,
    sizes: shoeSizes(["40", "41"]),
  },
  {
    slug: "sapphire-drop-earrings",
    name: "Sapphire Drop Earrings",
    category: "jewelry",
    price: 64000,
    image: unsplash(IMG.earrings),
    alt: "Sapphire drop earrings on a green leaf",
    gallery: [
      { src: detail(IMG.earrings, 0.5, 0.4, 2.2), alt: "Pear-cut blue stone" },
      { src: detail(IMG.earrings, 0.5, 0.65, 2.6), alt: "Baguette crystal halo" },
    ],
    color: "Sapphire",
    description:
      "Statement drops with a pear-cut blue stone framed by baguette crystals, set in rhodium-plated brass.",
    details: [
      "Rhodium-plated brass",
      "Glass stone and crystals",
      "Post back for pierced ears",
      "Drop 4.5 cm",
    ],
    stock: 1,
  },
  {
    slug: "crescent-pendant-necklace",
    name: "Crescent Pendant Necklace",
    category: "jewelry",
    price: 42000,
    image: unsplash(IMG.pendant),
    alt: "Gold chain necklace with a crescent pendant",
    gallery: [
      { src: detail(IMG.pendant, 0.5, 0.4, 2.2), alt: "Faceted teal stone" },
      { src: detail(IMG.pendant, 0.5, 0.65, 2.6), alt: "Studded crescent pendant" },
    ],
    color: "Gold",
    description:
      "Two layered chains in gold vermeil: one with a faceted teal stone, one with a studded crescent.",
    details: [
      "18k gold vermeil on sterling silver",
      "Lengths 42 cm and 50 cm",
      "Lobster clasp",
    ],
    stock: 16,
  },
  {
    slug: "chambray-dot-shirt",
    name: "Chambray Dot Shirt",
    category: "ready-to-wear",
    price: 54000,
    image: unsplash(IMG.denim),
    alt: "Blue chambray shirt with a small dot print on a hanger",
    gallery: [
      { src: detail(IMG.denim, 0.5, 0.65, 2.6), alt: "Dot print and mother-of-pearl buttons" },
      { src: detail(IMG.denim, 0.3, 0.55, 2.6), alt: "Sleeve and cuff" },
    ],
    color: "Indigo",
    description:
      "A soft chambray shirt with a tiny woven dot, cut with a relaxed body and finished with mother-of-pearl buttons.",
    details: [
      "100% cotton chambray",
      "Mother-of-pearl buttons",
      "Relaxed fit",
      "Machine wash cold",
    ],
    stock: 12,
    sizes: apparelSizes(),
  },
  {
    slug: "silk-jogger-trouser",
    name: "Silk Jogger Trouser",
    category: "ready-to-wear",
    price: 86000,
    image: unsplash(IMG.trousers),
    alt: "Model wearing blush silk jogger trousers",
    gallery: [
      { src: detail(IMG.trousers, 0.5, 0.4, 2.2), alt: "Elasticated waist and patch pocket" },
      { src: detail(IMG.trousers, 0.5, 0.65, 2.6), alt: "Gathered cuff" },
    ],
    color: "Blush",
    description:
      "Fluid silk crêpe trousers with a soft elasticated waist and gathered cuffs, made to move between day and evening.",
    details: [
      "100% silk crêpe",
      "Elasticated waist, side pockets",
      "Relaxed leg with gathered cuff",
      "Dry clean only",
    ],
    stock: 8,
    sizes: apparelSizes(["XS"]),
  },
];

export const categories: SeedCategory[] = [
  {
    slug: "bags",
    name: "Bags",
    image: unsplash(IMG.riviera),
    alt: "Cognac woven leather bag with a chain strap",
  },
  {
    slug: "shoes",
    name: "Shoes",
    image: unsplash("1560343090-f0409e92791a"),
    alt: "Green suede brogue on a pastel plinth",
  },
  {
    slug: "jewelry",
    name: "Jewelry",
    image: unsplash("1535632066927-ab7c9ab60908"),
    alt: "Sapphire drop earrings on a green leaf",
  },
  {
    slug: "eyewear",
    name: "Eyewear",
    image: unsplash("1511499767150-a48a237f0083"),
    alt: "Round gold-framed sunglasses",
  },
  { slug: "ready-to-wear", name: "Ready-to-wear" },
];
