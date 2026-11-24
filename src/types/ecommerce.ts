export type Category = "Women" | "Men" | "Unisex" | "Outerwear";

export type ApparelSize = "S" | "M" | "L" | "XL";

export interface ColorOption {
  name: string;
  slug: string;
  hex: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  angle: "Front" | "Silhouette" | "Detail";
}

export interface ProductVariant {
  sku: string;
  size: ApparelSize;
  colorSlug: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: Category;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  popularity: number;
  createdAt: string;
  description: string;
  craftsmanship: string[];
  composition: string;
  care: string[];
  fitNotes: string;
  colors: ColorOption[];
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  key: string;
  productId: string;
  sku: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: ApparelSize;
  colorName: string;
  colorHex: string;
  colorSlug: string;
  quantity: number;
}

export interface PromoCode {
  code: string;
  description: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minSubtotal?: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode: string | null;
  shippingAddress: ShippingAddress;
  paymentLast4: string;
  status: "Confirmed";
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  badge?: string;
  image: string;
  imageAlt: string;
}

export interface FeaturedCollection {
  category: Category;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface PriceBracket {
  id: string;
  label: string;
  min: number;
  max: number;
}
