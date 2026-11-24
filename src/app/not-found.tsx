import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center space-y-6">
      <p className="text-[11px] tracking-[0.22em] uppercase text-muted">
        404 — Page Not Found
      </p>
      <h1 className="font-editorial text-5xl font-light text-ink">
        This Piece Has Left the Archive
      </h1>
      <p className="text-sm text-muted max-w-md mx-auto">
        The garment or page you are looking for is no longer available. Explore
        our current seasonal collection below.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink text-canvas text-xs tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors"
      >
        Explore Collection <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
