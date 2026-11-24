"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES, PRODUCTS, formatCurrency } from "@/data/products";

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) closeSearch();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSearchOpen, closeSearch]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.subtitle.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.composition.toLowerCase().includes(trimmed) ||
        p.colors.some((c) => c.name.toLowerCase().includes(trimmed))
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search Maison Sora"
    >
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-[3px] animate-fade-in"
        onClick={closeSearch}
      />

      <div className="relative z-10 w-full max-w-3xl bg-canvas border border-hairline shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-hairline">
          <Search className="w-5 h-5 stroke-[1.5] text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coats, cashmere, silk, trousers..."
            className="w-full bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="p-1.5 text-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Quick Category Chips */}
        <div className="px-6 py-3 bg-surface/60 border-b border-hairline flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted mr-2">
            Collections:
          </span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              onClick={closeSearch}
              className="px-3 py-1 bg-canvas border border-hairline text-xs text-ink hover:border-ink transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] tracking-[0.16em] uppercase text-muted">
              {query.trim()
                ? `${results.length} ${
                    results.length === 1 ? "result" : "results"
                  }`
                : "Featured Pieces"}
            </p>
            <Link
              href="/shop"
              onClick={closeSearch}
              className="text-xs text-ink hover:text-muted inline-flex items-center gap-1"
            >
              View full catalog <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">
              No garments found for &ldquo;{query}&rdquo;. Try searching for
              wool, cashmere, silk, or trench.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={closeSearch}
                  className="group flex items-center gap-4 p-2 hover:bg-surface transition-colors"
                >
                  <div className="relative w-16 h-20 bg-surface shrink-0 overflow-hidden">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.16em] uppercase text-muted">
                      {product.category}
                    </p>
                    <p className="text-sm font-medium text-ink truncate group-hover:underline underline-offset-4">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
