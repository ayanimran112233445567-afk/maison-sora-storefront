import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BRAND_NAME,
  PRODUCTS,
  SITE_URL,
  formatCurrency,
  getProductById,
  getRelatedProducts,
} from "@/data/products";
import { ProductDetailClient } from "@/components/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Static Site Generation (SSG) for instantaneous PDP loading
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

// Dynamic Open Graph (OG) & Social Preview Metadata
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Garment Not Found" };
  }

  const priceFormatted = formatCurrency(product.price);
  const title = `${product.name} — ${priceFormatted}`;
  const description = `${product.subtitle}. ${product.composition}. ${product.description}`;
  const primaryImage = product.images[0]?.url ?? "/images/hero-autumn.jpg";
  const canonicalUrl = `${SITE_URL}/product/${product.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: BRAND_NAME,
      title: `${product.name} (${priceFormatted}) | ${BRAND_NAME}`,
      description,
      images: [
        {
          url: primaryImage,
          width: 900,
          height: 1200,
          alt: product.images[0]?.alt ?? product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${priceFormatted}`,
      description: `${product.subtitle} · ${product.composition}`,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  // Structured JSON-LD Product Schema (GEO & AEO Discoverability)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.variants[0]?.sku ?? product.id,
    category: `Apparel > ${product.category}`,
    material: product.composition,
    image: product.images.map((img) => `${SITE_URL}${img.url}`),
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `${SITE_URL}/shop?category=${encodeURIComponent(product.category)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/product/${product.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
