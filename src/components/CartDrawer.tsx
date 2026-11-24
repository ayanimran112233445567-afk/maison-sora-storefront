"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/data/products";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    totalAmount,
    freeShippingThreshold,
    freeShippingRemaining,
    appliedPromo,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    getVariantStock,
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  if (!isCartOpen) return null;

  const progressPct = Math.min(
    100,
    ((subtotal - discountAmount) / freeShippingThreshold) * 100
  );

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.ok) setPromoInput("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/45 backdrop-blur-[2px] animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-Over Panel */}
      <aside className="relative z-10 w-full max-w-md bg-canvas h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-editorial text-2xl tracking-wide text-ink">
              Shopping Bag
            </h2>
            <span className="text-xs tracking-[0.14em] uppercase text-muted">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 -mr-2 text-ink hover:text-muted transition-colors cursor-pointer"
            aria-label="Close shopping bag"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Complimentary Shipping Progress Bar */}
        {cart.length > 0 && (
          <div className="px-6 py-3.5 bg-surface border-b border-hairline">
            <div className="flex items-center gap-2 text-xs text-ink-soft mb-2">
              <Truck className="w-3.5 h-3.5 stroke-[1.5] shrink-0" />
              {freeShippingRemaining === 0 ||
              appliedPromo?.type === "free_shipping" ? (
                <span>
                  You have unlocked{" "}
                  <strong className="font-medium text-ink">
                    Complimentary Express Courier
                  </strong>
                  .
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong className="font-medium text-ink">
                    {formatCurrency(freeShippingRemaining)}
                  </strong>{" "}
                  more for complimentary express shipping.
                </span>
              )}
            </div>
            <div className="w-full h-1 bg-surface-deep overflow-hidden">
              <div
                className="h-full bg-ink transition-all duration-500"
                style={{
                  width: `${
                    appliedPromo?.type === "free_shipping" ? 100 : progressPct
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-5">
                <ShoppingBag className="w-6 h-6 stroke-[1.25] text-muted" />
              </div>
              <p className="font-editorial text-2xl text-ink mb-2">
                Your bag is empty
              </p>
              <p className="text-sm text-muted max-w-xs mb-8">
                Explore our Autumn/Winter 2026 tailoring, cashmere knitwear, and
                architectural outerwear.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-canvas text-xs tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors"
              >
                Explore Collection
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {cart.map((item) => {
                const maxStock = getVariantStock(
                  item.productId,
                  item.size,
                  item.colorSlug
                );
                return (
                  <li key={item.key} className="py-5 first:pt-0 flex gap-4">
                    <Link
                      href={`/product/${item.productId}`}
                      onClick={closeCart}
                      className="relative w-20 h-28 bg-surface shrink-0 overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.productId}`}
                            onClick={closeCart}
                            className="text-sm font-medium text-ink hover:underline underline-offset-4 truncate"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            className="text-muted hover:text-danger transition-colors p-0.5 cursor-pointer"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>

                        <div className="mt-1.5 flex items-center gap-2.5 text-xs text-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-hairline"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            {item.colorName}
                          </span>
                          <span>·</span>
                          <span>Size {item.size}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center border border-hairline">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                            disabled={item.quantity >= maxStock}
                            className="w-7 h-7 flex items-center justify-center text-ink hover:bg-surface disabled:opacity-35 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-ink">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-muted">
                              {formatCurrency(item.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer: Promo Code Engine + Running Subtotal + Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-hairline px-6 py-5 bg-surface/60 space-y-4">
            {/* Promo Code Validation */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-canvas border border-hairline px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-ink">
                    <Check className="w-3.5 h-3.5 text-accent" />
                    <span className="font-medium tracking-wider uppercase">
                      {appliedPromo.code}
                    </span>
                    <span className="text-muted hidden sm:inline">
                      — {appliedPromo.description}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removePromoCode();
                      setPromoFeedback(null);
                    }}
                    className="text-muted hover:text-ink underline underline-offset-2 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. ATELIER20)"
                      className="w-full pl-9 pr-3 py-2 bg-canvas border border-hairline text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-ink text-xs tracking-[0.14em] uppercase text-ink hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoFeedback && !appliedPromo && (
                <p
                  className={`mt-1.5 text-[11px] ${
                    promoFeedback.ok ? "text-accent" : "text-danger"
                  }`}
                >
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-ink">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Privilege Discount ({appliedPromo?.code})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Express Courier</span>
                <span className="text-ink">
                  {shippingCost === 0
                    ? "Complimentary"
                    : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium text-ink pt-2.5 border-t border-hairline">
                <span>Estimated Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-3.5 px-6 bg-ink text-canvas text-xs tracking-[0.18em] uppercase flex items-center justify-center gap-2 hover:bg-ink-soft transition-colors"
              >
                Proceed to Secure Checkout
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="w-full py-2.5 text-[11px] tracking-[0.16em] uppercase text-muted hover:text-ink transition-colors cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
