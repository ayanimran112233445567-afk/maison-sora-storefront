"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/data/products";
import type { OrderRecord, ShippingAddress } from "@/types/ecommerce";

export function CheckoutClient() {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    totalAmount,
    appliedPromo,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    getVariantStock,
    placeOrder,
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.ok) setPromoInput("");
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!shipping.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email))
      nextErrors.email = "Enter a valid email address.";
    if (!shipping.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!shipping.addressLine1.trim())
      nextErrors.addressLine1 = "Street address is required.";
    if (!shipping.city.trim()) nextErrors.city = "City is required.";
    if (!shipping.state.trim()) nextErrors.state = "State / Province is required.";
    if (!shipping.postalCode.trim())
      nextErrors.postalCode = "Postal code is required.";

    if (!cardholder.trim()) nextErrors.cardholder = "Name on card is required.";
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length < 13 || rawCard.length > 16)
      nextErrors.cardNumber = "Enter a valid 16-digit card number.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry))
      nextErrors.expiry = "Use MM/YY format.";
    if (!/^\d{3,4}$/.test(cvc)) nextErrors.cvc = "Enter 3 or 4 digit CVC.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validateForm()) return;

    setSubmitting(true);
    const rawCard = cardNumber.replace(/\s/g, "");
    const last4 = rawCard.slice(-4) || "4242";

    setTimeout(() => {
      const order = placeOrder(shipping, last4);
      setConfirmedOrder(order);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  // Order Confirmation State
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="bg-surface/60 border border-hairline p-8 sm:p-12 space-y-8">
          <div className="text-center space-y-4 pb-8 border-b border-hairline">
            <div className="w-14 h-14 mx-auto rounded-full bg-ink text-canvas flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-accent">
              Order Confirmed
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl font-light text-ink">
              Thank You, {confirmedOrder.shippingAddress.fullName.split(" ")[0]}.
            </h1>
            <p className="text-sm text-muted max-w-md mx-auto">
              Your garments have been reserved in our atelier. A confirmation
              receipt has been dispatched to{" "}
              <span className="text-ink">
                {confirmedOrder.shippingAddress.email}
              </span>
              .
            </p>
            <div className="inline-block px-5 py-2.5 bg-canvas border border-hairline text-xs tracking-[0.18em] uppercase text-ink">
              Order Reference: <strong>{confirmedOrder.orderNumber}</strong>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="space-y-4">
            <h2 className="text-xs tracking-[0.18em] uppercase text-muted">
              Reserved Garments
            </h2>
            <ul className="divide-y divide-hairline">
              {confirmedOrder.items.map((item) => (
                <li
                  key={item.key}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-[72px] bg-surface shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.colorName} · Size {item.size} · Qty{" "}
                        {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-ink">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping & Totals Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-hairline text-xs">
            <div className="space-y-1.5">
              <p className="tracking-[0.16em] uppercase text-muted mb-2">
                Courier Destination
              </p>
              <p className="text-ink font-medium">
                {confirmedOrder.shippingAddress.fullName}
              </p>
              <p className="text-muted">
                {confirmedOrder.shippingAddress.addressLine1}
                {confirmedOrder.shippingAddress.addressLine2
                  ? `, ${confirmedOrder.shippingAddress.addressLine2}`
                  : ""}
              </p>
              <p className="text-muted">
                {confirmedOrder.shippingAddress.city},{" "}
                {confirmedOrder.shippingAddress.state}{" "}
                {confirmedOrder.shippingAddress.postalCode}
              </p>
              <p className="text-muted">
                {confirmedOrder.shippingAddress.country}
              </p>
              <p className="text-muted pt-1">
                Paid with card ending in •••• {confirmedOrder.paymentLast4}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-ink">
                  {formatCurrency(confirmedOrder.subtotal)}
                </span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount ({confirmedOrder.promoCode})</span>
                  <span>-{formatCurrency(confirmedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Express Courier</span>
                <span className="text-ink">
                  {confirmedOrder.shipping === 0
                    ? "Complimentary"
                    : formatCurrency(confirmedOrder.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Estimated Tax</span>
                <span className="text-ink">
                  {formatCurrency(confirmedOrder.tax)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium text-ink pt-2 border-t border-hairline">
                <span>Total Paid</span>
                <span>{formatCurrency(confirmedOrder.total)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink text-canvas text-xs tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors"
            >
              Continue Exploring Collection
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Bag State
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-surface flex items-center justify-center">
          <ShoppingBag className="w-7 h-7 stroke-[1.25] text-muted" />
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl font-light text-ink">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-muted max-w-md mx-auto">
          Discover our seasonal overcoats, Mongolian cashmere knits, and
          tailored Italian wool trousers.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-canvas text-xs tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors"
        >
          Explore Collection <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16">
      <div className="pb-8 border-b border-hairline flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-muted hover:text-ink mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <h1 className="font-editorial text-4xl sm:text-5xl font-light text-ink">
            Bag &amp; Secure Checkout
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Lock className="w-3.5 h-3.5 text-ink" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left 7 Columns: Bag Review + Shipping + Payment Form */}
        <div className="lg:col-span-7 space-y-12">
          {/* Step 1: Review Bag Items */}
          <section>
            <h2 className="text-xs tracking-[0.2em] uppercase font-medium text-ink mb-5">
              1. Selected Garments ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {cart.map((item) => {
                const maxStock = getVariantStock(
                  item.productId,
                  item.size,
                  item.colorSlug
                );
                return (
                  <li key={item.key} className="py-5 flex gap-4 sm:gap-5">
                    <Link
                      href={`/product/${item.productId}`}
                      className="relative w-20 sm:w-24 aspect-[3/4] bg-surface shrink-0 overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/product/${item.productId}`}
                            className="text-sm sm:text-base font-medium text-ink hover:underline underline-offset-4"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted mt-0.5">
                            {item.subtitle}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-hairline"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span>{item.colorName}</span>
                            <span>·</span>
                            <span>Size {item.size}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="text-muted hover:text-danger p-1 cursor-pointer"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center border border-hairline">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-surface cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                            disabled={item.quantity >= maxStock}
                            className="w-8 h-8 flex items-center justify-center hover:bg-surface disabled:opacity-35 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-sm font-medium text-ink">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Step 2 & 3: Shipping & Encrypted Payment Form */}
          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
            noValidate
            className="space-y-10"
          >
            {/* Shipping Information */}
            <section className="space-y-5">
              <h2 className="text-xs tracking-[0.2em] uppercase font-medium text-ink">
                2. Shipping Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shipping.fullName}
                    onChange={(e) =>
                      setShipping({ ...shipping, fullName: e.target.value })
                    }
                    placeholder="Elena Vance"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-danger">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) =>
                      setShipping({ ...shipping, email: e.target.value })
                    }
                    placeholder="elena@example.com"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-danger">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    placeholder="+1 (212) 555-0194"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-danger">{errors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={shipping.addressLine1}
                    onChange={(e) =>
                      setShipping({ ...shipping, addressLine1: e.target.value })
                    }
                    placeholder="420 Mercer Street"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.addressLine1}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    Apartment / Suite (Optional)
                  </label>
                  <input
                    type="text"
                    value={shipping.addressLine2}
                    onChange={(e) =>
                      setShipping({ ...shipping, addressLine2: e.target.value })
                    }
                    placeholder="Penthouse 4B"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping({ ...shipping, city: e.target.value })
                    }
                    placeholder="New York"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-danger">{errors.city}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping({ ...shipping, state: e.target.value })
                      }
                      placeholder="NY"
                      className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.state && (
                      <p className="mt-1 text-xs text-danger">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={shipping.postalCode}
                      onChange={(e) =>
                        setShipping({ ...shipping, postalCode: e.target.value })
                      }
                      placeholder="10012"
                      className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Encrypted Payment Section */}
            <section className="space-y-5 pt-6 border-t border-hairline">
              <div className="flex items-center justify-between">
                <h2 className="text-xs tracking-[0.2em] uppercase font-medium text-ink">
                  3. Encrypted Payment
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                  <CreditCard className="w-3.5 h-3.5" /> Visa · Mastercard · Amex
                </span>
              </div>

              <div className="p-5 sm:p-6 bg-surface/50 border border-hairline space-y-4">
                <div>
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                    placeholder="ELENA VANCE"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                  />
                  {errors.cardholder && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.cardholder}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    placeholder="4532 8910 2234 4242"
                    className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink tracking-widest focus:outline-none focus:border-ink"
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                      Expiration (MM/YY) *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="09/29"
                      className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.expiry}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.14em] uppercase text-muted mb-1.5">
                      Security Code (CVC) *
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={cvc}
                      onChange={(e) =>
                        setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="•••"
                      className="w-full px-4 py-3 bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-ink"
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-xs text-danger">{errors.cvc}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* Right 5 Columns: Sticky Order Summary & Promo Engine */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 bg-surface/65 border border-hairline p-6 sm:p-8 space-y-6">
            <h2 className="font-editorial text-2xl text-ink pb-4 border-b border-hairline">
              Order Summary
            </h2>

            {/* Promo Code Validation Engine */}
            <div className="space-y-2">
              <p className="text-[11px] tracking-[0.16em] uppercase text-muted">
                Privilege / Voucher Code
              </p>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-canvas border border-hairline px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-ink">
                    <Check className="w-3.5 h-3.5 text-accent" />
                    <span className="font-medium uppercase tracking-wider">
                      {appliedPromo.code}
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
                      placeholder="ATELIER20, WELCOME10, SORA50"
                      className="w-full pl-9 pr-3 py-2.5 bg-canvas border border-hairline text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 border border-ink text-xs tracking-[0.14em] uppercase text-ink hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoFeedback && !appliedPromo && (
                <p
                  className={`text-xs ${
                    promoFeedback.ok ? "text-accent" : "text-danger"
                  }`}
                >
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Pricing Lines */}
            <div className="space-y-3 text-sm pt-2 border-t border-hairline">
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
              <div className="flex justify-between text-muted">
                <span>Estimated Tax (8%)</span>
                <span className="text-ink">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-medium text-ink pt-4 border-t border-hairline">
                <span>Total Due</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full py-4 px-6 bg-ink text-canvas text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-ink-soft disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              {submitting
                ? "Authorizing Payment..."
                : `Complete Order — ${formatCurrency(totalAmount)}`}
            </button>

            <div className="flex items-start gap-2.5 text-[11px] text-muted leading-relaxed pt-1">
              <ShieldCheck className="w-4 h-4 text-ink shrink-0 mt-0.5" />
              <span>
                Your payment details are encrypted end-to-end. Inventory stock
                is immediately updated upon order confirmation.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
