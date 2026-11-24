# MAISON SORA — Modern E-Commerce Clothing Brand Platform

A minimalist luxury e-commerce storefront built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, implementing the complete Software Requirements Specification (SRS).

## Architecture & Core Modules

- **Homepage (`/`)**: Full-width auto-advancing hero campaign carousel (with mobile touch swipe & pause-on-hover), Featured Collections 4-column editorial grid, New Arrivals & House Icons showcases, and Atelier craftsmanship pillars.
- **Catalog & Discovery (`/shop`)**: Multi-faceted filtering sidebar (desktop collapsible + mobile filter drawer) across category, size (`S`–`XL`), color swatches, keyword, and price brackets, paired with a dynamic sorting engine (Popularity, Newest, Price Low-to-High / High-to-Low) and hover-to-secondary-image product cards with Quick-Add size bars.
- **Product Detail Page (`/product/[id]`)**: Statically generated (`generateStaticParams`) with multi-angle thumbnail gallery (swipeable on mobile), desktop interactive reticle + side-by-side 2.6× high-definition zoom magnification, fullscreen zoom lightbox, live per-variant stock indicators, mobile sticky bottom Add-to-Cart bar, and atelier specification accordions.
- **Slide-Over Cart Drawer & Secure Checkout (`/cart`)**: Persistent `localStorage` cart & wishlist state, live stock caps, complimentary shipping progress bar, promo code validation engine (`ATELIER20`, `WELCOME10`, `SORA50`, `FREESHIP`), shipping & encrypted payment checkout form with validation, and instant order confirmation (`MS-2026-XXXXX`) with automatic inventory decrement.
- **SEO, GEO & AEO Discoverability**: Dynamic Open Graph & Twitter card previews (`generateMetadata`), JSON-LD structured schemas (`Organization`, `WebSite`, `CollectionPage`, `Product`, `Offer`, `AggregateRating`, `BreadcrumbList`), dynamic `sitemap.xml`, and AI-crawler-friendly `robots.txt`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

## Production Build & Vercel Deployment

```bash
npm run typecheck
npm run build
npm run start
```

Deploy directly by pushing this repository to GitHub and importing it into [Vercel](https://vercel.com) (zero additional configuration required). Set `NEXT_PUBLIC_SITE_URL` in Vercel environment variables for production canonical URLs and Open Graph metadata.
