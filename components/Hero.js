"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Placeholder from "./Placeholder";
import { Star, Arrow } from "./icons";
import TrustBar from "./TrustBar";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const sideNav = ["Science", "Quality", "Purpose", "Results"];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-200 pt-[104px]"
    >
      {/* soft diagonal light streaks */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[160%] w-1/3 -rotate-12 bg-gradient-to-b from-white/60 to-transparent blur-2xl" />
        <div className="absolute left-1/3 top-0 h-[160%] w-24 -rotate-12 bg-gradient-to-b from-white/40 to-transparent blur-xl" />
      </div>
      <div className="grain pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_60%,rgba(23,25,26,0.06)_100%)]" />

      <div className="container-x relative grid grid-cols-1 items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* Left — copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="label mb-6">
            Optimization is personal
          </motion.p>

          <motion.h1
            variants={item}
            className="display text-[clamp(2.6rem,6.5vw,5rem)]"
          >
            Precision
            <br />
            Compounds
            <br />
            For <span className="text-gold">Modern</span>
            <br />
            <span className="text-gold">Optimization.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-ink-soft"
          >
            Research-driven compounds curated for longevity, vitality, recovery,
            and performance.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <Link href="/catalog" className="btn-primary group">
              Explore Compounds
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/verification" className="btn-ghost">
              Verify Batch
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex items-center gap-6">
            <span className="text-[11px] font-semibold uppercase tracking-label text-ink">
              10,000+ optimizing daily
            </span>
            <span className="h-4 w-px bg-ink/15" />
            <div className="flex items-center gap-2">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4" />
                ))}
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-ink">4.9/5</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — product */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[380px]"
          >
            <Placeholder
              note="Placeholder"
              className="aspect-[4/5] w-full"
            />
          </motion.div>

          {/* side nav */}
          <motion.ul
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-7 md:flex"
          >
            {sideNav.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="h-px w-6 bg-ink/30" />
                <span
                  className={`text-[10px] font-semibold uppercase tracking-label ${
                    i === 0 ? "text-ink" : "text-ink-faint"
                  }`}
                >
                  {s}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <TrustBar />
    </section>
  );
}
