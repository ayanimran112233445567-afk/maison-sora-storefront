import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { SearchModal } from "@/components/SearchModal";
import { BRAND_NAME, SITE_URL } from "@/data/products";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — Minimalist Luxury Apparel & Tailoring`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "Discover Maison Sora: minimalist luxury clothing crafted from RWS-certified Italian virgin wool, Mongolian cashmere, and heavyweight mulberry silk. Complimentary express shipping over $350.",
  keywords: [
    "minimalist luxury clothing",
    "Italian wool overcoat",
    "cashmere knitwear",
    "contemporary tailoring",
    "quiet luxury fashion",
    "Maison Sora",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — Minimalist Luxury Apparel & Tailoring`,
    description:
      "Architectural silhouettes in double-faced Italian wool, brushed cashmere, and mulberry silk.",
    images: [
      {
        url: "/images/hero-autumn.jpg",
        width: 1200,
        height: 675,
        alt: "Maison Sora Autumn/Winter 2026 Minimalist Luxury Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Minimalist Luxury Apparel & Tailoring`,
    description:
      "Architectural silhouettes in double-faced Italian wool, brushed cashmere, and mulberry silk.",
    images: ["/images/hero-autumn.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WishlistDrawer />
          <SearchModal />
        </StoreProvider>
      </body>
    </html>
  );
}
