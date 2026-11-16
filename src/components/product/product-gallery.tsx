import Image from "next/image";

import type { Product } from "@/lib/products";

/**
 * Product imagery. Below `lg` it is an edge-to-edge swipe carousel; from `lg`
 * the lead image runs full width and detail shots follow in pairs (an
 * unpaired last image also runs full width).
 */
export function ProductGallery({ product }: { product: Product }) {
  const images = [{ src: product.image, alt: product.alt }, ...product.gallery];

  return (
    <ul
      role="list"
      aria-label={`${product.name} images`}
      tabIndex={0}
      className="-mx-(--gutter) grid snap-x snap-mandatory auto-cols-[86%] grid-flow-col gap-1 overflow-x-auto scroll-px-(--gutter) px-(--gutter) [scrollbar-width:none] sm:auto-cols-[60%] lg:mx-0 lg:snap-none lg:grid-flow-row lg:grid-cols-2 lg:gap-2 lg:overflow-visible lg:px-0 lg:[&>li:first-child]:col-span-2 lg:[&>li:last-child:nth-child(even)]:col-span-2"
    >
      {images.map((image, index) => (
        <li key={image.src} className="snap-start">
          <div className="media-frame">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload={index === 0}
              sizes={
                index === 0
                  ? "(min-width: 64rem) 58vw, (min-width: 40rem) 60vw, 86vw"
                  : "(min-width: 64rem) 29vw, (min-width: 40rem) 60vw, 86vw"
              }
              className="object-cover"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
