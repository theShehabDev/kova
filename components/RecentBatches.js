"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow, CheckCircle, ChevronRight, FileCheck } from "./icons";

const ease = [0.22, 1, 0.36, 1];

export default function RecentBatches({ batches = [] }) {
  const [selected, setSelected] = useState(null);

  if (!batches.length) {
    return null;
  }

  return (
    <section id="batches" className="scroll-mt-[104px] border-t border-ink/10 bg-cream-50 py-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Recently Tested
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              Our latest batches
            </h2>
            <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-ink-muted">
              Every lot we release, published as it clears testing.
            </p>
          </div>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="mt-12 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-cream-100"
        >
          {batches.map((b) => {
            const open = selected === b.id;
            return (
              <li key={b.id}>
                <button
                  onClick={() => setSelected(open ? null : b.id)}
                  aria-expanded={open}
                  className={`grid w-full grid-cols-2 items-center gap-x-4 gap-y-1 px-6 py-5 text-left transition-colors sm:grid-cols-[1.4fr_1.4fr_1fr_auto_auto] md:px-8 ${
                    open ? "bg-cream-50" : "hover:bg-cream-50/60"
                  }`}
                >
                  <span className="text-[13px] font-semibold tracking-[0.08em] text-ink">{b.id}</span>
                  <span className="text-right text-[12px] text-ink-soft sm:text-left">
                    {b.product} · {b.dose}
                  </span>
                  <span className="text-[12px] text-ink-muted">{b.tested}</span>
                  <span className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-gold-dark">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </span>
                  <ChevronRight
                    className={`hidden h-4 w-4 justify-self-end text-ink-muted transition-transform duration-300 sm:block ${
                      open ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="border-t border-ink/10 bg-cream-50 px-6 py-6 md:px-8">
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[12px] sm:grid-cols-4">
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Purity</dt>
                        <dd className="mt-1 font-semibold text-ink">{b.purity}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Tested</dt>
                        <dd className="mt-1 font-semibold text-ink">{b.tested}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Laboratory</dt>
                        <dd className="mt-1 font-semibold text-ink">{b.laboratory}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Status</dt>
                        <dd className="mt-1 font-semibold text-gold-dark">Verified</dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={b.coaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-label text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream-50"
                      >
                        <FileCheck className="h-4 w-4" />
                        View COA
                      </a>
                      <Link
                        href={`/products/${b.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-label text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.6),0_12px_28px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-300 hover:scale-[1.03]"
                      >
                        Shop {b.product}
                        <Arrow className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
