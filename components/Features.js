"use client";

import { motion } from "framer-motion";
import { Shield, Flask, Badge, Cap, Community } from "./icons";

const features = [
  { Icon: Shield, title: "Domestic Sourcing", text: "Lorem ipsum dolor sit amet." },
  { Icon: Flask, title: "Research Driven Standards", text: "Consectetur adipiscing elit sed do." },
  { Icon: Badge, title: "Premium Quality", text: "Eiusmod tempor incididunt ut labore." },
  { Icon: Cap, title: "Optimization Education", text: "Ut enim ad minim veniam quis." },
  { Icon: Community, title: "Community Focused", text: "Duis aute irure dolor in reprehenderit." },
];

export default function Features() {
  return (
    <section className="border-y border-ink/10 bg-cream-50">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-ink/10">
        {features.map(({ Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col items-center px-4 text-center lg:px-6"
          >
            <Icon className="h-8 w-8 text-gold transition-transform duration-300 group-hover:-translate-y-1" />
            <h3 className="mt-5 text-[11px] font-semibold uppercase tracking-label text-ink">
              {title}
            </h3>
            <p className="mt-3 max-w-[150px] text-[12px] leading-relaxed text-ink-muted">
              {text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
