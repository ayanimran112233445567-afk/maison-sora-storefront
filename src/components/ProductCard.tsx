"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { SIZES, formatCurrency, getDiscountPercent } from "@/data/products";
import type { ApparelSize, Product } from "@/types/ecommerce";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, getVariantStock } =
    useStore();
  const [selectedColorSlug, setSelectedColorSlug] = useState(
    product.colors[0].slug
  );
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const discountPct = getDiscountPercent(product.price, product.originalPrice);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? product.images[0];

  const handleQuickAdd = (size: ApparelSize, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, selectedColorSlug, 1);
    setQuickAddOpen(false);
  };

  return (
    <article className="group flex flex-col">
      {/* Media Frame with Hover-to-Secondary-Image Swap */}
      <div className="relative aspect-[3/4] bg-surface overflow-hidden">
        <Link
          href={`/product/${product.id}`}
          className="block w-full h-full relative"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-opacity duration-700 ease-out group-hover:opacity-0"
          />
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.alt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center opacity-0 scale-[1.03] transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {discountPct && (
            <span className="px-2.5 py-1 bg-ink text-canvas text-[10px] tracking-[0.16em] uppercase">
              -{discountPct}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 bg-canvas/90 backdrop-blur-sm text-ink text-[10px] tracking-[0.16em] uppercase">
              New
            </span>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from saved pieces`
              : `Save ${product.name}`
          }
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-canvas/85 backdrop-blur-sm flex items-center justify-center text-ink hover:bg-canvas transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] transition-colors ${
              wishlisted ? "fill-ink text-ink" : "text-ink"
            }`}
          />
        </button>

        {/* Quick-Add Size Overlay Bar */}
        <div
          className={`absolute inset-x-3 bottom-3 bg-canvas/95 backdrop-blur-md border border-hairline px-3 py-2.5 transition-all duration-300 ${
            quickAddOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[0.18em] uppercase text-muted flex items-center gap-1">
              <Plus className="w-3 h-3" /> Quick Add
            </span>
            <span className="text-[10px] text-muted">
              {
                product.colors.find((c) => c.slug === selectedColorSlug)?.name
              }
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {SIZES.map((size) => {
              const stock = getVariantStock(
                product.id,
                size,
                selectedColorSlug
              );
              const outOfStock = stock <= 0;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  onClick={(e) => handleQuickAdd(size, e)}
                  className={`py-1.5 text-[11px] tracking-wider border transition-colors ${
                    outOfStock
                      ? "border-hairline text-muted/40 line-through cursor-not-allowed"
                      : "border-hairline text-ink hover:bg-ink hover:text-canvas hover:border-ink cursor-pointer"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Quick-Add Trigger */}
        <button
          type="button"
          onClick={() => setQuickAddOpen((v) => !v)}
          className="sm:hidden absolute bottom-3 right-3 px-3 py-1.5 bg-canvas/90 backdrop-blur-sm border border-hairline text-[10px] tracking-[0.16em] uppercase text-ink"
        >
          {quickAddOpen ? "Close" : "+ Quick Add"}
        </button>
      </div>

      {/* Product Info */}
      <div className="pt-4 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${product.id}`}
              className="text-sm font-medium text-ink hover:underline underline-offset-4 block truncate"
            >
              {product.name}
            </Link>
            <p className="text-xs text-muted truncate mt-0.5">
              {product.subtitle}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-medium text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="block text-xs text-muted line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-2 pt-1">
          {product.colors.map((color) => {
            const active = color.slug === selectedColorSlug;
            return (
              <button
                key={color.slug}
                type="button"
                onClick={() => setSelectedColorSlug(color.slug)}
                title={color.name}
                aria-label={`Select color ${color.name}`}
                className={`w-4 h-4 rounded-full p-[2px] border transition-colors cursor-pointer ${
                  active ? "border-ink" : "border-transparent hover:border-muted"
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
    </article>
  );
}
