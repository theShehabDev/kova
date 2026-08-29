"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow } from "./icons";

const ease = [0.22, 1, 0.36, 1];

const OPERATIONS = [
  {
    img: "/images/op-lab.jpg",
    alt: "Laboratory bench with analytical glassware and a microscope",
    eyebrow: "Independent Testing",
    title: "Analyzed before it ships",
    body: "Every lot goes to a third-party lab for purity and identity. Results published by batch number. Check yours before you buy.",
    cta: "View COAs",
    href: "/verification",
  },
  {
    img: "/images/op-flag.jpg",
    alt: "United States flag in soft daylight",
    eyebrow: "US Synthesis",
    title: "Made here, not imported",
    body: "Synthesized, tested, and filled in US facilities. Nothing sourced overseas, nothing repackaged, nothing held at customs.",
    cta: "Our Standards",
    href: "/about",
  },
  {
    img: "/images/op-packaging.jpg",
    alt: "KOVA shipping box containing four labelled vials and batch paperwork",
    eyebrow: "2-Day Delivery",
    title: "Out the door in 24 hours",
    body: "Orders in by 2PM ET ship same day via USPS Priority. Tracked from our facility to your door.",
    cta: "Shipping Policy",
    href: "/shipping",
  },
];

const view = { once: false, amount: 0.2 };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};
const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

export default function Promises() {
  return (
    <section className="snap-start bg-coal-deep py-24 lg:py-28">
      <div className="container-x">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
          className="text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-[10px] font-bold uppercase tracking-[0.32em] text-cream-100"
          >
            How We Operate
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold leading-[1.05] tracking-tight text-cream-50"
          >
            Synthesized here. Verified here.
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
          className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-7"
        >
          {OPERATIONS.map((p) => (
            <motion.article
              variants={card}
              key={p.eyebrow}
              className="group flex flex-col overflow-hidden rounded-sm border border-cream-100/10 bg-coal transition-all duration-300 hover:-translate-y-1 hover:border-cream-100/30"
            >
              <div className="overflow-hidden">
                <img
                  src={p.img}
                  alt={p.alt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col p-8 lg:p-9">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cream-100">
                  {p.eyebrow}
                </p>
                <h3 className="mt-4 font-display text-[24px] font-extrabold leading-tight tracking-tight text-cream-50">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-[38ch] flex-1 text-[13px] leading-relaxed text-cream-100">
                  {p.body}
                </p>
                <Link
                  href={p.href}
                  className="mt-7 inline-flex w-fit items-center gap-2.5 border-b border-cream-100/30 pb-1.5 text-[10px] font-semibold uppercase tracking-label text-cream-50 transition-colors duration-300 hover:border-gold-soft hover:text-cream-50"
                >
                  {p.cta}
                  <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
