"use client";

import { useMemo } from "react";
import { ProductCarousel } from "@/components/shop/product-carousel";
import { ShopBenefits } from "@/components/shop/shop-benefits";
import { ShopExperience } from "@/components/shop/shop-experience";
import { ShopGuarantee } from "@/components/shop/shop-guarantee";
import { ShopHero } from "@/components/shop/shop-hero";
import type { Product } from "@/lib/types";

interface PublicProductsViewProps {
  products: Product[];
}

export function PublicProductsView({ products }: PublicProductsViewProps) {
  const normalizedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      currency: product.currency || "IRR",
    }));
  }, [products]);

  return (
    <div className="space-y-16 py-10">
      <ShopHero />
      <ProductCarousel products={normalizedProducts} />
      <ShopBenefits />
      <ShopExperience />
      <ShopGuarantee />
    </div>
  );
}
