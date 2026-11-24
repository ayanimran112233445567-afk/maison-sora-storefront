import type {
  ApparelSize,
  Category,
  ColorOption,
  FeaturedCollection,
  HeroSlide,
  PriceBracket,
  Product,
  PromoCode,
} from "@/types/ecommerce";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://maisonsora.vercel.app";

export const BRAND_NAME = "MAISON SORA";

export const CATEGORIES: Category[] = ["Women", "Men", "Unisex", "Outerwear"];

export const SIZES: ApparelSize[] = ["S", "M", "L", "XL"];

export const COLOR_PALETTE: Record<string, ColorOption> = {
  obsidian: { name: "Obsidian Black", slug: "obsidian", hex: "#171717" },
  chalk: { name: "Chalk Ivory", slug: "chalk", hex: "#F2EFE9" },
  taupe: { name: "Warm Taupe", slug: "taupe", hex: "#A89B8C" },
  slate: { name: "Slate Charcoal", slug: "slate", hex: "#4A4B4E" },
  espresso: { name: "Espresso", slug: "espresso", hex: "#3D2E27" },
  sand: { name: "Desert Sand", slug: "sand", hex: "#D4C6B2" },
};

export const COLOR_FILTERS: ColorOption[] = Object.values(COLOR_PALETTE);

export const PRICE_BRACKETS: PriceBracket[] = [
  { id: "under-250", label: "Under $250", min: 0, max: 249.99 },
  { id: "250-450", label: "$250 – $450", min: 250, max: 450 },
  { id: "450-650", label: "$450 – $650", min: 450.01, max: 650 },
  { id: "over-650", label: "$650 & Above", min: 650.01, max: 10000 },
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: "ATELIER20",
    description: "20% off Seasonal Archive orders",
    type: "percentage",
    value: 20,
    minSubtotal: 200,
  },
  {
    code: "WELCOME10",
    description: "10% off your first Maison Sora order",
    type: "percentage",
    value: 10,
  },
  {
    code: "SORA50",
    description: "$50 privilege credit on orders over $400",
    type: "fixed",
    value: 50,
    minSubtotal: 400,
  },
  {
    code: "FREESHIP",
    description: "Complimentary Express Courier delivery",
    type: "free_shipping",
    value: 0,
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "aw26-campaign",
    eyebrow: "Autumn / Winter 2026 Collection",
    title: "Sculptural Restraint.",
    description:
      "Architectural silhouettes crafted from double-faced Italian merino, brushed cashmere, and fluid mulberry silk. Designed for quiet permanence.",
    ctaLabel: "Explore Collection",
    ctaHref: "/shop",
    secondaryLabel: "View Outerwear",
    secondaryHref: "/shop?category=Outerwear",
    badge: "New Season",
    image: "/images/hero-autumn.jpg",
    imageAlt:
      "Maison Sora Autumn Winter 2026 campaign models in sculptural wool coat and ivory cashmere knitwear",
  },
  {
    id: "outerwear-atelier",
    eyebrow: "The Outerwear Study",
    title: "Form & Structure.",
    description:
      "Hand-finished overcoats and storm-ready cotton gabardine trenches tailored with clean unlined drape and matte buffalo horn hardware.",
    ctaLabel: "Shop Outerwear",
    ctaHref: "/shop?category=Outerwear",
    secondaryLabel: "Discover All",
    secondaryHref: "/shop",
    badge: "Limited Edition",
    image: "/images/hero-outerwear.jpg",
    imageAlt:
      "Oversized obsidian black double-breasted tailored wool overcoat in motion",
  },
  {
    id: "private-archive",
    eyebrow: "Seasonal Privilege — Limited Time",
    title: "The Private Archive.",
    description:
      "Enjoy 20% off curated archival tailoring and fine knitwear with code ATELIER20 on orders over $200.",
    ctaLabel: "Shop Archive",
    ctaHref: "/shop?sort=price-asc",
    secondaryLabel: "View Bestsellers",
    secondaryHref: "/shop?sort=popular",
    badge: "Code: ATELIER20",
    image: "/images/hero-archive.jpg",
    imageAlt:
      "Folded cashmere knitwear, silk shirts, and tailored wool garments on travertine stone plinths",
  },
];

export const FEATURED_COLLECTIONS: FeaturedCollection[] = [
  {
    category: "Women",
    title: "Women",
    subtitle: "Fluid silk drapery & tailored suiting",
    image: "/images/cat-women.jpg",
    href: "/shop?category=Women",
  },
  {
    category: "Men",
    title: "Men",
    subtitle: "Architectural coats & structured wool",
    image: "/images/prod-coat-front.jpg",
    href: "/shop?category=Men",
  },
  {
    category: "Unisex",
    title: "Unisex",
    subtitle: "Shared proportions in heavyweight fleece & knitwear",
    image: "/images/prod-hoodie-front.jpg",
    href: "/shop?category=Unisex",
  },
  {
    category: "Outerwear",
    title: "Outerwear",
    subtitle: "Double-faced wool & Italian gabardine",
    image: "/images/prod-trench-front.jpg",
    href: "/shop?category=Outerwear",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "solis-double-faced-overcoat",
    slug: "solis-double-faced-overcoat",
    name: "Solis Double-Faced Overcoat",
    subtitle: "Italian Virgin Wool Tailored Coat",
    category: "Outerwear",
    price: 780,
    originalPrice: 920,
    isNew: true,
    popularity: 99,
    createdAt: "2026-11-18",
    description:
      "Cut to an elongated, architectural silhouette from 640gsm double-faced Italian virgin wool. Every seam is split and hand-felled by our Milanese atelier, eliminating internal lining for weightless warmth and fluid drape.",
    craftsmanship: [
      "Hand-finished blind-stitched seams with zero interior bulk",
      "Genuine matte buffalo horn double-breasted closure",
      "Deep welt pockets lined in brushed cupro twill",
      "Back walking vent engineered for clean drape in motion",
    ],
    composition: "100% RWS-Certified Italian Virgin Wool (640 gsm)",
    care: [
      "Specialist dry clean only",
      "Steam lightly from reverse to refresh fibers",
      "Store on wide-shouldered cedar hanger",
    ],
    fitNotes:
      "Relaxed tailored fit with softly dropped shoulders. True to size; size down for a closer frame.",
    colors: [COLOR_PALETTE.obsidian, COLOR_PALETTE.slate],
    images: [
      {
        url: "/images/prod-coat-front.jpg",
        alt: "Solis Double-Faced Overcoat in Obsidian Black — Front View",
        angle: "Front",
      },
      {
        url: "/images/prod-coat-detail.jpg",
        alt: "Solis Double-Faced Overcoat — Hand-stitched Lapel & Horn Button Detail",
        angle: "Detail",
      },
      {
        url: "/images/hero-outerwear.jpg",
        alt: "Solis Double-Faced Overcoat — Editorial Movement Silhouette",
        angle: "Silhouette",
      },
    ],
    variants: [
      { sku: "MS-SOL-OBS-S", size: "S", colorSlug: "obsidian", stock: 3 },
      { sku: "MS-SOL-OBS-M", size: "M", colorSlug: "obsidian", stock: 2 },
      { sku: "MS-SOL-OBS-L", size: "L", colorSlug: "obsidian", stock: 6 },
      { sku: "MS-SOL-OBS-XL", size: "XL", colorSlug: "obsidian", stock: 1 },
      { sku: "MS-SOL-SLA-S", size: "S", colorSlug: "slate", stock: 4 },
      { sku: "MS-SOL-SLA-M", size: "M", colorSlug: "slate", stock: 5 },
      { sku: "MS-SOL-SLA-L", size: "L", colorSlug: "slate", stock: 2 },
      { sku: "MS-SOL-SLA-XL", size: "XL", colorSlug: "slate", stock: 0 },
    ],
    rating: 4.9,
    reviewCount: 48,
  },
  {
    id: "lumina-ribbed-cashmere-turtleneck",
    slug: "lumina-ribbed-cashmere-turtleneck",
    name: "Lumina Ribbed Cashmere Turtleneck",
    subtitle: "7-Gauge Mongolian Cashmere Knit",
    category: "Women",
    price: 440,
    isNew: true,
    popularity: 97,
    createdAt: "2026-11-15",
    description:
      "Knitted in a plush 7-gauge vertical fisherman rib from Grade-A Inner Mongolian cashmere. Designed with a sculptural high funnel neck that holds its form without clinging, finished with elongated ribbed cuffs.",
    craftsmanship: [
      "4-ply combed Grade-A cashmere spun for anti-pilling longevity",
      "Fully fashioned saddle-shoulder construction",
      "Seamless tubular rib hem and collar trim",
    ],
    composition: "100% Traceable Inner Mongolian Cashmere",
    care: [
      "Cold hand wash with cashmere detergent",
      "Reshape and dry flat on towel away from direct heat",
      "Fold neatly rather than hanging",
    ],
    fitNotes:
      "Generously proportioned relaxed silhouette. Take your normal size for intended drape.",
    colors: [COLOR_PALETTE.chalk, COLOR_PALETTE.taupe],
    images: [
      {
        url: "/images/prod-knit-front.jpg",
        alt: "Lumina Ribbed Cashmere Turtleneck in Chalk Ivory — Front View",
        angle: "Front",
      },
      {
        url: "/images/prod-knit-detail.jpg",
        alt: "Lumina Ribbed Cashmere Turtleneck — Close-up Ribbed Cashmere Texture",
        angle: "Detail",
      },
      {
        url: "/images/hero-archive.jpg",
        alt: "Lumina Ribbed Cashmere Turtleneck — Capsule Palette",
        angle: "Silhouette",
      },
    ],
    variants: [
      { sku: "MS-LUM-CHK-S", size: "S", colorSlug: "chalk", stock: 7 },
      { sku: "MS-LUM-CHK-M", size: "M", colorSlug: "chalk", stock: 3 },
      { sku: "MS-LUM-CHK-L", size: "L", colorSlug: "chalk", stock: 4 },
      { sku: "MS-LUM-CHK-XL", size: "XL", colorSlug: "chalk", stock: 2 },
      { sku: "MS-LUM-TAU-S", size: "S", colorSlug: "taupe", stock: 5 },
      { sku: "MS-LUM-TAU-M", size: "M", colorSlug: "taupe", stock: 1 },
      { sku: "MS-LUM-TAU-L", size: "L", colorSlug: "taupe", stock: 3 },
      { sku: "MS-LUM-TAU-XL", size: "XL", colorSlug: "taupe", stock: 2 },
    ],
    rating: 4.9,
    reviewCount: 64,
  },
  {
    id: "kairo-gabardine-trench-coat",
    slug: "kairo-gabardine-trench-coat",
    name: "Kairo Gabardine Trench Coat",
    subtitle: "Water-Repellent Longline Trench",
    category: "Outerwear",
    price: 690,
    isNew: true,
    popularity: 95,
    createdAt: "2026-11-12",
    description:
      "A stripped-back interpretation of the classic trench coat, pared of excess hardware in favor of pure proportion. Woven in northern Italy from densely spun organic cotton gabardine with a PFC-free water-repellent finish.",
    craftsmanship: [
      "Tightly woven 2-ply water-repellent cotton gabardine",
      "Minimal storm flap and detachable tonal tie belt with horn buckle",
      "Raglan sleeves engineered to layer cleanly over tailoring",
    ],
    composition: "100% Organic Cotton Gabardine",
    care: ["Specialist dry clean", "Re-proof water-repellent finish as needed"],
    fitNotes: "Fluid oversized cut with ankle-grazing length. True to size.",
    colors: [COLOR_PALETTE.sand, COLOR_PALETTE.taupe],
    images: [
      {
        url: "/images/prod-trench-front.jpg",
        alt: "Kairo Gabardine Trench Coat in Desert Sand — Front View",
        angle: "Front",
      },
      {
        url: "/images/prod-trench-detail.jpg",
        alt: "Kairo Gabardine Trench Coat — Gabardine Weave & Belt Detail",
        angle: "Detail",
      },
      {
        url: "/images/hero-autumn.jpg",
        alt: "Kairo Gabardine Trench Coat — Autumn Campaign Silhouette",
        angle: "Silhouette",
      },
    ],
    variants: [
      { sku: "MS-KAI-SND-S", size: "S", colorSlug: "sand", stock: 6 },
      { sku: "MS-KAI-SND-M", size: "M", colorSlug: "sand", stock: 3 },
      { sku: "MS-KAI-SND-L", size: "L", colorSlug: "sand", stock: 2 },
      { sku: "MS-KAI-SND-XL", size: "XL", colorSlug: "sand", stock: 4 },
      { sku: "MS-KAI-TAU-S", size: "S", colorSlug: "taupe", stock: 3 },
      { sku: "MS-KAI-TAU-M", size: "M", colorSlug: "taupe", stock: 5 },
      { sku: "MS-KAI-TAU-L", size: "L", colorSlug: "taupe", stock: 2 },
      { sku: "MS-KAI-TAU-XL", size: "XL", colorSlug: "taupe", stock: 1 },
    ],
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: "sera-bias-cut-silk-column-dress",
    slug: "sera-bias-cut-silk-column-dress",
    name: "Sera Bias-Cut Silk Column Dress",
    subtitle: "30-Momme Heavyweight Matte Silk",
    category: "Women",
    price: 590,
    isNew: true,
    popularity: 94,
    createdAt: "2026-11-08",
    description:
      "Cut on the true 45-degree bias from luminous 30-momme matte crepe de chine silk, the Sera Column Dress glides over the form with effortless fluidity and understated evening poise.",
    craftsmanship: [
      "30-momme heavyweight mulberry silk for opaque, weighted drape",
      "Fine rolled edges and concealed back keyhole closure",
      "Bias grain adapts organically to movement without darts",
    ],
    composition: "100% 30-Momme Mulberry Silk",
    care: ["Specialist dry clean only", "Steam gently from inside"],
    fitNotes:
      "Skims the silhouette cleanly without clinging. Take your standard size.",
    colors: [COLOR_PALETTE.obsidian, COLOR_PALETTE.chalk],
    images: [
      {
        url: "/images/prod-dress-front.jpg",
        alt: "Sera Bias-Cut Silk Column Dress in Obsidian Black — Front View",
        angle: "Front",
      },
      {
        url: "/images/cat-women.jpg",
        alt: "Sera Bias-Cut Silk Column Dress — Atelier Lookbook",
        angle: "Silhouette",
      },
      {
        url: "/images/prod-coat-detail.jpg",
        alt: "Sera Bias-Cut Silk Column Dress — Fine Hand-Finished Seam Detail",
        angle: "Detail",
      },
    ],
    variants: [
      { sku: "MS-SER-OBS-S", size: "S", colorSlug: "obsidian", stock: 4 },
      { sku: "MS-SER-OBS-M", size: "M", colorSlug: "obsidian", stock: 2 },
      { sku: "MS-SER-OBS-L", size: "L", colorSlug: "obsidian", stock: 3 },
      { sku: "MS-SER-OBS-XL", size: "XL", colorSlug: "obsidian", stock: 1 },
      { sku: "MS-SER-CHK-S", size: "S", colorSlug: "chalk", stock: 3 },
      { sku: "MS-SER-CHK-M", size: "M", colorSlug: "chalk", stock: 5 },
      { sku: "MS-SER-CHK-L", size: "L", colorSlug: "chalk", stock: 2 },
      { sku: "MS-SER-CHK-XL", size: "XL", colorSlug: "chalk", stock: 0 },
    ],
    rating: 5.0,
    reviewCount: 29,
  },
  {
    id: "arbor-pleated-wide-trouser",
    slug: "arbor-pleated-wide-trouser",
    name: "Arbor Pleated Wide-Leg Trouser",
    subtitle: "High-Waisted Italian Wool Twill",
    category: "Men",
    price: 340,
    originalPrice: 410,
    popularity: 92,
    createdAt: "2026-10-25",
    description:
      "Cut with deep double front pleats that fall into a sweeping architectural leg, the Arbor Trouser elongates the silhouette with a crisp pressed crease and clean extended tab waistband.",
    craftsmanship: [
      "Extended hook-and-bar waistband with internal anchor button",
      "Half-lined to the knee in breathable Japanese cupro",
      "Deep side seam pockets and single rear welt pocket",
    ],
    composition: "100% Virgin Italian Wool Twill",
    care: ["Dry clean only", "Steam vertically to preserve front crease"],
    fitNotes: "Relaxed tailored waist with full-length wide leg. True to size.",
    colors: [COLOR_PALETTE.sand, COLOR_PALETTE.obsidian],
    images: [
      {
        url: "/images/prod-trouser-front.jpg",
        alt: "Arbor Pleated Wide-Leg Trouser in Desert Sand — Front View",
        angle: "Front",
      },
      {
        url: "/images/prod-trench-detail.jpg",
        alt: "Arbor Pleated Wide-Leg Trouser — Twill Weave & Topstitching Detail",
        angle: "Detail",
      },
      {
        url: "/images/cat-women.jpg",
        alt: "Arbor Pleated Wide-Leg Trouser — Editorial Pairing",
        angle: "Silhouette",
      },
    ],
    variants: [
      { sku: "MS-ARB-SND-S", size: "S", colorSlug: "sand", stock: 6 },
      { sku: "MS-ARB-SND-M", size: "M", colorSlug: "sand", stock: 2 },
      { sku: "MS-ARB-SND-L", size: "L", colorSlug: "sand", stock: 5 },
      { sku: "MS-ARB-SND-XL", size: "XL", colorSlug: "sand", stock: 4 },
      { sku: "MS-ARB-OBS-S", size: "S", colorSlug: "obsidian", stock: 8 },
      { sku: "MS-ARB-OBS-M", size: "M", colorSlug: "obsidian", stock: 5 },
      { sku: "MS-ARB-OBS-L", size: "L", colorSlug: "obsidian", stock: 3 },
      { sku: "MS-ARB-OBS-XL", size: "XL", colorSlug: "obsidian", stock: 2 },
    ],
    rating: 4.8,
    reviewCount: 44,
  },
  {
    id: "form-heavyweight-boxy-hoodie",
    slug: "form-heavyweight-boxy-hoodie",
    name: "Form Heavyweight Boxy Hoodie",
    subtitle: "520gsm Organic Cotton-Merino Fleece",
    category: "Unisex",
    price: 195,
    popularity: 93,
    createdAt: "2026-10-18",
    description:
      "Engineered without drawstrings for an uninterrupted sculptural neckline, the Form Hoodie uses custom-knitted 520gsm loopback fleece blended with merino wool for architectural volume and lasting structure.",
    craftsmanship: [
      "Double-layered structured hood that frames the collar cleanly",
      "Drop-shoulder boxy silhouette with dense ribbed cuffs",
      "Side-seam invisible kangaroo pocket to preserve clean front line",
    ],
    composition: "85% Organic Combed Cotton, 15% Fine Merino Wool (520 gsm)",
    care: ["Machine wash cold gentle cycle", "Reshape and dry flat"],
    fitNotes: "Unisex oversized boxy fit with cropped waist balance.",
    colors: [COLOR_PALETTE.espresso, COLOR_PALETTE.obsidian, COLOR_PALETTE.chalk],
    images: [
      {
        url: "/images/prod-hoodie-front.jpg",
        alt: "Form Heavyweight Boxy Hoodie in Espresso — Front View",
        angle: "Front",
      },
      {
        url: "/images/prod-knit-detail.jpg",
        alt: "Form Heavyweight Boxy Hoodie — Heavyweight Knit Texture",
        angle: "Detail",
      },
      {
        url: "/images/hero-archive.jpg",
        alt: "Form Heavyweight Boxy Hoodie — Capsule Palette",
        angle: "Silhouette",
      },
    ],
    variants: [
      { sku: "MS-FRM-ESP-S", size: "S", colorSlug: "espresso", stock: 9 },
      { sku: "MS-FRM-ESP-M", size: "M", colorSlug: "espresso", stock: 4 },
      { sku: "MS-FRM-ESP-L", size: "L", colorSlug: "espresso", stock: 3 },
      { sku: "MS-FRM-ESP-XL", size: "XL", colorSlug: "espresso", stock: 5 },
      { sku: "MS-FRM-OBS-S", size: "S", colorSlug: "obsidian", stock: 6 },
      { sku: "MS-FRM-OBS-M", size: "M", colorSlug: "obsidian", stock: 2 },
      { sku: "MS-FRM-OBS-L", size: "L", colorSlug: "obsidian", stock: 8 },
      { sku: "MS-FRM-OBS-XL", size: "XL", colorSlug: "obsidian", stock: 4 },
      { sku: "MS-FRM-CHK-S", size: "S", colorSlug: "chalk", stock: 5 },
      { sku: "MS-FRM-CHK-M", size: "M", colorSlug: "chalk", stock: 3 },
      { sku: "MS-FRM-CHK-L", size: "L", colorSlug: "chalk", stock: 2 },
      { sku: "MS-FRM-CHK-XL", size: "XL", colorSlug: "chalk", stock: 0 },
    ],
    rating: 4.8,
    reviewCount: 73,
  },
  {
    id: "elan-draped-silk-blouse",
    slug: "elan-draped-silk-blouse",
    name: "Élan Draped Mulberry Silk Blouse",
    subtitle: "Fluid Atelier Tunic Shirt",
    category: "Women",
    price: 310,
    originalPrice: 380,
    popularity: 89,
    createdAt: "2026-10-12",
    description:
      "Defined by softly cascading sleeves and a clean concealed placket, the Élan Blouse is cut from washed mulberry silk crepe that drapes effortlessly over wide-leg wool tailoring.",
    craftsmanship: [
      "French-seamed interior throughout for couture-grade finish",
      "Mother-of-pearl buttons concealed beneath minimal front placket",
      "Elongated split cuffs that fold back cleanly",
    ],
    composition: "100% Washed Mulberry Silk Crepe (22-Momme)",
    care: ["Gentle cold hand wash or specialist dry clean", "Steam lightly"],
    fitNotes: "Relaxed fluid cut. Take your normal size.",
    colors: [COLOR_PALETTE.chalk, COLOR_PALETTE.sand],
    images: [
      {
        url: "/images/cat-women.jpg",
        alt: "Élan Draped Mulberry Silk Blouse in Chalk Ivory — Front View",
        angle: "Front",
      },
      {
        url: "/images/prod-knit-detail.jpg",
        alt: "Élan Draped Mulberry Silk Blouse — Ivory Textile Detail",
        angle: "Detail",
      },
      {
        url: "/images/prod-trouser-front.jpg",
        alt: "Élan Draped Mulberry Silk Blouse — Tailored Styling",
        angle: "Silhouette",
      },
    ],
    variants: [
      { sku: "MS-ELN-CHK-S", size: "S", colorSlug: "chalk", stock: 6 },
      { sku: "MS-ELN-CHK-M", size: "M", colorSlug: "chalk", stock: 3 },
      { sku: "MS-ELN-CHK-L", size: "L", colorSlug: "chalk", stock: 5 },
      { sku: "MS-ELN-CHK-XL", size: "XL", colorSlug: "chalk", stock: 2 },
      { sku: "MS-ELN-SND-S", size: "S", colorSlug: "sand", stock: 4 },
      { sku: "MS-ELN-SND-M", size: "M", colorSlug: "sand", stock: 1 },
      { sku: "MS-ELN-SND-L", size: "L", colorSlug: "sand", stock: 4 },
      { sku: "MS-ELN-SND-XL", size: "XL", colorSlug: "sand", stock: 3 },
    ],
    rating: 4.9,
    reviewCount: 41,
  },
  {
    id: "valen-atelier-tailored-coat",
    slug: "valen-atelier-tailored-coat",
    name: "Valen Unstructured Atelier Coat",
    subtitle: "Men's Brushed Merino Topcoat",
    category: "Men",
    price: 620,
    isNew: true,
    popularity: 91,
    createdAt: "2026-11-05",
    description:
      "A sharp single-line menswear topcoat crafted from brushed Biella virgin wool with a fluid unpadded shoulder and crisp notched lapel. Engineered to move effortlessly from knitwear to full suiting.",
    craftsmanship: [
      "Brushed Biella virgin wool milled in northern Italy",
      "Hand-tacked lapel roll and matte dark horn buttons",
      "Dual internal welt pockets lined in tonal cupro",
    ],
    composition: "95% Italian Virgin Wool, 5% Cashmere",
    care: ["Specialist dry clean only", "Brush gently with cedar garment brush"],
    fitNotes: "Clean relaxed menswear tailoring. True to size.",
    colors: [COLOR_PALETTE.obsidian, COLOR_PALETTE.espresso],
    images: [
      {
        url: "/images/hero-outerwear.jpg",
        alt: "Valen Unstructured Atelier Coat in Obsidian Black — Front Movement View",
        angle: "Front",
      },
      {
        url: "/images/prod-coat-detail.jpg",
        alt: "Valen Unstructured Atelier Coat — Lapel & Horn Button Macro",
        angle: "Detail",
      },
      {
        url: "/images/prod-coat-front.jpg",
        alt: "Valen Unstructured Atelier Coat — Structured Studio Silhouette",
        angle: "Silhouette",
      },
    ],
    variants: [
      { sku: "MS-VAL-OBS-S", size: "S", colorSlug: "obsidian", stock: 4 },
      { sku: "MS-VAL-OBS-M", size: "M", colorSlug: "obsidian", stock: 2 },
      { sku: "MS-VAL-OBS-L", size: "L", colorSlug: "obsidian", stock: 5 },
      { sku: "MS-VAL-OBS-XL", size: "XL", colorSlug: "obsidian", stock: 2 },
      { sku: "MS-VAL-ESP-S", size: "S", colorSlug: "espresso", stock: 3 },
      { sku: "MS-VAL-ESP-M", size: "M", colorSlug: "espresso", stock: 4 },
      { sku: "MS-VAL-ESP-L", size: "L", colorSlug: "espresso", stock: 1 },
      { sku: "MS-VAL-ESP-XL", size: "XL", colorSlug: "espresso", stock: 3 },
    ],
    rating: 4.9,
    reviewCount: 36,
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  const sameCat = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const others = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  return [...sameCat, ...others].slice(0, count);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getDiscountPercent(
  price: number,
  originalPrice?: number
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
