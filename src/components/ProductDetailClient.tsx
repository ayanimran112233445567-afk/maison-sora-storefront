"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { SIZES, formatCurrency, getDiscountPercent } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import type { ApparelSize, Product } from "@/types/ecommerce";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    getVariantStock,
    getRemainingStock,
  } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColorSlug, setSelectedColorSlug] = useState(
    product.colors[0].slug
  );

  // Pick first in-stock size for default color
  const defaultSize =
    product.variants.find(
      (v) => v.colorSlug === product.colors[0].slug && v.stock > 0
    )?.size ?? "M";
  const [selectedSize, setSelectedSize] = useState<ApparelSize>(defaultSize);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  // Interactive High-Definition Zoom state (Desktop side-by-side magnification)
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoomed, setLightboxZoomed] = useState(false);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    "craftsmanship"
  );

  // Touch swipe tracking for mobile gallery
  const touchStartX = useRef<number | null>(null);

  const activeImage = product.images[selectedImageIdx] ?? product.images[0];
  const selectedColor =
    product.colors.find((c) => c.slug === selectedColorSlug) ??
    product.colors[0];
  const currentStock = getVariantStock(
    product.id,
    selectedSize,
    selectedColorSlug
  );
  const remainingStock = getRemainingStock(
    product.id,
    selectedSize,
    selectedColorSlug
  );
  const wishlisted = isWishlisted(product.id);
  const discountPct = getDiscountPercent(product.price, product.originalPrice);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
    );
    setZoomPos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        setSelectedImageIdx((prev) => (prev + 1) % product.images.length);
      } else {
        setSelectedImageIdx(
          (prev) => (prev - 1 + product.images.length) % product.images.length
        );
      }
    }
    touchStartX.current = null;
  };

  const handleColorChange = (slug: string) => {
    setSelectedColorSlug(slug);
    setFeedback(null);
    // If current selected size is out of stock in the new color, auto-select an available size
    if (getVariantStock(product.id, selectedSize, slug) <= 0) {
      const available = SIZES.find(
        (s) => getVariantStock(product.id, s, slug) > 0
      );
      if (available) setSelectedSize(available);
    }
  };

  const handleAddToCart = () => {
    const res = addToCart(product, selectedSize, selectedColorSlug, 1);
    setFeedback(res);
  };

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-28 lg:pb-20">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted mb-8"
        >
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-ink transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ink truncate">{product.name}</span>
        </nav>

        {/* Main PDP Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 relative">
          {/* Left Column: Multi-Angle Thumbnail Gallery + HD Zoom Stage */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Multi-Angle Thumbnails */}
            <div className="flex sm:flex-col gap-3 sm:w-24 shrink-0 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
              {product.images.map((img, idx) => {
                const active = idx === selectedImageIdx;
                return (
                  <button
                    key={`${img.url}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    aria-label={`View ${img.angle} angle`}
                    className={`relative w-20 sm:w-full aspect-[3/4] bg-surface overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      active
                        ? "border-ink opacity-100"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <span className="absolute bottom-1 inset-x-1 bg-canvas/85 text-[9px] tracking-[0.14em] uppercase text-ink text-center py-0.5">
                      {img.angle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Primary High-Definition Interactive Stage */}
            <div className="flex-1 relative">
              <div
                className="relative aspect-[3/4] bg-surface overflow-hidden cursor-crosshair select-none group"
                onMouseEnter={() => setIsHoverZoom(true)}
                onMouseLeave={() => setIsHoverZoom(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-center"
                />

                {/* Desktop Precision Zoom Lens Reticle */}
                {isHoverZoom && (
                  <div
                    className="hidden lg:block absolute w-36 h-36 border border-canvas/90 bg-canvas/15 backdrop-blur-[1px] pointer-events-none shadow-lg"
                    style={{
                      left: `calc(${zoomPos.x}% - 72px)`,
                      top: `calc(${zoomPos.y}% - 72px)`,
                    }}
                  />
                )}

                {/* Zoom Hint & Fullscreen Lightbox Trigger */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-canvas/90 backdrop-blur-sm text-[10px] tracking-[0.16em] uppercase text-ink">
                    <ZoomIn className="w-3.5 h-3.5" />
                    Hover to inspect fabric weave
                  </span>
                  <span className="lg:hidden px-2.5 py-1 bg-canvas/90 text-[10px] tracking-[0.16em] uppercase text-ink">
                    {selectedImageIdx + 1} / {product.images.length} · Swipe
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="pointer-events-auto p-2.5 bg-canvas/90 backdrop-blur-sm text-ink hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
                    aria-label="Open full-screen high-definition zoom"
                  >
                    <Maximize2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>

                {/* Mobile Swipe Prev/Next Controls */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIdx(
                      (prev) =>
                        (prev - 1 + product.images.length) %
                        product.images.length
                    )
                  }
                  aria-label="Previous angle"
                  className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-canvas/80 flex items-center justify-center text-ink"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIdx(
                      (prev) => (prev + 1) % product.images.length
                    )
                  }
                  aria-label="Next angle"
                  className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-canvas/80 flex items-center justify-center text-ink"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Side-by-Side Zoom Magnifier Portal OR Product Specs */}
          <div className="lg:col-span-5 relative">
            {/* Desktop Side-by-Side High-Definition Zoom Magnification Panel */}
            {isHoverZoom && (
              <div
                aria-hidden="true"
                className="hidden lg:block absolute inset-0 z-30 bg-surface border border-hairline shadow-2xl overflow-hidden animate-fade-in"
              >
                <div
                  className="w-full h-full bg-no-repeat"
                  style={{
                    backgroundImage: `url(${activeImage.url})`,
                    backgroundSize: "260%",
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-ink/85 text-canvas text-[10px] tracking-[0.18em] uppercase">
                  2.6× High-Definition Textile Magnification · {activeImage.angle}
                </div>
              </div>
            )}

            {/* Product Details Panel */}
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Header & Pricing */}
              <div className="space-y-2 pb-6 border-b border-hairline">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-muted">
                    {product.category} · {product.subtitle}
                  </span>
                  {discountPct && (
                    <span className="px-2.5 py-0.5 bg-ink text-canvas text-[10px] tracking-[0.16em] uppercase">
                      Save {discountPct}%
                    </span>
                  )}
                </div>

                <h1 className="font-editorial text-4xl sm:text-[42px] font-light leading-[1.1] text-ink">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl font-normal text-ink">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-muted line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-ink-soft leading-relaxed pt-2">
                  {product.description}
                </p>
              </div>

              {/* Color Swatch Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="tracking-[0.16em] uppercase text-muted">
                    Color
                  </span>
                  <span className="font-medium text-ink">
                    {selectedColor.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const active = color.slug === selectedColorSlug;
                    return (
                      <button
                        key={color.slug}
                        type="button"
                        onClick={() => handleColorChange(color.slug)}
                        aria-label={`Select color ${color.name}`}
                        className={`w-9 h-9 rounded-full p-[3px] border transition-colors cursor-pointer ${
                          active
                            ? "border-ink"
                            : "border-hairline hover:border-muted"
                        }`}
                      >
                        <span
                          className="block w-full h-full rounded-full border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector + Real-Time Inventory Indicator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="tracking-[0.16em] uppercase text-muted">
                    Select Size
                  </span>
                  <span className="text-muted">Relaxed Italian Sizing</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {SIZES.map((size) => {
                    const stock = getVariantStock(
                      product.id,
                      size,
                      selectedColorSlug
                    );
                    const outOfStock = stock <= 0;
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={outOfStock}
                        onClick={() => {
                          setSelectedSize(size);
                          setFeedback(null);
                        }}
                        className={`py-3 text-xs tracking-[0.14em] uppercase border transition-colors ${
                          outOfStock
                            ? "border-hairline text-muted/40 line-through bg-surface/50 cursor-not-allowed"
                            : active
                              ? "bg-ink text-canvas border-ink font-medium cursor-pointer"
                              : "bg-canvas text-ink border-hairline hover:border-ink cursor-pointer"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Live Stock Status Badge */}
                <div className="pt-1 flex items-center gap-2 text-xs">
                  {currentStock <= 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-danger font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Out of stock in {selectedColor.name} / Size {selectedSize}
                    </span>
                  ) : remainingStock <= 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-accent font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      All {currentStock} remaining units are currently in your
                      bag
                    </span>
                  ) : currentStock <= 3 ? (
                    <span className="inline-flex items-center gap-1.5 text-danger font-medium">
                      <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                      Only {currentStock} left in stock — reserve yours now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-ink-soft">
                      <Check className="w-3.5 h-3.5 text-accent" />
                      In Stock ({currentStock} available) · Dispatches within 24h
                    </span>
                  )}
                </div>
              </div>

              {/* Primary Add-to-Cart + Wishlist CTA */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={currentStock <= 0 || remainingStock <= 0}
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 bg-ink text-canvas text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 hover:bg-ink-soft disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                  {currentStock <= 0
                    ? "Out of Stock"
                    : remainingStock <= 0
                      ? "Max Quantity in Bag"
                      : `Add to Bag — ${formatCurrency(product.price)}`}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={
                    wishlisted ? "Remove from saved pieces" : "Save garment"
                  }
                  className="w-14 border border-hairline flex items-center justify-center text-ink hover:border-ink transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 stroke-[1.5] ${
                      wishlisted ? "fill-ink text-ink" : ""
                    }`}
                  />
                </button>
              </div>

              {feedback && !feedback.ok && (
                <p className="text-xs text-danger">{feedback.message}</p>
              )}

              {/* Value Assurances */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 stroke-[1.3] text-ink shrink-0" />
                  <span>Free express shipping over $350</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 stroke-[1.3] text-ink shrink-0" />
                  <span>30-day complimentary returns</span>
                </div>
              </div>

              {/* Collapsible Atelier Specification Accordions */}
              <div className="pt-4 border-t border-hairline divide-y divide-hairline">
                {/* Craftsmanship */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "craftsmanship"
                          ? null
                          : "craftsmanship"
                      )
                    }
                    className="w-full py-4 flex items-center justify-between text-xs tracking-[0.18em] uppercase text-ink cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-muted" />
                      Atelier Craftsmanship
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openAccordion === "craftsmanship" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === "craftsmanship" && (
                    <ul className="pb-4 space-y-2 text-xs text-muted list-disc pl-5 leading-relaxed">
                      {product.craftsmanship.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Composition & Care */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "care" ? null : "care"
                      )
                    }
                    className="w-full py-4 flex items-center justify-between text-xs tracking-[0.18em] uppercase text-ink cursor-pointer"
                  >
                    <span>Composition &amp; Care</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openAccordion === "care" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === "care" && (
                    <div className="pb-4 space-y-2 text-xs text-muted leading-relaxed">
                      <p className="text-ink font-medium">
                        {product.composition}
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.care.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Fit & Sizing */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(openAccordion === "fit" ? null : "fit")
                    }
                    className="w-full py-4 flex items-center justify-between text-xs tracking-[0.18em] uppercase text-ink cursor-pointer"
                  >
                    <span>Fit &amp; Proportions</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openAccordion === "fit" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordion === "fit" && (
                    <p className="pb-4 text-xs text-muted leading-relaxed">
                      {product.fitNotes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Pieces Section */}
        <section className="mt-24 pt-16 border-t border-hairline">
          <div className="mb-10">
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-2">
              Complete the Silhouette
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl font-light text-ink">
              You May Also Consider
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Bottom Sticky Add-to-Cart CTA Bar (One-Handed Purchasing) */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-canvas/95 backdrop-blur-md border-t border-hairline px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink truncate">
            {product.name}
          </p>
          <p className="text-xs text-muted">
            {formatCurrency(product.price)} · Size {selectedSize} ·{" "}
            {selectedColor.name}
          </p>
        </div>
        <button
          type="button"
          disabled={currentStock <= 0 || remainingStock <= 0}
          onClick={handleAddToCart}
          className="px-5 py-3 bg-ink text-canvas text-[11px] tracking-[0.18em] uppercase shrink-0 disabled:opacity-45"
        >
          {currentStock <= 0 ? "Sold Out" : "Add to Bag"}
        </button>
      </div>

      {/* Fullscreen High-Definition Zoom Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="High-definition garment inspection"
        >
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-10">
            <button
              type="button"
              onClick={() => setLightboxZoomed((z) => !z)}
              className="px-3.5 py-2 bg-canvas/15 text-canvas text-xs tracking-[0.16em] uppercase hover:bg-canvas/25 transition-colors cursor-pointer"
            >
              {lightboxZoomed ? "Fit to Screen" : "2× Zoom"}
            </button>
            <button
              type="button"
              onClick={() => {
                setLightboxOpen(false);
                setLightboxZoomed(false);
              }}
              className="p-2.5 bg-canvas/15 text-canvas hover:bg-canvas/25 transition-colors cursor-pointer"
              aria-label="Close zoom lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative w-full max-w-4xl h-[80vh] overflow-auto flex items-center justify-center"
            onClick={() => setLightboxZoomed((z) => !z)}
          >
            <div
              className={`relative transition-transform duration-300 cursor-zoom-in ${
                lightboxZoomed
                  ? "w-[160%] h-[160%] cursor-zoom-out"
                  : "w-full h-full"
              }`}
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          <p className="mt-4 text-xs tracking-[0.16em] uppercase text-canvas/70">
            {product.name} — {activeImage.angle} View
          </p>
        </div>
      )}
    </>
  );
}
