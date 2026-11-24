"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { BRAND_NAME, CATEGORIES } from "@/data/products";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-ink text-canvas mt-24 border-t border-ink">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="font-editorial text-3xl tracking-[0.22em] text-canvas inline-block"
            >
              {BRAND_NAME}
            </Link>
            <p className="text-sm text-canvas/70 leading-relaxed max-w-sm">
              Minimalist luxury tailoring and sculptural knitwear crafted in
              small runs using certified Italian wool, Mongolian cashmere, and
              heavyweight mulberry silk.
            </p>
            <p className="text-[11px] tracking-[0.18em] uppercase text-canvas/50">
              Milan · Paris · New York
            </p>
          </div>

          {/* Collections */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-canvas/50">
              Collections
            </h3>
            <ul className="space-y-2.5 text-sm text-canvas/80">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-canvas transition-colors"
                >
                  Shop All
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    className="hover:text-canvas transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Services */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-canvas/50">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-sm text-canvas/80">
              <li>
                <Link
                  href="/cart"
                  className="hover:text-canvas transition-colors"
                >
                  Bag & Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sort=newest"
                  className="hover:text-canvas transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sort=popular"
                  className="hover:text-canvas transition-colors"
                >
                  House Icons
                </Link>
              </li>
              <li>
                <span className="text-canvas/60">Complimentary Returns</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-canvas/50">
              Private Dispatch
            </h3>
            <p className="text-sm text-canvas/70 leading-relaxed">
              Receive early access to seasonal releases, archival edits, and
              private atelier appointments.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2.5 py-3 px-4 border border-canvas/25 text-xs text-canvas">
                <Check className="w-4 h-4 text-accent" />
                <span>
                  Welcome to Maison Sora. Enjoy 10% off with code{" "}
                  <strong>WELCOME10</strong>.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex border-b border-canvas/30 focus-within:border-canvas transition-colors pb-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-sm text-canvas placeholder:text-canvas/45 focus:outline-none"
                />
                <button
                  type="submit"
                  className="pl-3 text-xs tracking-[0.16em] uppercase text-canvas hover:text-canvas/70 inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-canvas/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.14em] uppercase text-canvas/45">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <p>Next.js App Router · SSL Encrypted Checkout · Carbon-Neutral Courier</p>
        </div>
      </div>
    </footer>
  );
}
