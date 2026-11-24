"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { BRAND_NAME, CATEGORIES } from "@/data/products";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, wishlist, openCart, openWishlist, openSearch } =
    useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Subtle Top Announcement Bar */}
      <div className="bg-ink text-canvas text-[11px] tracking-[0.18em] uppercase text-center py-2 px-4">
        Complimentary Express Courier on orders over $350 &nbsp;·&nbsp; Use code{" "}
        <span className="underline underline-offset-4 font-medium">
          ATELIER20
        </span>{" "}
        for 20% off Seasonal Archive
      </div>

      {/* Persistent Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Trigger + Left Category Links */}
          <div className="flex items-center gap-6 flex-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-ink hover:text-muted transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>

            <nav
              aria-label="Primary categories"
              className="hidden lg:flex items-center gap-7"
            >
              <Link
                href="/shop"
                className={`text-xs tracking-[0.16em] uppercase transition-colors ${
                  pathname === "/shop"
                    ? "text-ink font-medium"
                    : "text-muted hover:text-ink"
                }`}
              >
                Shop All
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="text-xs tracking-[0.16em] uppercase text-muted hover:text-ink transition-colors"
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Brand Identity */}
          <Link
            href="/"
            className="font-editorial text-2xl sm:text-[28px] tracking-[0.22em] font-normal text-ink whitespace-nowrap hover:opacity-80 transition-opacity"
          >
            {BRAND_NAME}
          </Link>

          {/* Right Utility Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-5 flex-1">
            <button
              type="button"
              onClick={openSearch}
              className="flex items-center gap-2 p-2 text-ink hover:text-muted transition-colors cursor-pointer"
              aria-label="Search garments"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
              <span className="hidden xl:inline text-xs tracking-[0.15em] uppercase">
                Search
              </span>
            </button>

            <button
              type="button"
              onClick={openWishlist}
              className="relative p-2 text-ink hover:text-muted transition-colors cursor-pointer"
              aria-label={`Saved pieces (${wishlist.length})`}
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-accent text-canvas text-[10px] font-medium flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 p-2 -mr-2 text-ink hover:text-muted transition-colors cursor-pointer"
              aria-label={`Shopping bag (${itemCount} items)`}
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
              <span className="hidden sm:inline text-xs tracking-[0.15em] uppercase">
                Bag
              </span>
              <span
                className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-medium flex items-center justify-center transition-colors ${
                  itemCount > 0
                    ? "bg-ink text-canvas"
                    : "bg-surface-deep text-muted"
                }`}
              >
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[84%] max-w-sm bg-canvas h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-hairline">
                <span className="font-editorial text-xl tracking-[0.2em]">
                  {BRAND_NAME}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-ink"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-5">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-editorial text-2xl text-ink hover:text-muted transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-editorial text-2xl text-ink hover:text-muted transition-colors"
                >
                  Shop All
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-editorial text-2xl text-ink hover:text-muted transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-editorial text-2xl text-ink hover:text-muted transition-colors pt-4 border-t border-hairline"
                >
                  Bag & Checkout ({itemCount})
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-hairline text-xs text-muted space-y-1.5">
              <p className="uppercase tracking-[0.16em] text-ink">
                Maison Sora Atelier
              </p>
              <p>Milan · Paris · New York</p>
              <p>Complimentary shipping over $350</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
