"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow } from "./icons";
import { useProducts } from "./ProductsContext";
import PurityBadge from "./PurityBadge";

const loremShort = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
];

const featuredSlugs = ["glp3-rt", "bpc-157", "ghk-cu"];

export default function FeaturedRow() {
  const products = useProducts();
  const featured = featuredSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-cream-50 py-24">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="label mb-4">The catalog</p>
            <h2 className="display text-[clamp(1.9rem,4vw,2.9rem)]">
              Featured Compounds
            </h2>
          </div>
          <Link href="/catalog" className="link-underline group hover:text-gold">
            View Full Catalog
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {featured.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/catalog/${p.slug}`}
                className="group flex h-full flex-col border border-ink/10 bg-cream-100 transition-colors duration-300 hover:border-gold/60"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="aspect-square w-full border-b border-ink/15 object-contain"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                      {p.name}
                    </h3>
                    <span className="text-[13px] font-semibold text-gold-dark">${p.price}</span>
                  </div>
                  <p className="label mt-1 !text-[9px]">{p.dose} · {p.tagline}</p>
                  <p className="mt-4 flex-1 text-[12px] leading-relaxed text-ink-muted">
                    {loremShort[i]}
                  </p>
                  <PurityBadge product={p} className="mt-4" />
                  <span className="link-underline mt-6 group-hover:text-gold">
                    View Compound
                    <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
