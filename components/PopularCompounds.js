"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow } from "./icons";
import { useProducts } from "./ProductsContext";
import PurityBadge from "./PurityBadge";

const ease = [0.22, 1, 0.36, 1];

const popular = [
  { slug: "glp3-rt", blurb: "Multi-Pathway Research Compound" },
  { slug: "bpc-157", blurb: "Stable Pentadecapeptide Research Compound" },
  { slug: "tb-500", blurb: "Actin-Regulating Research Peptide" },
];

export default function PopularCompounds() {
  const products = useProducts();
  const items = popular
    .map(({ slug, blurb }) => {
      const p = products.find((x) => x.slug === slug);
      return p ? { ...p, blurb } : null;
    })
    .filter(Boolean);

  return (
    <section className="border-t border-ink/10 bg-cream-100 py-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="flex items-center gap-6"
        >
          <span className="hairline h-px flex-1" />
          <h2 className="text-center text-[12px] font-bold uppercase tracking-[0.28em] text-gold-dark">
            Recently Tested
          </h2>
          <span className="hairline h-px flex-1" />
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease }}
            >
              <Link
                href={`/products/${p.slug}`}
                className="group flex h-full flex-col items-center rounded-xl border border-ink/10 bg-cream-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_16px_36px_-20px_rgba(23,25,26,0.35)]"
              >
                <img src={p.image} alt={p.name} className="h-40 w-full rounded object-contain" />
                <h3 className="mt-6 font-display text-[17px] font-bold uppercase tracking-[0.08em] text-ink">
                  {p.name}
                </h3>
                <span className="mt-3 rounded-full bg-cream-200 px-4 py-1 text-[10px] font-semibold tracking-[0.14em] text-ink-soft">
                  {p.dose}
                </span>
                <p className="mt-4 text-[12px] leading-relaxed text-ink-muted">{p.blurb}</p>
                <PurityBadge product={p} align="center" className="mt-4" />
                <span className="mt-6 flex items-center gap-2 border-t border-ink/10 pt-5 text-[10px] font-semibold uppercase tracking-label text-ink-soft transition-colors group-hover:text-gold-dark">
                  Shop Now
                  <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
