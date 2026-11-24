"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS, formatCurrency } from "@/data/products";

export function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    closeWishlist,
    toggleWishlist,
    addToCart,
    getVariantStock,
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Saved pieces"
    >
      <div
        className="fixed inset-0 bg-ink/45 backdrop-blur-[2px] animate-fade-in"
        onClick={closeWishlist}
      />

      <aside className="relative z-10 w-full max-w-md bg-canvas h-full flex flex-col shadow-2xl animate-slide-in-right">
        <div className="px-6 py-5 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-editorial text-2xl text-ink">Saved Pieces</h2>
            <span className="text-xs tracking-[0.14em] uppercase text-muted">
              ({savedProducts.length})
            </span>
          </div>
          <button
            type="button"
            onClick={closeWishlist}
            className="p-2 -mr-2 text-ink hover:text-muted transition-colors cursor-pointer"
            aria-label="Close saved pieces"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-5">
                <Heart className="w-6 h-6 stroke-[1.25] text-muted" />
              </div>
              <p className="font-editorial text-2xl text-ink mb-2">
                No saved garments yet
              </p>
              <p className="text-sm text-muted max-w-xs mb-6">
                Tap the heart icon on any piece to curate your personal seasonal
                wardrobe.
              </p>
              <Link
                href="/shop"
                onClick={closeWishlist}
                className="px-7 py-3.5 bg-ink text-canvas text-xs tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors"
              >
                Discover Collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {savedProducts.map((product) => {
                const defaultColor = product.colors[0];
                const firstInStockVariant = product.variants.find(
                  (v) =>
                    v.colorSlug === defaultColor.slug &&
                    getVariantStock(product.id, v.size, v.colorSlug) > 0
                );

                return (
                  <li key={product.id} className="py-5 first:pt-0 flex gap-4">
                    <Link
                      href={`/product/${product.id}`}
                      onClick={closeWishlist}
                      className="relative w-20 h-28 bg-surface shrink-0 overflow-hidden"
                    >
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${product.id}`}
                            onClick={closeWishlist}
                            className="text-sm font-medium text-ink hover:underline underline-offset-4"
                          >
                            {product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="text-muted hover:text-danger transition-colors cursor-pointer"
                            aria-label={`Remove ${product.name} from saved pieces`}
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                        <p className="text-xs text-muted mt-1">
                          {product.subtitle}
                        </p>
                        <p className="text-sm font-medium text-ink mt-1.5">
                          {formatCurrency(product.price)}
                        </p>
                      </div>

                      <div className="mt-3">
                        {firstInStockVariant ? (
                          <button
                            type="button"
                            onClick={() =>
                              addToCart(
                                product,
                                firstInStockVariant.size,
                                defaultColor.slug,
                                1
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 border border-ink text-[11px] tracking-[0.15em] uppercase text-ink hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Add Size {firstInStockVariant.size} to Bag
                          </button>
                        ) : (
                          <span className="text-xs text-muted uppercase tracking-wider">
                            Currently Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
