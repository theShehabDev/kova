// Batch lookup UI.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow, CheckCircle, FileCheck } from "./icons";

const ease = [0.22, 1, 0.36, 1];

export default function VerificationCenter({ initialBatch = null, initialQuery = "" }) {
  const seed = () => {
    if (initialBatch) return { status: "ok", batch: initialBatch };
    if (initialQuery) return { status: "missing", q: initialQuery };
    return null;
  };

  const [value, setValue] = useState(initialBatch?.id || initialQuery || "");
  const [result, setResult] = useState(seed);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialBatch || initialQuery) {
      setValue(initialBatch?.id || initialQuery);
      setResult(seed());
    }
  }, [initialBatch, initialQuery]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || pending) return;

    setPending(true);
    try {
      const res = await fetch(`/api/verify?batch=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResult(
        data.found ? { status: "ok", batch: data.batch } : { status: "missing", q }
      );
    } catch {
      setResult({ status: "error" });
    } finally {
      setPending(false);
    }
  };

  return (
    <section id="verify" className="scroll-mt-[104px] border-t border-ink/10 bg-cream-50 py-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
            Batch Verification
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            Scan the vial. See the analysis.
          </h2>
          <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-ink-muted">
            Every vial carries a batch code linked to its own analytical record,
            not a generic sample report.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* batch number lookup */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="rounded-xl border border-ink/10 bg-cream-100 p-8 md:p-10"
          >
            <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-ink">
              Look up a batch number
            </h3>
            <p className="mt-2 text-[12px] text-ink-muted">
              Enter the batch number printed under the QR code on your vial. You
              get the analytical record for that exact lot, not a sample report.
            </p>
            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. Batch No. 1"
                aria-label="Batch number"
                className="w-full min-w-0 border border-ink/20 bg-cream-50 px-4 py-3.5 text-[13px] tracking-[0.08em] text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={pending}
                className="shrink-0 rounded-full bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-label text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.6),0_12px_28px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Checking…" : "Verify Batch"}
              </button>
            </form>

            {result?.status === "ok" && (
              <div className="mt-6 rounded-lg border border-gold/40 bg-cream-50 p-6">
                <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                  <CheckCircle className="h-5 w-5" />
                  Batch Verified
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-[12px]">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Batch</dt>
                    <dd className="mt-1 font-semibold text-ink">{result.batch.id}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Product</dt>
                    <dd className="mt-1 font-semibold text-ink">
                      {result.batch.product} · {result.batch.dose}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Purity</dt>
                    <dd className="mt-1 font-semibold text-ink">{result.batch.purity}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Tested</dt>
                    <dd className="mt-1 font-semibold text-ink">{result.batch.tested}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">Laboratory</dt>
                    <dd className="mt-1 font-semibold text-ink">{result.batch.laboratory}</dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={result.batch.coaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-label text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream-50"
                  >
                    <FileCheck className="h-4 w-4" />
                    View Full COA
                  </a>
                  {result.batch.slug && (
                    <Link
                      href={`/products/${result.batch.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-label text-cream-50 transition-colors hover:bg-gold-dark"
                    >
                      Shop {result.batch.product}
                      <Arrow className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
            {result?.status === "missing" && (
              <div className="mt-6 rounded-lg border border-ink/15 bg-cream-50 p-6">
                <p className="text-[12px] font-semibold text-ink">
                  No batch found for “{result.q}”.
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                  Double check the number printed under the QR code on your
                  vial, or have a look at the recent batches below.
                </p>
              </div>
            )}
            {result?.status === "error" && (
              <div className="mt-6 rounded-lg border border-ink/15 bg-cream-50 p-6">
                <p className="text-[12px] font-semibold text-ink">
                  We couldn’t reach the batch records just now.
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
                  This is a problem on our end, not with your batch. Try again
                  in a moment, or contact research support.
                </p>
              </div>
            )}
          </motion.div>

          {/* QR scan card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="flex flex-col items-center gap-8 rounded-xl border border-ink/10 bg-cream-100 p-8 text-center sm:flex-row sm:text-left md:p-10"
          >
            <img
              src="/images/phone-app.png"
              alt="KOVA Compounds mobile account app"
              className="h-[320px] w-auto max-w-full shrink-0 rounded-xl object-contain sm:h-[380px] md:h-[420px]"
            />
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-ink">
                Or scan the code on the vial
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                Every vial carries a QR code tied to its own batch record. Point
                a phone camera at it and the analysis for that lot loads. No
                login, no app to install.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "≥99% purity confirmed by HPLC on your exact batch",
                  "Identity verified by mass spectrometry",
                  "Full batch and order history in your account",
                  "Documentation available before your order ships",
                ].map((c) => (
                  <li
                    key={c}
                    className="flex items-center justify-center gap-2.5 text-[12px] font-medium text-ink sm:justify-start"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-gold-dark" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
