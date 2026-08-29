"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Arrow } from "./icons";
import TrustBar from "./TrustBar";

const ease = [0.22, 1, 0.36, 1];

const view = { once: false, amount: 0.25 };
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 44, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
};

function Headline() {
  return (
    <h1 className="font-condensed text-[clamp(2.1rem,5vw,3.8rem)] font-bold uppercase leading-[0.94] tracking-[0.01em] text-ink">
      <span className="block">Built for Research.</span>
      <span className="block text-transparent [-webkit-text-stroke:2px_rgb(var(--gold-dark))]">
        Made in America.
      </span>
      <span className="block text-gold-dark">Verified Every Batch.</span>
    </h1>
  );
}

const primaryButtonClass =
  "group relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-label text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.6),0_12px_28px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-300 hover:scale-[1.03]";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2.5 rounded-full border border-ink/30 bg-cream-50/50 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-label text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream-50";

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[calc(92svh+66px)] snap-start flex-col overflow-hidden pt-[104px] lg:min-h-0 lg:h-screen">
      <div className="absolute inset-0">
        <img
          src="/images/hero_image_new.jpeg"
          alt="KOVA Compounds"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream-100/80 via-cream-100/55 to-cream-200/85 lg:bg-gradient-to-r lg:from-cream-100/90 lg:via-cream-100/55 lg:to-cream-100/15" />
      </div>
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="container-x relative flex flex-1 items-center py-10 lg:pb-[10vh] lg:pt-0">
        {/* copy */}
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view}>
          <motion.div variants={fadeUp}>
            <Headline />
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-[330px] text-[14px] leading-relaxed text-ink-soft lg:mt-8 lg:max-w-lg"
          >
            Research compounds manufactured in the USA
            <br className="hidden lg:block" /> with third-party testing and
            complete batch traceability.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-4 lg:mt-9">
            <Link href="/products" className={primaryButtonClass}>
              <span className="grain pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" />
              <span className="relative">View Compounds</span>
              <Arrow className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/verification" className={secondaryButtonClass}>
              <Shield className="h-4 w-4" />
              Verify Batch
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <TrustBar />
    </section>
  );
}
