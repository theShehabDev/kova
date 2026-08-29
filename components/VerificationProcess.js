"use client";

import { motion } from "framer-motion";
import { Building, Microscope, FileCheck, Shield } from "./icons";

const ease = [0.22, 1, 0.36, 1];

const steps = [
  {
    Icon: Building,
    title: "Manufactured in the USA",
    text: "Produced in US facilities under controlled conditions with documented process controls.",
  },
  {
    Icon: Microscope,
    title: "100% independently tested",
    text: "Every batch is analyzed by an independent third-party laboratory.",
  },
  {
    Icon: FileCheck,
    title: "Documented to the batch",
    text: "Your order ships with the COA for your specific batch.",
  },
  {
    Icon: Shield,
    title: "≥99% or it doesn't ship",
    text: "Material below specification is rejected, not discounted.",
  },
];

const view = { once: false, amount: 0.35 };
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};
const rule = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, delay: 0.25, ease } },
};
const col = {
  hidden: { opacity: 0, y: 34, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
};

export default function VerificationProcess() {
  return (
    <section className="border-t border-ink/10 bg-cream-50 py-28">
      <div className="container-x">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-[16px] font-bold uppercase tracking-[0.28em] text-ink"
          >
            How Every Batch Reaches You
          </motion.h2>
          <motion.span variants={rule} className="mx-auto mt-4 block h-px w-12 bg-gold" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-ink/10"
        >
          {steps.map(({ Icon, title, text }) => (
            <motion.div variants={col} key={title} className="px-6 text-center lg:px-10">
              <Icon className="mx-auto h-9 w-9 text-gold-dark" />
              <h3 className="mt-6 text-[13px] font-bold text-ink">{title}</h3>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
