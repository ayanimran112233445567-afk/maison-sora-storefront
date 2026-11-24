"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PRODUCTS, PROMO_CODES } from "@/data/products";
import type {
  ApparelSize,
  CartItem,
  OrderRecord,
  Product,
  PromoCode,
  ShippingAddress,
} from "@/types/ecommerce";

const FREE_SHIPPING_THRESHOLD = 350;
const FLAT_SHIPPING_FEE = 18;
const TAX_RATE = 0.08;

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  orders: OrderRecord[];
  appliedPromo: PromoCode | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  getVariantStock: (
    productId: string,
    size: ApparelSize,
    colorSlug: string
  ) => number;
  getRemainingStock: (
    productId: string,
    size: ApparelSize,
    colorSlug: string
  ) => number;
  addToCart: (
    product: Product,
    size: ApparelSize,
    colorSlug: string,
    quantity?: number
  ) => { ok: boolean; message: string };
  updateQuantity: (key: string, nextQuantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  applyPromoCode: (rawCode: string) => { ok: boolean; message: string };
  removePromoCode: () => void;
  placeOrder: (
    shippingAddress: ShippingAddress,
    paymentLast4: string
  ) => OrderRecord;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  cart: "maison_sora_cart_v1",
  wishlist: "maison_sora_wishlist_v1",
  promo: "maison_sora_promo_v1",
  stock: "maison_sora_stock_overrides_v1",
  orders: "maison_sora_orders_v1",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>(
    {}
  );
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEYS.cart);
      const savedWishlist = localStorage.getItem(STORAGE_KEYS.wishlist);
      const savedPromo = localStorage.getItem(STORAGE_KEYS.promo);
      const savedStock = localStorage.getItem(STORAGE_KEYS.stock);
      const savedOrders = localStorage.getItem(STORAGE_KEYS.orders);

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedPromo) setAppliedPromo(JSON.parse(savedPromo));
      if (savedStock) setStockOverrides(JSON.parse(savedStock));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {
      // Ignore storage parsing issues on private sessions
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
      localStorage.setItem(STORAGE_KEYS.promo, JSON.stringify(appliedPromo));
      localStorage.setItem(STORAGE_KEYS.stock, JSON.stringify(stockOverrides));
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart, wishlist, appliedPromo, stockOverrides, orders, hydrated]);

  // Lock body scroll when any drawer or modal is open
  useEffect(() => {
    const isAnyOpen = isCartOpen || isWishlistOpen || isSearchOpen;
    document.body.style.overflow = isAnyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isWishlistOpen, isSearchOpen]);

  const getVariantStock = useCallback(
    (productId: string, size: ApparelSize, colorSlug: string): number => {
      const product = PRODUCTS.find((p) => p.id === productId);
      const variant = product?.variants.find(
        (v) => v.size === size && v.colorSlug === colorSlug
      );
      if (!variant) return 0;
      if (stockOverrides[variant.sku] !== undefined) {
        return Math.max(0, stockOverrides[variant.sku]);
      }
      return variant.stock;
    },
    [stockOverrides]
  );

  const getRemainingStock = useCallback(
    (productId: string, size: ApparelSize, colorSlug: string): number => {
      const baseStock = getVariantStock(productId, size, colorSlug);
      const key = `${productId}__${colorSlug}__${size}`;
      const inCartQty = cart.find((item) => item.key === key)?.quantity ?? 0;
      return Math.max(0, baseStock - inCartQty);
    },
    [cart, getVariantStock]
  );

  const addToCart = useCallback(
    (
      product: Product,
      size: ApparelSize,
      colorSlug: string,
      quantity = 1
    ): { ok: boolean; message: string } => {
      const variant = product.variants.find(
        (v) => v.size === size && v.colorSlug === colorSlug
      );
      const color = product.colors.find((c) => c.slug === colorSlug);
      if (!variant || !color) {
        return { ok: false, message: "Selected variant is unavailable." };
      }

      const maxStock = getVariantStock(product.id, size, colorSlug);
      if (maxStock <= 0) {
        return { ok: false, message: "This size is currently out of stock." };
      }

      const key = `${product.id}__${colorSlug}__${size}`;
      const existing = cart.find((item) => item.key === key);
      const currentQty = existing?.quantity ?? 0;

      if (currentQty + quantity > maxStock) {
        return {
          ok: false,
          message: `Only ${maxStock} left in stock for size ${size}.`,
        };
      }

      setCart((prev) => {
        const found = prev.find((item) => item.key === key);
        if (found) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.min(maxStock, item.quantity + quantity) }
              : item
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            sku: variant.sku,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0]?.url ?? "/images/prod-coat-front.jpg",
            size,
            colorName: color.name,
            colorHex: color.hex,
            colorSlug: color.slug,
            quantity,
          },
        ];
      });

      setIsWishlistOpen(false);
      setIsSearchOpen(false);
      setIsCartOpen(true);
      return { ok: true, message: "Added to shopping bag." };
    },
    [cart, getVariantStock]
  );

  const updateQuantity = useCallback(
    (key: string, nextQuantity: number) => {
      if (nextQuantity <= 0) {
        setCart((prev) => prev.filter((item) => item.key !== key));
        return;
      }
      setCart((prev) =>
        prev.map((item) => {
          if (item.key !== key) return item;
          const maxStock = getVariantStock(
            item.productId,
            item.size,
            item.colorSlug
          );
          return { ...item, quantity: Math.min(Math.max(1, maxStock), nextQuantity) };
        })
      );
    },
    [getVariantStock]
  );

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!appliedPromo || subtotal === 0) return 0;
    if (appliedPromo.minSubtotal && subtotal < appliedPromo.minSubtotal) {
      return 0;
    }
    if (appliedPromo.type === "percentage") {
      return Number(((subtotal * appliedPromo.value) / 100).toFixed(2));
    }
    if (appliedPromo.type === "fixed") {
      return Math.min(subtotal, appliedPromo.value);
    }
    return 0;
  }, [appliedPromo, subtotal]);

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    if (appliedPromo?.type === "free_shipping") return 0;
    if (subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD) return 0;
    return FLAT_SHIPPING_FEE;
  }, [subtotal, discountAmount, appliedPromo]);

  const taxAmount = useMemo(() => {
    const taxable = Math.max(0, subtotal - discountAmount);
    return Number((taxable * TAX_RATE).toFixed(2));
  }, [subtotal, discountAmount]);

  const totalAmount = useMemo(
    () =>
      Number(
        Math.max(0, subtotal - discountAmount + shippingCost + taxAmount).toFixed(
          2
        )
      ),
    [subtotal, discountAmount, shippingCost, taxAmount]
  );

  const freeShippingRemaining = useMemo(
    () => Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discountAmount)),
    [subtotal, discountAmount]
  );

  const applyPromoCode = useCallback(
    (rawCode: string): { ok: boolean; message: string } => {
      const normalized = rawCode.trim().toUpperCase();
      if (!normalized) {
        return { ok: false, message: "Please enter a promotional code." };
      }
      const match = PROMO_CODES.find((p) => p.code === normalized);
      if (!match) {
        return {
          ok: false,
          message: "Invalid code. Try ATELIER20, WELCOME10, SORA50, or FREESHIP.",
        };
      }
      if (match.minSubtotal && subtotal < match.minSubtotal) {
        return {
          ok: false,
          message: `Code ${match.code} requires a minimum bag subtotal of $${match.minSubtotal}.`,
        };
      }
      setAppliedPromo(match);
      return { ok: true, message: `${match.code} applied — ${match.description}.` };
    },
    [subtotal]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  const placeOrder = useCallback(
    (shippingAddress: ShippingAddress, paymentLast4: string): OrderRecord => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `MS-2026-${randomNum}`;
      const record: OrderRecord = {
        orderNumber,
        createdAt: new Date().toISOString(),
        items: [...cart],
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        tax: taxAmount,
        total: totalAmount,
        promoCode: appliedPromo?.code ?? null,
        shippingAddress,
        paymentLast4,
        status: "Confirmed",
      };

      // Decrement real-time inventory stock
      setStockOverrides((prev) => {
        const next = { ...prev };
        for (const item of cart) {
          const currentStock = getVariantStock(
            item.productId,
            item.size,
            item.colorSlug
          );
          next[item.sku] = Math.max(0, currentStock - item.quantity);
        }
        return next;
      });

      setOrders((prev) => [record, ...prev]);
      setCart([]);
      setAppliedPromo(null);
      return record;
    },
    [
      cart,
      subtotal,
      discountAmount,
      shippingCost,
      taxAmount,
      totalAmount,
      appliedPromo,
      getVariantStock,
    ]
  );

  const value: StoreContextValue = {
    cart,
    wishlist,
    orders,
    appliedPromo,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    totalAmount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((v) => !v),
    openWishlist: () => setIsWishlistOpen(true),
    closeWishlist: () => setIsWishlistOpen(false),
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
    getVariantStock,
    getRemainingStock,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    applyPromoCode,
    removePromoCode,
    placeOrder,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside <StoreProvider>");
  }
  return ctx;
}
