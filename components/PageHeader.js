"use client";

import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, sub, accent }) {
  const renderTitle = () => {
    if (!accent || !title.includes(accent)) return title;
    const [before, after] = title.split(accent);
    return (
      <>
        {before}
        <span className="text-gold">{accent}</span>
        {after}
      </>
    );
  };

  return (
    <header className="relative overflow-hidden border-b border-ink/10 bg-gradient-to-b from-cream-100 to-cream-200 pt-[104px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[200%] w-1/3 -rotate-12 bg-gradient-to-b from-white/50 to-transparent blur-2xl" />
      </div>
      <div className="container-x relative py-20 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="label mb-5"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="display max-w-4xl text-[clamp(2.2rem,5.5vw,4.2rem)]"
        >
          {renderTitle()}
        </motion.h1>
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft"
          >
            {sub}
          </motion.p>
        )}
      </div>
    </header>
  );
}
