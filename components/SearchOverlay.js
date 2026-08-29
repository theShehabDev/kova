// Product search overlay.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Arrow } from "./icons";
import { useProducts } from "./ProductsContext";
import { useScrollLock } from "@/lib/useScrollLock";

const haystack = (p) =>
  [p.name, p.tagline, p.desc, p.categoryName, p.dose]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export default function SearchOverlay({ open, onClose }) {
  const products = useProducts();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useScrollLock(open);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    const terms = q.split(/\s+/);
    return products.filter((p) => {
      const hay = haystack(p);
      return terms.every((t) => hay.includes(t));
    });
  }, [q, products]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search compounds"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-[75] mx-auto w-full max-w-2xl px-3 pt-[112px] sm:px-4"
          >
            <div className="overflow-hidden rounded-xl border border-ink/10 bg-cream-50 shadow-[0_30px_80px_-30px_rgba(23,25,26,0.55)]">
              <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3.5 sm:px-5 sm:py-4">
                <Search className="h-5 w-5 shrink-0 text-ink-faint" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search compounds…"
                  aria-label="Search compounds"
                  className="w-full min-w-0 bg-transparent text-[16px] text-ink placeholder:text-ink-faint focus:outline-none sm:text-[15px]"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-cream-200 hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[min(55dvh,420px)] overflow-y-auto overscroll-contain sm:max-h-[min(60vh,420px)]">
                {!q && (
                  <p className="px-4 py-8 text-center text-[13px] text-ink-muted sm:px-5">
                    Search by compound name, vial size, or category.
                  </p>
                )}

                {q && results.length === 0 && (
                  <div className="px-4 py-10 text-center sm:px-5">
                    <p className="text-[14px] font-semibold text-ink">
                      No compounds match “{query.trim()}”.
                    </p>
                    <Link
                      href="/products"
                      onClick={onClose}
                      className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-gold-dark"
                    >
                      Browse the full catalog
                      <Arrow className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}

                {results.length > 0 && (
                  <ul className="divide-y divide-ink/10">
                    {results.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream-100 sm:gap-4 sm:px-5 sm:py-4"
                        >
                          <img
                            src={p.image}
                            alt=""
                            className="h-12 w-10 shrink-0 rounded object-contain sm:h-14 sm:w-11"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-serif text-[15px] font-medium text-ink sm:text-[17px]">
                              {p.name}
                            </p>
                            <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.12em] text-ink-muted sm:text-[11px]">
                              {[p.categoryName, p.dose].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                          <span className="shrink-0 whitespace-nowrap text-[13px] font-semibold text-ink sm:text-[14px]">
                            {p.priceFrom ? "From " : ""}${p.price.toFixed(2)}
                          </span>
                          <Arrow className="hidden h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold-dark sm:block" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {results.length > 0 && (
                <p className="border-t border-ink/10 px-4 py-3 text-[11px] text-ink-muted sm:px-5">
                  {results.length} {results.length === 1 ? "compound" : "compounds"}
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
