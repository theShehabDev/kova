"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "./icons";

const ease = [0.22, 1, 0.36, 1];

const checks = [
  "≥99% purity confirmed by HPLC on your exact batch",
  "Identity verified by mass spectrometry",
  "Full batch and order history in your account",
  "Documentation available before your order ships",
];

const view = { once: false, amount: 0.35 };
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease } },
};
const checkItem = {
  hidden: { opacity: 0, x: -22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
};
const phone = {
  hidden: { opacity: 0, y: 72, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.05, ease } },
};

export default function Verification() {
  return (
    <section className="relative snap-start overflow-hidden border-t border-ink/10 bg-cream-200">
      {/* warm backdrop wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-cream-200 via-cream-200 to-clay/50" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.14]" />

      <div className="container-x relative grid items-center gap-14 py-24 lg:grid-cols-2">
        {/* copy + checklist */}
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view}>
          <motion.p
            variants={fadeUp}
            className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark"
          >
            Batch Verification
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl"
          >
            Scan the vial. See the analysis.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-[14px] leading-relaxed text-ink-soft"
          >
            Every vial carries a batch code linked to its own analytical record 
            not a generic sample report.
          </motion.p>
          <ul className="mt-6 space-y-4">
            {checks.map((c) => (
              <motion.li variants={checkItem} key={c} className="flex items-center gap-3.5">
                <CheckCircle className="h-5 w-5 shrink-0 text-gold-dark" />
                <span className="text-[13px] font-medium text-ink">{c}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="flex items-center justify-center"
        >
          <motion.div variants={phone} className="w-full">
            <img
              src="/images/phone-app.png"
              alt="KOVA Compounds mobile account app"
              className="mx-auto h-[420px] w-auto max-w-full rounded-2xl object-contain drop-shadow-[0_36px_70px_-28px_rgba(23,25,26,0.6)] sm:h-[520px] lg:h-[600px]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
