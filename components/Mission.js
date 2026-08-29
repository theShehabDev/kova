"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Placeholder from "./Placeholder";
import { Arrow } from "./icons";

export default function Mission() {
  return (
    <section id="about" className="bg-cream-100 pb-24 pt-24">
      <div className="container-x">
        <div className="grid grid-cols-1 overflow-hidden rounded-sm lg:grid-cols-2">
          {/* copy panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col justify-center overflow-hidden bg-clay/60 p-10 md:p-14"
          >
            {/* giant faint monogram */}
            <span className="pointer-events-none absolute -right-6 bottom-0 font-display text-[14rem] font-extrabold leading-none text-ink/[0.06]">
              K
            </span>
            <p className="label mb-5">Our mission</p>
            <h2 className="display text-[clamp(1.9rem,4vw,3rem)]">
              Raise the
              <br />
              Standard.
            </h2>
            <p className="mt-6 max-w-md text-[14px] leading-relaxed text-ink-soft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation.
            </p>
            <Link href="/about" className="btn-ghost group mt-9 self-start">
              Our Story
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* image panel */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[320px] overflow-hidden"
          >
            <Placeholder
              note="Placeholder"
              className="absolute inset-0 h-full w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
