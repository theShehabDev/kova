"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Placeholder from "./Placeholder";
import { Bolt, Pulse, Spark, Brain, Gem, Plane, Arrow } from "./icons";

const MotionLink = motion.create(Link);

const categories = [
  { Icon: Bolt, slug: "performance", name: "Performance", text: "Lorem ipsum dolor sit amet, consectetur adipiscing.", panel: "#4a4f52", imgNote: "Placeholder" },
  { Icon: Pulse, slug: "recovery", name: "Recovery", text: "Sed do eiusmod tempor incididunt ut labore.", panel: "#33373a", imgNote: "Placeholder" },
  { Icon: Spark, slug: "vitality", name: "Vitality", text: "Ut enim ad minim veniam, quis nostrud.", panel: "#7c8285", imgNote: "Placeholder" },
  { Icon: Brain, slug: "cognitive", name: "Cognitive", text: "Duis aute irure dolor in reprehenderit.", panel: "#4a4f52", imgNote: "Placeholder" },
  { Icon: Gem, slug: "aesthetics", name: "Aesthetics", text: "Excepteur sint occaecat cupidatat non proident.", panel: "#33373a", imgNote: "Placeholder" },
  { Icon: Plane, slug: "longevity", name: "Travel & Longevity", text: "Sunt in culpa qui officia deserunt mollit.", panel: "#7c8285", imgNote: "Placeholder" },
];

export default function Categories() {
  return (
    <section id="categories" className="bg-cream-100 py-24">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="label mb-4">Explore by goal</p>
          <h2 className="display text-[clamp(1.9rem,4vw,2.9rem)]">
            Compounds for Every Goal
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-ink-muted">
            Research compounds organized by goal. Every one is tested for purity
            and potency before it ships.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ Icon, slug, name, text, panel, imgNote }, i) => (
            <MotionLink
              href={`/catalog?category=${slug}`}
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex h-[360px] flex-col overflow-hidden"
            >
              {/* image area */}
              <div className="relative flex-1 overflow-hidden border border-b-0 border-dashed border-ink/20">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.07]">
                  <Placeholder note={imgNote} frame={false} className="h-full w-full" />
                </div>
                <Icon className="absolute right-3 top-3 h-7 w-7 text-ink/20 transition-all duration-500 group-hover:scale-110 group-hover:text-ink/40" />
              </div>

              {/* panel */}
              <div
                className="relative p-4 text-cream-50 transition-transform duration-500"
                style={{ background: panel }}
              >
                <Icon className="h-5 w-5 text-cream-50" />
                <h3 className="mt-3 text-[11px] font-bold uppercase tracking-label">
                  {name}
                </h3>
                <p className="mt-2 text-[11px] leading-snug text-cream-50">
                  {text}
                </p>
                <span className="absolute bottom-4 right-4 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <Arrow className="h-4 w-4" />
                </span>
              </div>
            </MotionLink>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex justify-center"
        >
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-3 rounded-full border border-ink/25 px-8 py-4 text-[11px] font-semibold uppercase tracking-label text-ink transition-all duration-300 hover:bg-ink hover:text-cream-50"
          >
            View All Categories
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
