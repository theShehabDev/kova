"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow } from "./icons";
import { useProducts } from "./ProductsContext";
import PurityBadge from "./PurityBadge";

const ease = [0.22, 1, 0.36, 1];

const view = { once: false, amount: 0.3 };
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease } },
};
const card = {
  hidden: { opacity: 0, y: 44, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
};
const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

export default function FeaturedCompounds() {
  const featured = useProducts(); // full catalog range

  return (
    <section className="snap-start border-t border-ink/10 bg-cream-50 pb-28 pt-[90px]">
      <div className="container-x">
        {/* header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark"
            >
              The Catalog
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl"
            >
              Every compound. Verified without exception.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-xl text-[13px] leading-relaxed text-ink-muted"
            >
              ≥99% purity by HPLC. Independently analyzed batch by batch, with
              documentation matched to your order.
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-ink transition-colors hover:text-gold-dark"
            >
              View All Compounds
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* lineup */}
        <motion.div
          variants={cardStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="relative mt-14"
        >
          <ul
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-visible py-3 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-10 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {featured.map((p) => (
              <motion.li
                variants={card}
                key={p.slug}
                className="w-[236px] shrink-0 snap-start lg:w-auto"
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-ink/10 bg-cream-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_16px_36px_-20px_rgba(23,25,26,0.35)] lg:p-7"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-36 w-full rounded object-contain lg:h-52"
                  />
                  <h3 className="mt-5 text-center font-display text-[15px] font-bold uppercase tracking-[0.08em] text-ink lg:mt-7 lg:text-[17px]">
                    {p.name}
                  </h3>
                  <span className="mx-auto mt-3 rounded-full bg-cream-200 px-4 py-1 text-[10px] font-semibold tracking-[0.14em] text-ink-soft">
                    {p.dose}
                  </span>
                  <PurityBadge product={p} align="center" className="mt-3 self-center" />
                  <span aria-hidden="true" className="min-h-[20px] grow lg:min-h-[28px]" />
                  <span className="flex items-center justify-center gap-2 border-t border-ink/10 pt-4 text-[10px] font-semibold uppercase tracking-label text-ink-soft transition-colors group-hover:text-gold-dark lg:pt-6">
                    View Details
                    <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
