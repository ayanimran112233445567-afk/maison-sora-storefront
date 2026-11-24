import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import {
  BRAND_NAME,
  FEATURED_COLLECTIONS,
  PRODUCTS,
  SITE_URL,
} from "@/data/products";

export default function HomePage() {
  const newArrivals = PRODUCTS.slice(0, 4);
  const signatureIcons = PRODUCTS.slice(4, 8);

  // Organization & WebSite JSON-LD Schema for SEO / GEO / AEO
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/hero-autumn.jpg`,
    description:
      "Minimalist luxury fashion house specializing in double-faced Italian wool outerwear, Mongolian cashmere knitwear, and mulberry silk tailoring.",
    sameAs: [
      "https://instagram.com/maisonsora",
      "https://pinterest.com/maisonsora",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* A. Hero Banner Carousel */}
      <HeroCarousel />

      {/* B. Featured Collections Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 lg:pt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-2">
              Curated Departments
            </p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-ink">
              Featured Collections
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-ink hover:text-muted transition-colors"
          >
            View All Garments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {FEATURED_COLLECTIONS.map((col) => {
            const count = PRODUCTS.filter(
              (p) => p.category === col.category
            ).length;
            return (
              <Link
                key={col.category}
                href={col.href}
                className="group relative aspect-[3/4] overflow-hidden bg-surface block"
              >
                <Image
                  src={col.image}
                  alt={`${col.title} Collection — ${col.subtitle}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent transition-opacity duration-500 group-hover:from-ink/80" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-canvas">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-canvas/75 mb-1">
                    {count} {count === 1 ? "Piece" : "Pieces"}
                  </p>
                  <h3 className="font-editorial text-3xl font-light tracking-wide">
                    {col.title}
                  </h3>
                  <p className="text-xs text-canvas/80 mt-1.5 line-clamp-1">
                    {col.subtitle}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-canvas border-b border-canvas/40 pb-1 group-hover:border-canvas transition-colors">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* C. New Arrivals 4-Column Product Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 lg:pt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-2">
              Autumn / Winter &apos;26
            </p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-ink">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-ink hover:text-muted transition-colors"
          >
            Shop Latest <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* D. Editorial Atelier Campaign Split Banner */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-surface border border-hairline overflow-hidden">
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[520px]">
            <Image
              src="/images/hero-archive.jpg"
              alt="Maison Sora textile craftsmanship — folded cashmere, mulberry silk, and virgin wool"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-accent">
              The Material Study
            </p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light leading-[1.1] text-ink">
              Quiet Craft,
              <br />
              Built to Endure.
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Every garment in the Maison Sora archive begins at the fiber
              level—traceable RWS virgin wool from Biella, 4-ply Inner Mongolian
              cashmere, and 30-momme mulberry silk—tailored with unhurried
              precision so each silhouette outlives seasonal cycles.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-canvas text-xs tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors"
              >
                Explore the Archive
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* E. House Signatures Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 lg:pt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-2">
              Permanent Wardrobe
            </p>
            <h2 className="font-editorial text-4xl sm:text-5xl font-light text-ink">
              House Icons
            </h2>
          </div>
          <Link
            href="/shop?sort=popular"
            className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-ink hover:text-muted transition-colors"
          >
            View Bestsellers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {signatureIcons.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* F. Atelier Pillars Strip */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-hairline">
          <div className="space-y-2.5">
            <Sparkles className="w-5 h-5 stroke-[1.3] text-ink" />
            <h3 className="text-xs tracking-[0.16em] uppercase font-medium text-ink">
              Certified Natural Fibers
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              100% traceable RWS virgin wool, Grade-A cashmere, and organic
              Italian gabardine.
            </p>
          </div>
          <div className="space-y-2.5">
            <Truck className="w-5 h-5 stroke-[1.3] text-ink" />
            <h3 className="text-xs tracking-[0.16em] uppercase font-medium text-ink">
              Complimentary Express Courier
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Climate-compensated global express shipping on all orders above
              $350.
            </p>
          </div>
          <div className="space-y-2.5">
            <ShieldCheck className="w-5 h-5 stroke-[1.3] text-ink" />
            <h3 className="text-xs tracking-[0.16em] uppercase font-medium text-ink">
              Encrypted Secure Checkout
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              End-to-end SSL protection with real-time stock reservation and
              instant order tracking.
            </p>
          </div>
          <div className="space-y-2.5">
            <Globe className="w-5 h-5 stroke-[1.3] text-ink" />
            <h3 className="text-xs tracking-[0.16em] uppercase font-medium text-ink">
              30-Day Atelier Returns
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Effortless prepaid returns and complimentary tailoring adjustments
              across flagship studios.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
