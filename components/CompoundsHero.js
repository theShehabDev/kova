"use client";

import { motion } from "framer-motion";
import TrustBar from "./TrustBar";

const ease = [0.22, 1, 0.36, 1];

export default function CompoundsHero() {
  return (
    <section className="relative overflow-hidden pt-[104px]">

      <div className="container-x relative py-20 lg:pb-8 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="max-w-2xl"
        >
          <h1 className="font-serif text-[52px] font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            <span className="lg:hidden">Compounds</span>
            <span className="hidden lg:inline">Our Compounds</span>
          </h1>
          <span className="mt-6 block h-[2px] w-16 bg-gold lg:hidden" />
          <p className="mt-7 text-[15px] leading-relaxed text-ink-soft lg:mt-5">
            Synthesized and tested in the USA.
            <br className="lg:hidden" />{" "}
            ≥99% purity by HPLC.
            <br className="lg:hidden" />{" "}
            A batch-specific COA with every order.
          </p>
        </motion.div>
      </div>

      <TrustBar />
    </section>
  );
}
