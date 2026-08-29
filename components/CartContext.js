// Cart state, persisted to localStorage.
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartKey, defaultSize, resolveCartKey } from "@/lib/cart";

const CartContext = createContext(null);

const STORAGE_KEY = "kova-cart";

export function CartProvider({ products = [], children }) {
  const [items, setItems] = useState({});
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    if (document.cookie.includes("kova_order_complete=")) {
      document.cookie =
        "kova_order_complete=; Max-Age=0; path=/; domain=.kovacompounds.com";
      document.cookie = "kova_order_complete=; Max-Age=0; path=/";
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setHydrated(true);
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (saved && typeof saved === "object") setItems(saved);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = (slug, qty = 1, sizeId) => {
    const id =
      sizeId || defaultSize(products.find((p) => p.slug === slug))?.id;
    if (!id) return;
    const key = cartKey(slug, id);
    setItems((prev) => ({ ...prev, [key]: (prev[key] || 0) + qty }));
    setOpen(true);
  };
  const remove = (key) =>
    setItems((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  const setQty = (key, qty) => {
    if (qty <= 0) return remove(key);
    setItems((prev) => ({ ...prev, [key]: qty }));
  };

  const checkout = async () => {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err.message);
      setCheckingOut(false);
    }
  };

  const value = useMemo(() => {
    const lines = Object.entries(items)
      .map(([key, qty]) => {
        const hit = resolveCartKey(key, products);
        return hit ? { key, ...hit, qty, price: hit.size.price } : null;
      })
      .filter(Boolean);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return {
      lines,
      count,
      subtotal,
      add,
      remove,
      setQty,
      open,
      setOpen,
      checkout,
      checkingOut,
      checkoutError,
    };
  }, [items, open, products, checkingOut, checkoutError]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
