import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ShopCatalog } from "@/components/ShopCatalog";
import { BRAND_NAME, PRODUCTS, SITE_URL } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All — Luxury Apparel Catalog",
  description:
    "Explore the complete Maison Sora catalog. Filter by category, size, color palette, and price across women's, men's, unisex, and architectural outerwear.",
  openGraph: {
    title: `Shop Collection | ${BRAND_NAME}`,
    description:
      "Minimalist luxury overcoats, Mongolian cashmere knitwear, and tailored Italian wool pieces.",
    url: `${SITE_URL}/shop`,
    images: [
      {
        url: "/images/hero-archive.jpg",
        width: 1200,
        height: 675,
        alt: "Maison Sora Complete Catalog",
      },
    ],
  },
};

export default function ShopPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${BRAND_NAME} Apparel Catalog`,
    url: `${SITE_URL}/shop`,
    numberOfItems: PRODUCTS.length,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PRODUCTS.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/product/${product.id}`,
        name: product.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Suspense
        fallback={
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center text-sm text-muted">
            Loading archive...
          </div>
        }
      >
        <ShopCatalog />
      </Suspense>
    </>
  );
}
