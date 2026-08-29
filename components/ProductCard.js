"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow } from "./icons";
import PurityBadge from "./PurityBadge";

export default function ProductCard({ product, index = 0, categoryName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col border border-ink/10 bg-cream-50"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-contain"
        />
        <div className="border-t border-ink/10 p-5">
          <div className="flex items-center justify-between">
            <span className="label">{categoryName || product.category}</span>
            <span className="text-[11px] font-medium text-ink-muted">{product.dose}</span>
          </div>
          <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-tight text-ink">
            {product.name}
          </h3>
          <p className="mt-1 text-[12px] text-ink-muted">{product.tagline}</p>
          <PurityBadge product={product} className="mt-3" />
          <div className="mt-5 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-ink">
              {product.priceFrom && (
                <span className="mr-1 text-[11px] font-semibold uppercase tracking-label text-ink-muted">
                  From
                </span>
              )}
              ${product.price}
            </span>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:-translate-x-1">
              View
              <Arrow className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
