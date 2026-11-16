import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AccordionItem } from "@/components/product/product-accordion";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductSkeleton } from "@/components/product/product-skeleton";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { StockStatus } from "@/components/product/stock-status";
import { ProductRail, Services } from "@/components/storefront/sections";
import { Container, Eyebrow, Heading } from "@/components/ui";
import { getProduct, getProductSlugs, getRelatedProducts } from "@/lib/catalog";
import { formatPrice, getStockState } from "@/lib/products";

type Params = PageProps<"/products/[slug]">["params"];

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: `${product.name} | Atelier`,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}

// `params` is URL data: awaiting it at the top level would block navigation
// until the slug resolves. Only `ProductDetail` reads it, behind Suspense, so
// the shell (skeleton + services) renders instantly on navigation.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <main className="flex-1">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
      <Services />
    </main>
  );
}

async function ProductDetail({ params }: { params: Params }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const stock = getStockState(product);
  const categoryHref = `/collections/${product.categorySlug}`;

  return (
    <>
      <Container>
        <nav aria-label="Breadcrumb" className="py-4 lg:py-6">
          <ol role="list" className="flex flex-wrap items-center gap-2 text-caption text-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={categoryHref} className="hover:text-ink">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 pb-section lg:grid-cols-[minmax(0,1.4fr)_minmax(22rem,1fr)] lg:gap-12 xl:gap-20">
          <ProductGallery product={product} />

          <div>
            <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div className="flex flex-col gap-3">
                <Eyebrow>
                  <Link href={categoryHref} className="link-reveal">
                    {product.category}
                  </Link>
                  {product.badge && <span className="text-ink"> · {product.badge}</span>}
                </Eyebrow>
                <Heading as="h1" size="headline">
                  {product.name}
                </Heading>
                <p className="text-title">{formatPrice(product.price)}</p>
                <StockStatus state={stock} />
              </div>

              <p className="eyebrow">
                <span className="text-muted">Color — </span>
                {product.color}
              </p>

              <PurchasePanel sizes={product.sizes} stock={stock} />

              <ul role="list" className="flex flex-col gap-2 border-t pt-6 text-caption text-muted">
                <li>Complimentary express shipping and returns</li>
                <li>Signature gift packaging on every order</li>
                <li>Free returns within 30 days</li>
              </ul>

              <div className="border-t">
                <AccordionItem title="Description" defaultOpen>
                  <p>{product.description}</p>
                </AccordionItem>
                <AccordionItem title="Details & care">
                  <ul role="list" className="flex flex-col gap-1.5">
                    {product.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </AccordionItem>
                <AccordionItem title="Shipping & returns">
                  <p>
                    Orders ship within one business day by express courier, packed in
                    our signature box. Return any unworn piece within 30 days for a
                    full refund.
                  </p>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <ProductRail
        divided
        eyebrow="Complete the look"
        title="You May Also Like"
        products={await getRelatedProducts(product)}
      />
    </>
  );
}
