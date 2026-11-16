import { Container } from "@/components/ui";

/** Grey bar standing in for a line of text. */
function Bar({ className }: { className: string }) {
  return <div className={`bg-canvas ${className}`} />;
}

/**
 * Placeholder with the same geometry as the product page, shown while the
 * route's params resolve so navigation paints immediately without layout shift.
 */
export function ProductSkeleton() {
  return (
    <Container aria-busy="true" aria-label="Loading product">
      <div className="py-4 lg:py-6">
        <Bar className="h-4 w-48" />
      </div>
      <div className="grid gap-8 pb-section motion-safe:animate-pulse lg:grid-cols-[minmax(0,1.4fr)_minmax(22rem,1fr)] lg:gap-12 xl:gap-20">
        <div className="-mx-(--gutter) grid auto-cols-[86%] grid-flow-col gap-1 overflow-hidden px-(--gutter) sm:auto-cols-[60%] lg:mx-0 lg:grid-flow-row lg:grid-cols-2 lg:gap-2 lg:px-0">
          <div className="aspect-product bg-canvas lg:col-span-2" />
          <div className="aspect-product bg-canvas" />
          <div className="aspect-product bg-canvas" />
        </div>
        <div className="flex flex-col gap-4">
          <Bar className="h-3 w-24" />
          <Bar className="h-9 w-3/4" />
          <Bar className="h-6 w-28" />
          <Bar className="h-4 w-20" />
          <Bar className="mt-6 h-12 w-full" />
        </div>
      </div>
    </Container>
  );
}
