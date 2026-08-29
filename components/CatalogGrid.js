// Product grid with category filtering.
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Arrow, Shield } from "./icons";
import { useProducts } from "./ProductsContext";
import PurityBadge from "./PurityBadge";

const groups = [
  { slug: "all", label: "All" },
  { slug: "Compounds", label: "Compounds" },
];

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

const chevronBg = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a1814' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  backgroundSize: "14px",
};

const doseLine = (p) => (p.variant ? `${p.variant} ${p.dose}` : p.dose);

export default function CatalogGrid() {
  const products = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = searchParams.get("category") || "all";
  const [active, setActive] = useState(initial);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setActive(searchParams.get("category") || "all");
  }, [searchParams]);

  const select = (slug) => {
    setActive(slug);
    const url = slug === "all" ? pathname : `${pathname}?category=${slug}`;
    router.replace(url, { scroll: false });
  };

  const shown = useMemo(() => {
    let filtered;
    if (active === "all" || active === "Compounds") {
      filtered = [...products]; // the current range is all Compounds
    } else {
      filtered = products.filter((p) => p.category === active); // legacy ?category= links
    }
    switch (sort) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [active, sort, products]);

  const isGroup = groups.some((g) => g.slug === active);

  return (
    <div className="container-x pb-14 pt-4 md:pb-16 lg:pt-8">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-5">
        {/* mobile: dropdown */}
        <label className="inline-flex flex-col lg:hidden">
          <span className="sr-only">Filter compounds</span>
          <select
            value={isGroup ? active : "all"}
            onChange={(e) => select(e.target.value)}
            className="cursor-pointer appearance-none bg-transparent pr-7 text-[16px] font-semibold text-ink focus:outline-none"
            style={{ ...chevronBg, backgroundPosition: "right center" }}
          >
            {groups.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.label}
              </option>
            ))}
          </select>
          <span className="mt-2 h-[2px] w-full max-w-[120px] bg-gold" />
        </label>

        {/* desktop: chips */}
        <div className="hidden items-center gap-2 lg:flex">
          {groups.map((g) => {
            const on = isGroup ? active === g.slug : g.slug === "all";
            return (
              <button
                key={g.slug}
                onClick={() => select(g.slug)}
                className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
                  on
                    ? "border border-gold/30 bg-cream-200/70 text-gold-dark"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        <label className="inline-flex items-center gap-3">
          <span className="text-[13px] text-ink-muted">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer appearance-none rounded-full border border-ink/15 bg-cream-50 py-2.5 pl-4 pr-10 text-[13px] font-semibold text-ink focus:border-gold focus:outline-none"
            style={chevronBg}
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* empty state */}
      {shown.length === 0 && (
        <div className="mt-10 rounded-xl border border-ink/10 bg-cream-50 px-8 py-16 text-center">
          <p className="font-serif text-2xl text-ink">Nothing here.</p>
          <p className="mt-3 text-[13px] text-ink-muted">
            No compounds match that filter.
          </p>
          <button
            onClick={() => select("all")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] px-6 py-3 text-[11px] font-semibold uppercase tracking-label text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.6),0_12px_28px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-300 hover:scale-[1.03]"
          >
            View All Compounds
            <Arrow className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* mobile: horizontal rows */}
      <motion.ul layout className="mt-8 space-y-6 lg:hidden">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products/${p.slug}`}
                className="group flex items-center gap-6 rounded-xl border border-ink/10 bg-cream-50 p-6 transition-all duration-300 hover:border-gold/50"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-36 w-24 shrink-0 rounded object-contain"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
                    {p.name}
                  </h2>
                  <p className="mt-1.5 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                    {doseLine(p)}
                  </p>
                  <PurityBadge product={p} className="mt-3" />
                  <span className="mt-4 block h-px w-10 bg-ink/15" />
                  <p className="mt-4 text-[16px] font-semibold text-ink">
                    {p.priceFrom ? "From " : ""}${p.price.toFixed(2)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-dark">
                    View Product
                    <Arrow className="h-4 w-4" />
                  </span>
                </div>
                <Arrow className="h-5 w-5 shrink-0 text-gold-dark transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* desktop: card grid */}
      <motion.div layout className="mt-10 hidden grid-cols-2 gap-6 lg:grid xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products/${p.slug}`}
                className="group flex h-full items-stretch gap-6 overflow-hidden rounded-2xl border border-ink/10 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_20px_44px_-24px_rgba(23,25,26,0.35)]"
              >
                <div className="flex min-w-0 flex-1 flex-col py-8 pl-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">
                    Compound
                  </p>
                  <h2 className="mt-3 font-serif text-[30px] font-medium leading-tight tracking-tight text-ink">
                    {p.name}
                  </h2>
                  {p.variant && (
                    <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">
                      {p.variant}
                    </p>
                  )}
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-dark">
                    {p.dose}
                  </p>
                  <PurityBadge product={p} className="mt-4 w-fit" />
                  <span className="mt-5 block h-px w-10 bg-ink/15" />
                  <p className="mt-5 text-[17px] font-semibold text-ink">
                    {p.priceFrom ? "From " : ""}${p.price.toFixed(2)}
                  </p>
                  <span className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-cream-200/80 px-5 py-3 text-[10px] font-semibold uppercase tracking-label text-ink transition-colors duration-300 group-hover:bg-gold group-hover:text-cream-50">
                    View Details
                    <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-[42%] shrink-0 self-stretch object-contain"
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* RUO card */}
      <div className="mt-6 flex items-center gap-5 rounded-xl border border-ink/10 bg-cream-200/60 px-6 py-6 sm:px-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink">
          <Shield className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink">
            Research Use Only
          </p>
          <p className="mt-1 text-[12px] text-ink-muted">Not for human consumption.</p>
        </div>
      </div>
    </div>
  );
}
