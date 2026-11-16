import { Hero } from "@/components/storefront/hero";
import {
  BagsEdit,
  CraftStory,
  FeaturedCollections,
  Manifesto,
  NewArrivals,
  Services,
  ShopByCategory,
} from "@/components/storefront/sections";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Manifesto />
      <FeaturedCollections />
      <NewArrivals />
      <BagsEdit />
      <CraftStory />
      <ShopByCategory />
      <Services />
    </main>
  );
}
