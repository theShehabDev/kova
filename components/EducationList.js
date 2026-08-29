"use client";

import { motion } from "framer-motion";
import { articles } from "@/data/site";
import { Arrow, Book } from "./icons";

export default function EducationList() {
  const [featured, ...rest] = articles;

  return (
    <div className="container-x py-16 md:py-20">
      {/* featured */}
      <motion.a
        href="#"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="group mb-12 grid grid-cols-1 overflow-hidden border border-ink/10 bg-cream-50 lg:grid-cols-2"
      >
        <div
          className="relative min-h-[280px] overflow-hidden"
          style={{ background: "radial-gradient(120% 100% at 30% 20%, #7c8285 0%, #4a4f52 60%, #23262a 100%)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-white/10 transition-transform duration-700 group-hover:scale-105" />
          <Book className="absolute bottom-6 left-6 h-10 w-10 text-cream-50" />
        </div>
        <div className="flex flex-col justify-center p-10">
          <span className="label">{featured.tag} · Featured</span>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight text-ink">
            {featured.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{featured.excerpt}</p>
          <div className="mt-7 flex items-center gap-4">
            <span className="link-underline group-hover:text-gold">Read Article</span>
            <Arrow className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
            <span className="ml-auto text-[11px] uppercase tracking-label text-ink-muted">
              {featured.read} read
            </span>
          </div>
        </div>
      </motion.a>

      {/* grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a, i) => (
          <motion.a
            href="#"
            key={a.slug}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col border border-ink/10 bg-cream-50 p-7 transition-colors hover:border-ink/25"
          >
            <span className="label">{a.tag}</span>
            <h3 className="mt-4 flex-1 font-display text-xl font-bold uppercase leading-tight tracking-tight text-ink">
              {a.title}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{a.excerpt}</p>
            <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
              <span className="text-[11px] uppercase tracking-label text-ink-muted">{a.read} read</span>
              <Arrow className="h-4 w-4 text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
