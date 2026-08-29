// Slide-out cart.
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import { useProducts } from "./ProductsContext";
import { Arrow, Bag } from "./icons";
import { useScrollLock } from "@/lib/useScrollLock";

const doseLine = (p) => (p.variant ? `${p.variant} ${p.dose}` : p.dose);

function pickUpsells(lines, products) {
  const inCart = new Set(lines.map((l) => l.product.slug));
  const cats = new Set(lines.map((l) => l.product.category));
  const candidates = products.filter((p) => !inCart.has(p.slug));
  const related = candidates.filter((p) => cats.has(p.category));
  const rest = candidates.filter((p) => !cats.has(p.category));
  return [...related, ...rest].slice(0, 3);
}

export default function CartDrawer() {
  const {
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
  } = useCart();
  const products = useProducts();

  useScrollLock(open);

  const upsells = pickUpsells(lines, products);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[55] bg-ink/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 top-0 z-[60] flex w-[380px] max-w-[92vw] flex-col border-l border-ink/10 bg-cream-50 shadow-[-24px_0_60px_-30px_rgba(26,24,20,0.4)]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <span className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.28em] text-ink-muted">
                <Bag className="h-4 w-4" />
                Cart {count > 0 && `(${count})`}
              </span>
              <button
                aria-label="Close cart"
                onClick={() => setOpen(false)}
                className="relative flex h-9 w-9 items-center justify-center"
              >
                <span className="absolute h-px w-5 rotate-45 bg-ink" />
                <span className="absolute h-px w-5 -rotate-45 bg-ink" />
              </button>
            </div>

            {/* lines */}
            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                  <p className="text-[13px] text-ink-muted">Your cart is empty.</p>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="btn-ghost !py-3 text-[10px]"
                  >
                    Browse Compounds
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-ink/10">
                  {lines.map(({ key, product, size, qty, price }) => (
                    <li key={key} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="h-20 w-16 shrink-0 border border-ink/10 bg-cream-100"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="truncate text-[12px] font-bold uppercase tracking-wide text-ink">
                            {product.name}
                          </p>
                          <span className="text-[12px] font-bold text-ink">
                            ${price * qty}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] uppercase tracking-label text-ink-muted">
                          {size.size}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-ink/15">
                            <button
                              aria-label={`Decrease ${product.name} ${size.size} quantity`}
                              onClick={() => setQty(key, qty - 1)}
                              className="flex h-7 w-7 items-center justify-center text-ink-soft transition-colors hover:bg-ink hover:text-cream-50"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-[12px] font-semibold text-ink">
                              {qty}
                            </span>
                            <button
                              aria-label={`Increase ${product.name} ${size.size} quantity`}
                              onClick={() => setQty(key, qty + 1)}
                              className="flex h-7 w-7 items-center justify-center text-ink-soft transition-colors hover:bg-ink hover:text-cream-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => remove(key)}
                            className="text-[10px] font-semibold uppercase tracking-label text-ink-muted transition-colors hover:text-ink"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* upsells */}
            {lines.length > 0 && upsells.length > 0 && (
              <div className="border-t border-ink/10 bg-cream-100 px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">
                  Pairs well with
                </p>
                <ul className="mt-3 space-y-3">
                  {upsells.map((p) => (
                    <li key={p.slug} className="flex items-center gap-3">
                      <div className="h-11 w-9 shrink-0 border border-ink/10 bg-cream-50">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-bold uppercase tracking-wide text-ink">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-ink-muted">
                          {doseLine(p)} · {p.priceFrom ? "From " : ""}${p.price}
                        </p>
                      </div>
                      <button
                        onClick={() => add(p.slug)}
                        className="shrink-0 rounded-full border border-ink/25 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-label text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream-50"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* footer */}
            {lines.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-label text-ink-muted">
                    Subtotal
                  </span>
                  <span className="font-display text-xl font-bold text-ink">${subtotal}</span>
                </div>
                <p className="mt-1 text-[10px] text-ink-faint">
                  Shipping calculated at checkout.
                </p>
                {checkoutError && (
                  <p className="mt-3 text-[11px] font-semibold text-red-700">
                    {checkoutError}
                  </p>
                )}
                <button
                  onClick={checkout}
                  disabled={checkingOut}
                  className="btn-primary group mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkingOut ? "Taking you to checkout…" : "Checkout"}
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
