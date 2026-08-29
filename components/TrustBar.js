"use client";

import { motion } from "framer-motion";
import { Shield, Flask, Lock, FlagUS } from "./icons";

const ease = [0.25, 1, 0.36, 1];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const trustItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const trust = [
  { Icon: Flask, title: "Third Party Tested", sub: "By independent labs" },
  { Icon: Shield, title: "Batch Verified", sub: "Every single batch, traceable" },
  { Icon: FlagUS, title: "Made in USA", sub: "Synthesized and filled domestically", flag: true },
  { Icon: Lock, title: "Secure & Private", sub: "Your data stays yours" },
];

export default function TrustBar() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.5 }}
      className="relative border-t border-ink/10"
    >
      <div className="container-x grid grid-cols-2 gap-px lg:grid-cols-4">
        {trust.map(({ Icon, title, sub, flag }, i) => (
          <motion.div
            variants={trustItem}
            key={title}
            className={`flex items-center gap-2.5 px-2.5 py-3 sm:gap-3.5 sm:px-6 sm:py-5 ${
              i % 2 === 1 ? "border-l border-ink/10" : ""
            } ${i >= 2 ? "border-t border-ink/10" : ""} lg:border-t-0 ${
              i === 2 ? "lg:border-l lg:border-ink/10" : ""
            }`}
          >
            {flag ? (
              <Icon className="h-3.5 w-5 shrink-0 sm:h-[15px] sm:w-[22px]" />
            ) : (
              <Icon className="h-5 w-5 shrink-0 text-gold-dark sm:h-6 sm:w-6" />
            )}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink sm:text-[10px] sm:tracking-[0.16em]">{title}</p>
              <p className="mt-0.5 text-[9px] text-ink-muted sm:text-[10px]">{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
