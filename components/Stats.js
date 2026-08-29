"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

const stats = [
  { figure: "≥99%", k: "Purity floor, HPLC verified" },
  { to: 100, suffix: "%", k: "Lots independently tested" },
  { to: 100, suffix: "%", k: "Synthesized in the USA" },
  { figure: "2PM ET", k: "Same-day dispatch cutoff" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-coal py-16 text-cream-100">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.16]" />
      <div className="container-x relative grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="font-serif text-4xl font-medium text-cream-50 md:text-5xl">
              {s.figure ? s.figure : <CountUp to={s.to} suffix={s.suffix} />}
            </div>
            <div className="mt-3 text-[10px] font-semibold uppercase tracking-label text-cream-100">
              {s.k}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
