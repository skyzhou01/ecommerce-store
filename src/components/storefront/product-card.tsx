import Image from "next/image";
import Link from "next/link";

import { formatPrice, getStockState, type Product } from "@/lib/products";

export function ProductCard({
  product,
  sizes,
}: {
  product: Product;
  /** `sizes` hint for the image; match it to the containing grid/rail. */
  sizes: string;
}) {
  const soldOut = getStockState(product).status === "sold-out";
  const badge = soldOut ? "Sold out" : product.badge;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="media-frame">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes={sizes}
          className="object-cover mix-blend-multiply"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-paper px-2 py-1 text-micro font-medium uppercase">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1 pr-2">
        <p className="text-caption text-muted">{product.category}</p>
        <h3 className="font-sans text-body group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        <p className="text-body">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
