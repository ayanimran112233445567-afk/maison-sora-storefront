"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/data/products";

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const current = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-label="Seasonal campaign carousel"
      className="relative w-full h-[76vh] min-h-[540px] max-h-[820px] overflow-hidden bg-ink select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Background */}
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            idx === activeIndex
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={idx === 0}
            sizes="100vw"
            className={`object-cover object-center transition-transform duration-[6500ms] ease-out ${
              idx === activeIndex ? "scale-105" : "scale-100"
            }`}
          />
          {/* Editorial Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-xl text-canvas space-y-5">
          <div className="flex items-center gap-3">
            {current.badge && (
              <span className="px-3 py-1 bg-canvas/15 backdrop-blur-md border border-canvas/25 text-[10px] tracking-[0.2em] uppercase text-canvas">
                {current.badge}
              </span>
            )}
            <span className="text-[11px] tracking-[0.22em] uppercase text-canvas/80">
              {current.eyebrow}
            </span>
          </div>

          <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.03] text-canvas">
            {current.title}
          </h1>

          <p className="text-sm sm:text-base text-canvas/85 leading-relaxed max-w-lg font-light">
            {current.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href={current.ctaHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-canvas text-ink text-xs tracking-[0.18em] uppercase hover:bg-surface transition-colors"
            >
              {current.ctaLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {current.secondaryLabel && current.secondaryHref && (
              <Link
                href={current.secondaryHref}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-canvas/55 text-canvas text-xs tracking-[0.18em] uppercase hover:bg-canvas hover:text-ink transition-colors"
              >
                {current.secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls & Indicators */}
      <div className="absolute z-20 bottom-6 inset-x-0 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Progress Bars */}
        <div className="flex items-center gap-3">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              className="group py-2 cursor-pointer"
            >
              <span
                className={`block h-[2px] transition-all duration-500 ${
                  idx === activeIndex
                    ? "w-12 bg-canvas"
                    : "w-6 bg-canvas/40 group-hover:bg-canvas/70"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-[11px] tracking-[0.2em] text-canvas/75">
            0{activeIndex + 1} / 0{HERO_SLIDES.length}
          </span>
        </div>

        {/* Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous campaign slide"
            className="w-10 h-10 border border-canvas/35 text-canvas hover:bg-canvas hover:text-ink transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next campaign slide"
            className="w-10 h-10 border border-canvas/35 text-canvas hover:bg-canvas hover:text-ink transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
