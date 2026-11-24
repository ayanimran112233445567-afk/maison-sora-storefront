import React from "react";
import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Shopping Bag & Secure Checkout",
  description:
    "Review your Maison Sora shopping bag, apply promotional privilege codes, and complete encrypted checkout with complimentary express courier delivery.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <CheckoutClient />;
}
