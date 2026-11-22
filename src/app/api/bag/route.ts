import type { BagProduct } from "@/lib/bag";
import { getProductsBySlugs } from "@/lib/catalog";

/** Bounds the lookup; far more distinct pieces than any real bag holds. */
const MAX_SLUGS = 50;

/**
 * Current catalog data for the slugs in a browser bag:
 * `GET /api/bag?slugs=a,b`. Unknown slugs are omitted from the response.
 */
export async function GET(request: Request) {
  const param = new URL(request.url).searchParams.get("slugs") ?? "";
  const slugs = [...new Set(param.split(",").filter(Boolean))].slice(0, MAX_SLUGS);
  const products = await getProductsBySlugs(slugs);
  return Response.json(
    products.map(
      ({ slug, name, category, price, image, alt, color, stock }): BagProduct => ({
        slug,
        name,
        category,
        price,
        image,
        alt,
        color,
        stock,
      }),
    ),
  );
}
