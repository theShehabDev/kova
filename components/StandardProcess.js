"use client";

import { motion } from "framer-motion";
import { standardSteps } from "@/data/site";

export default function StandardProcess() {
  return (
    <section className="bg-cream-100 py-20 md:py-24">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="label mb-4">The process</p>
          <h2 className="display text-[clamp(1.8rem,4vw,2.8rem)]">
            From Source to Shipment.
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-ink-muted">
            Every compound passes through the same four checks before it reaches
            you.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-4">
          {standardSteps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-cream-50 p-8 transition-colors hover:bg-cream-100"
            >
              <span className="font-display text-5xl font-extrabold text-clay transition-colors duration-300 group-hover:text-gold">
                {s.n}
              </span>
              <h3 className="mt-6 text-[12px] font-bold uppercase tracking-label text-ink">
                {s.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
