"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  COLOR_FILTERS,
  PRICE_BRACKETS,
  PRODUCTS,
  SIZES,
} from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import type { ApparelSize, Category } from "@/types/ecommerce";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc";

export function ShopCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  const initialSort = (searchParams.get("sort") as SortOption) || "popular";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    initialCategory && CATEGORIES.includes(initialCategory)
      ? [initialCategory]
      : []
  );
  const [selectedSizes, setSelectedSizes] = useState<ApparelSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const toggleItem = <T,>(
    value: T,
    list: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPrices([]);
    setSearchQuery("");
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    selectedPrices.length +
    (searchQuery.trim() ? 1 : 0);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = PRODUCTS.filter((product) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }

      if (selectedSizes.length > 0) {
        const hasInStockSize = selectedSizes.some((size) =>
          product.variants.some((v) => v.size === size && v.stock > 0)
        );
        if (!hasInStockSize) return false;
      }

      if (selectedColors.length > 0) {
        const hasColor = product.colors.some((c) =>
          selectedColors.includes(c.slug)
        );
        if (!hasColor) return false;
      }

      if (selectedPrices.length > 0) {
        const inBracket = selectedPrices.some((bracketId) => {
          const bracket = PRICE_BRACKETS.find((b) => b.id === bracketId);
          if (!bracket) return false;
          return product.price >= bracket.min && product.price <= bracket.max;
        });
        if (!inBracket) return false;
      }

      if (q) {
        const matchesQuery =
          product.name.toLowerCase().includes(q) ||
          product.subtitle.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.composition.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "popular":
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedPrices,
    searchQuery,
    sortBy,
  ]);

  const FilterPanelContent = (
    <div className="space-y-8">
      {/* Search within catalog */}
      <div>
        <label
          htmlFor="catalog-search"
          className="block text-[11px] tracking-[0.2em] uppercase text-ink font-medium mb-3"
        >
          Keyword
        </label>
        <input
          id="catalog-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Wool, silk, trench..."
          className="w-full px-3.5 py-2.5 bg-canvas border border-hairline text-xs text-ink placeholder:text-muted focus:outline-none focus:border-ink"
        />
      </div>

      {/* Category Filter */}
      <div className="pt-6 border-t border-hairline">
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-ink font-medium mb-4">
          Category
        </h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((category) => {
            const checked = selectedCategories.includes(category);
            const count = PRODUCTS.filter(
              (p) => p.category === category
            ).length;
            return (
              <label
                key={category}
                className="flex items-center justify-between text-sm text-ink-soft hover:text-ink cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      toggleItem(
                        category,
                        selectedCategories,
                        setSelectedCategories
                      )
                    }
                    className="w-4 h-4 accent-ink border-hairline rounded-none cursor-pointer"
                  />
                  <span className={checked ? "text-ink font-medium" : ""}>
                    {category}
                  </span>
                </span>
                <span className="text-xs text-muted">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Apparel Size Filter */}
      <div className="pt-6 border-t border-hairline">
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-ink font-medium mb-4">
          Size
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => {
            const active = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  toggleItem(size, selectedSizes, setSelectedSizes)
                }
                className={`py-2.5 text-xs tracking-wider border transition-colors cursor-pointer ${
                  active
                    ? "bg-ink text-canvas border-ink"
                    : "bg-canvas text-ink border-hairline hover:border-ink"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Swatch Filter */}
      <div className="pt-6 border-t border-hairline">
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-ink font-medium mb-4">
          Color Palette
        </h3>
        <div className="space-y-2.5">
          {COLOR_FILTERS.map((color) => {
            const active = selectedColors.includes(color.slug);
            return (
              <button
                key={color.slug}
                type="button"
                onClick={() =>
                  toggleItem(color.slug, selectedColors, setSelectedColors)
                }
                className={`w-full flex items-center gap-3 py-1 text-left text-xs transition-colors cursor-pointer ${
                  active ? "text-ink font-medium" : "text-muted hover:text-ink"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full p-[2px] border flex items-center justify-center ${
                    active ? "border-ink" : "border-transparent"
                  }`}
                >
                  <span
                    className="w-full h-full rounded-full border border-black/15"
                    style={{ backgroundColor: color.hex }}
                  />
                </span>
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Brackets */}
      <div className="pt-6 border-t border-hairline">
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-ink font-medium mb-4">
          Price Bracket
        </h3>
        <div className="space-y-2.5">
          {PRICE_BRACKETS.map((bracket) => {
            const checked = selectedPrices.includes(bracket.id);
            return (
              <label
                key={bracket.id}
                className="flex items-center gap-3 text-sm text-ink-soft hover:text-ink cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    toggleItem(bracket.id, selectedPrices, setSelectedPrices)
                  }
                  className="w-4 h-4 accent-ink border-hairline rounded-none cursor-pointer"
                />
                <span className={checked ? "text-ink font-medium" : ""}>
                  {bracket.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full py-2.5 border border-hairline text-xs tracking-[0.16em] uppercase text-ink hover:border-ink transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
      {/* Catalog Editorial Header */}
      <div className="pb-8 border-b border-hairline flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted mb-2">
            Autumn / Winter 2026
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl font-light text-ink">
            {selectedCategories.length === 1
              ? `${selectedCategories[0]} Collection`
              : "The Complete Archive"}
          </h1>
        </div>
        <p className="text-sm text-muted max-w-md">
          Sculptural silhouettes in double-faced virgin wool, traceable
          cashmere, and heavyweight silk. Hover any garment to inspect textile
          detail or quick-add your size.
        </p>
      </div>

      {/* Controls Bar (Filters Toggle + Result Count + Dynamic Sort Engine) */}
      <div className="py-5 flex flex-wrap items-center justify-between gap-4 border-b border-hairline">
        <div className="flex items-center gap-4">
          {/* Mobile Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-ink text-xs tracking-[0.16em] uppercase text-ink"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Desktop Sidebar Toggle (allows switching to widescreen 4-col view) */}
          <button
            type="button"
            onClick={() => setDesktopSidebarOpen((v) => !v)}
            className="hidden lg:inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-ink hover:text-muted transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {desktopSidebarOpen ? "Hide Filters" : "Show Filters"}
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>

          <span className="text-xs text-muted">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "garment" : "garments"}
          </span>
        </div>

        {/* Dynamic Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="sort-select"
            className="text-[11px] tracking-[0.16em] uppercase text-muted hidden sm:inline"
          >
            Sort By
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-canvas border border-hairline pl-3.5 pr-9 py-2 text-xs tracking-wide text-ink focus:outline-none focus:border-ink cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="py-4 flex flex-wrap items-center gap-2 border-b border-hairline">
          {selectedCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                toggleItem(cat, selectedCategories, setSelectedCategories)
              }
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-xs text-ink hover:bg-surface-deep transition-colors cursor-pointer"
            >
              {cat} <X className="w-3 h-3" />
            </button>
          ))}
          {selectedSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                toggleItem(size, selectedSizes, setSelectedSizes)
              }
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-xs text-ink hover:bg-surface-deep transition-colors cursor-pointer"
            >
              Size {size} <X className="w-3 h-3" />
            </button>
          ))}
          {selectedColors.map((slug) => {
            const col = COLOR_FILTERS.find((c) => c.slug === slug);
            return (
              <button
                key={slug}
                type="button"
                onClick={() =>
                  toggleItem(slug, selectedColors, setSelectedColors)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-xs text-ink hover:bg-surface-deep transition-colors cursor-pointer"
              >
                {col?.name ?? slug} <X className="w-3 h-3" />
              </button>
            );
          })}
          {selectedPrices.map((id) => {
            const br = PRICE_BRACKETS.find((b) => b.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  toggleItem(id, selectedPrices, setSelectedPrices)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-xs text-ink hover:bg-surface-deep transition-colors cursor-pointer"
              >
                {br?.label ?? id} <X className="w-3 h-3" />
              </button>
            );
          })}
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface text-xs text-ink hover:bg-surface-deep transition-colors cursor-pointer"
            >
              &ldquo;{searchQuery}&rdquo; <X className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-muted hover:text-ink underline underline-offset-4 ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Multi-Faceted Sidebar + Responsive Grid */}
      <div className="pt-8 flex gap-10">
        {/* Desktop Filtering Sidebar */}
        {desktopSidebarOpen && (
          <aside className="hidden lg:block w-60 shrink-0 sticky top-28 self-start">
            {FilterPanelContent}
          </aside>
        )}

        {/* Product Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-hairline bg-surface/40 px-6">
              <p className="font-editorial text-3xl text-ink mb-2">
                No garments match your selection
              </p>
              <p className="text-sm text-muted max-w-md mx-auto mb-6">
                Adjust or reset your filters to explore our full seasonal
                archive.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-7 py-3 bg-ink text-canvas text-xs tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 ${
                desktopSidebarOpen
                  ? "lg:grid-cols-3 xl:grid-cols-4"
                  : "lg:grid-cols-4"
              }`}
            >
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx < 4}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Collapsible Filter Drawer */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Filter catalog"
        >
          <div
            className="fixed inset-0 bg-ink/45 backdrop-blur-[2px]"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-[86%] max-w-sm bg-canvas h-full flex flex-col shadow-2xl">
            <div className="px-6 py-5 border-b border-hairline flex items-center justify-between">
              <h2 className="font-editorial text-2xl text-ink">Refine</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 -mr-2 text-ink"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {FilterPanelContent}
            </div>
            <div className="p-4 border-t border-hairline bg-canvas">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 bg-ink text-canvas text-xs tracking-[0.18em] uppercase"
              >
                View {filteredProducts.length} Garments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
