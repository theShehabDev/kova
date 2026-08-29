// Product page: vial size selection and add to cart.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Arrow, FileCheck } from "./icons";
import { useCart } from "./CartContext";

const specs = [
  { k: "Purity", v: "≥99% (HPLC verified)", purityClaim: true },
  { k: "Storage", v: "Refrigerate (2–8°C)" },
  { k: "Origin", v: "Made in the USA" },
];

export default function ProductDetail({ product, categoryName, related, currentBatch = null }) {
  const { add } = useCart();

  const sizes = product.sizes || [];
  const [sizeId, setSizeId] = useState(
    () => (sizes.find((s) => s.inStock) || sizes[0])?.id ?? null
  );

  useEffect(() => {
    if (sizes.length && !sizes.some((s) => s.id === sizeId)) {
      setSizeId((sizes.find((s) => s.inStock) || sizes[0]).id);
    }
  }, [sizes, sizeId]);

  const selected = sizes.find((s) => s.id === sizeId) || null;
  const canBuy = Boolean(selected?.inStock);
  const price = selected ? selected.price : product.price;

  const visibleSpecs = specs.filter(
    (s) => !s.purityClaim || product.showPurityClaim !== false
  );

  return (
    <main className="overflow-x-hidden pt-[104px]">
      {/* breadcrumb */}
      <div className="border-b border-ink/10 bg-cream-100">
        <div className="container-x flex items-center gap-2 py-4 text-[11px] uppercase tracking-label text-ink-muted">
          <Link href="/products" className="transition-colors hover:text-ink">Products</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </div>
      </div>

      <section className="bg-gradient-to-b from-cream-100 to-cream-200">
        <div className="container-x grid grid-cols-1 gap-12 py-16 lg:grid-cols-2 lg:py-24">
          {/* visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border border-ink/10"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-[420px] w-full object-contain md:h-[540px]"
            />
          </motion.div>

          {/* info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3">
              <span className="label">{categoryName}</span>
            </div>

            <h1 className="display mt-4 text-[clamp(2.2rem,5vw,3.4rem)]">{product.name}</h1>
            <p className="mt-3 text-[14px] uppercase tracking-label text-gold-dark">
              {[product.tagline, product.dose].filter(Boolean).join(" · ")}
            </p>

            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-4xl font-extrabold text-ink">
                ${price}
              </span>
              <span className="pb-1.5 text-[12px] text-ink-muted">
                per vial{selected ? ` · ${selected.size}` : ""}
              </span>
            </div>

            {sizes.length > 1 && (
              <div className="mt-8">
                <p className="label mb-3">Vial Size</p>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!s.inStock}
                      onClick={() => s.inStock && setSizeId(s.id)}
                      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wide transition-colors ${
                        !s.inStock
                          ? "cursor-not-allowed border-ink/10 bg-cream-100 text-ink-faint"
                          : s.id === sizeId
                          ? "border-ink bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] text-cream-50"
                          : "border-ink/30 text-ink hover:border-ink"
                      }`}
                    >
                      {s.size}
                      {!s.inStock && (
                        <span className="text-[9px] font-medium normal-case tracking-normal opacity-70">
                          Sold out
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => selected && add(product.slug, 1, selected.id)}
                disabled={!canBuy}
                className="btn-primary group disabled:cursor-not-allowed disabled:opacity-50"
              >
                {canBuy ? "Add to Cart" : "Out of Stock"}
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <dl
              className={`mt-10 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 ${
                visibleSpecs.length === 3 ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              {visibleSpecs.map((s) => (
                <div key={s.k} className="bg-cream-50 p-4">
                  <dt className="label">{s.k}</dt>
                  <dd className="mt-1.5 font-display text-sm font-bold text-ink">{s.v}</dd>
                </div>
              ))}
            </dl>

            {currentBatch && (
              <div className="mt-6 rounded-sm border border-ink/10 bg-cream-50 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="label">Current batch</p>
                  <p className="text-[11px] text-ink-muted">
                    Tested {currentBatch.tested}
                  </p>
                </div>
                <p className="mt-2 font-display text-sm font-bold text-ink">
                  {currentBatch.id}
                  {currentBatch.purityValue && product.showPurityClaim !== false
                    ? ` · ${currentBatch.purityValue}`
                    : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={currentBatch.coaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-label text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream-50"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    View COA
                  </a>
                  <Link
                    href={`/verification/${encodeURIComponent(currentBatch.id)}`}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-label text-ink-muted transition-colors hover:text-ink"
                  >
                    Verify this batch
                    <Arrow className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            <p className="mt-8 text-[12px] font-bold uppercase tracking-label text-ink">
              For laboratory research use only.
            </p>
          </motion.div>
        </div>
      </section>

      {product.descriptionHtml && (
        <section className="border-t border-ink/10 bg-cream-50 py-20 lg:py-24">
          <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="label mb-3">Details</p>
              <h2 className="display text-[clamp(1.6rem,3.5vw,2.4rem)]">
                About {product.name}
              </h2>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink-muted">
                Research applications, specifications, and the questions we get
                asked most. Still need something? Reach out to research support.
              </p>
            </div>

            <div
              className="woo-prose max-w-none text-[14px] leading-relaxed text-ink-soft"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </section>
      )}

      {/* related */}
      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-cream-100 py-28">
          <div className="container-x">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="label mb-3">More to explore</p>
                <h2 className="display text-[clamp(1.6rem,3.5vw,2.4rem)]">Related Compounds</h2>
              </div>
              <Link href="/products" className="link-underline group hover:text-gold">
                View all
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} categoryName={categoryName} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
