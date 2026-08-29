"use client";

import { motion } from "framer-motion";
import { Star, Badge, FileCheck, FlagUS, Headset } from "./icons";

const ease = [0.22, 1, 0.36, 1];

const points = [
  { Icon: Badge, label: "Accredited\nLabs" },
  { Icon: FileCheck, label: "Full COA\nAccess" },
  { Icon: FlagUS, label: "US\nSynthesized", full: true },
  { Icon: Headset, label: "Direct\nSupport" },
];

export default function TrustBand() {
  return (
    <section className="border-t border-ink/10 bg-cream-100 py-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="rounded-2xl border border-ink/10 bg-cream-200/60 px-8 py-14 text-center md:px-16"
        >
          <div className="flex items-center justify-center gap-1.5 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4" />
            ))}
          </div>
          <h2 className="mt-6 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            Verify anything, anytime
          </h2>
          <p className="mt-4 text-[13px] text-ink-muted">
            Receipts on every lot we&apos;ve released.
          </p>

          <span className="hairline mx-auto mt-12 block h-px max-w-2xl" />

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-10 lg:grid-cols-4">
            {points.map(({ Icon, label, full }, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <span className="flex h-8 items-center">
                  <Icon
                    className={full ? "h-6 w-auto rounded-[2px]" : "h-8 w-8 text-gold-dark"}
                  />
                </span>
                <span className="whitespace-pre-line text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
