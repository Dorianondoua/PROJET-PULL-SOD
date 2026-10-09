import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { PRODUCTS } from "@/data/products";

/* Front-end only: the bag, the wishlist, the open panel and the toasts live
   in memory and reset on reload. Shared through context so every page (and
   the drawers mounted in _app) see the same state. */

export type CartLine = { productId: number; size: string; qty: number };
export type Toast = { id: number; kind: "bag" | "wishlist"; productId: number; size?: string };
export type Panel = "bag" | "wishlist" | null;

export const FREE_SHIPPING_FROM = 150;
export const SHIPPING_FEE = 8;
export const MAX_QTY = 9;
/** The only code the mock checkout accepts. */
export const PROMO = { code: "WELCOME10", rate: 0.1 };

/** Bag totals. `shipping` overrides the default rule (free from $150, else $8), e.g. express at checkout. */
export function priceCart(cart: CartLine[], promo: boolean, shipping?: number) {
  const subtotal = cart.reduce((s, l) => s + PRODUCTS.find((p) => p.id === l.productId)!.price * l.qty, 0);
  const discount = promo ? Math.round(subtotal * PROMO.rate) : 0;
  const ship = shipping ?? (cart.length === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE);
  return { subtotal, discount, shipping: ship, total: subtotal - discount + ship };
}

type Shop = {
  cart: CartLine[];
  cartCount: number;
  addToCart: (productId: number, size: string) => void;
  setQty: (productId: number, size: string, qty: number) => void;
  removeLine: (productId: number, size: string) => void;
  clearCart: () => void;
  /** Whether PROMO is applied to the bag. */
  promo: boolean;
  /** Returns false (and leaves the bag as is) for an unknown code. */
  applyPromo: (code: string) => boolean;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  panel: Panel;
  openPanel: (panel: Exclude<Panel, null>) => void;
  closePanel: () => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const ShopContext = createContext<Shop | null>(null);
const same = (l: CartLine, productId: number, size: string) => l.productId === productId && l.size === size;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [promo, setPromo] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [panel, setPanel] = useState<Panel>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const toastId = useRef(0);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    // Newest last; keep at most three on screen.
    setToasts((list) => [...list, { ...t, id }].slice(-3));
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const addToCart = useCallback(
    (productId: number, size: string) => {
      setCart((c) =>
        c.some((l) => same(l, productId, size))
          ? c.map((l) => (same(l, productId, size) ? { ...l, qty: Math.min(MAX_QTY, l.qty + 1) } : l))
          : [...c, { productId, size, qty: 1 }],
      );
      pushToast({ kind: "bag", productId, size });
    },
    [pushToast],
  );
  const setQty = useCallback((productId: number, size: string, qty: number) => {
    setCart((c) =>
      qty <= 0 ? c.filter((l) => !same(l, productId, size)) : c.map((l) => (same(l, productId, size) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);
  const removeLine = useCallback((productId: number, size: string) => setCart((c) => c.filter((l) => !same(l, productId, size))), []);
  const clearCart = useCallback(() => {
    setCart([]);
    setPromo(false);
  }, []);
  const applyPromo = useCallback((code: string) => {
    const ok = code.trim().toUpperCase() === PROMO.code;
    if (ok) setPromo(true);
    return ok;
  }, []);

  const toggleWishlist = useCallback(
    (id: number) => {
      // Decided from the current list, not inside the updater: the toast must fire once.
      const adding = !wishlist.includes(id);
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
      if (adding) pushToast({ kind: "wishlist", productId: id });
    },
    [wishlist, pushToast],
  );

  const openPanel = useCallback((p: Exclude<Panel, null>) => {
    setMenuOpen(false);
    setPanel(p);
  }, []);
  const closePanel = useCallback(() => setPanel(null), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const value = useMemo<Shop>(
    () => ({
      cart,
      cartCount: cart.reduce((s, l) => s + l.qty, 0),
      addToCart,
      setQty,
      removeLine,
      clearCart,
      promo,
      applyPromo,
      wishlist,
      toggleWishlist,
      panel,
      openPanel,
      closePanel,
      toasts,
      dismissToast,
      menuOpen,
      openMenu,
      closeMenu,
    }),
    [cart, addToCart, setQty, removeLine, clearCart, promo, applyPromo, wishlist, toggleWishlist, panel, openPanel, closePanel, toasts, dismissToast, menuOpen, openMenu, closeMenu],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("useShop must be used inside <ShopProvider>");
  return shop;
}
