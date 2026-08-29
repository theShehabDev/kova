"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ChevronRight, Arrow } from "./icons";
import TrustBar from "./TrustBar";

const ease = [0.22, 1, 0.36, 1];

const trust = [{ Icon: Shield, label: "Third-Party\nTested" }];

function Headline() {
  return (
    <h1 className="font-condensed text-[clamp(calc(3.6rem+12px),calc(7.2vw+12px),calc(6.8rem+12px))] font-bold uppercase leading-[0.88] tracking-[0.01em] text-ink">
      <span className="block">Every</span>
      <span className="block text-transparent [-webkit-text-stroke:2px_rgb(var(--gold-dark))]">
        Batch
      </span>
      <span className="block text-gold-dark">Verified.</span>
    </h1>
  );
}

const primaryButtonClass =
  "group relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-label text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.6),0_12px_28px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-300 hover:scale-[1.03]";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2.5 rounded-full border border-ink/30 bg-cream-50/50 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-label text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-cream-50";

export default function VerificationHero() {
  return (
    <section className="relative overflow-hidden pt-[104px]">
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-200 to-clay/70" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="container-x relative grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8 lg:py-12">
        {/* copy */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
        >
          <Headline />
          <p className="mt-5 max-w-[360px] text-[14px] leading-relaxed text-ink-soft">
            Independent lab analysis on every lot.
            <br />
            Enter your batch number to pull the certificate.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="/products" className={secondaryButtonClass}>
              Shop Compounds
              <Arrow className="h-4 w-4 transition-transform duration-300" />
            </Link>
            <a href="#verify" className={primaryButtonClass}>
              <span className="grain pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" />
              <Shield className="relative h-4 w-4" />
              <span className="relative">Verify Batch</span>
            </a>
          </div>

          <div className="mt-8 flex divide-x divide-ink/15">
            {trust.map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-start gap-3 pr-8 [&:not(:first-child)]:pl-8">
                <Icon className="h-7 w-7 text-gold-dark" />
                <span className="whitespace-pre-line text-[9px] font-bold uppercase leading-relaxed tracking-[0.16em] text-ink-soft">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="relative"
        >
          <img
            src="/images/verification-hero.webp"
            alt="A KOVA Compounds presentation box holding three labelled vials: BPC-157, GHK-CU and TB-500, each showing a batch code and QR code"
            className="mx-auto w-full max-w-[620px] object-contain lg:ml-auto lg:max-w-none"
          />
        </motion.div>
      </div>

      {/* traceable banner */}
      <div className="container-x relative pb-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="flex flex-col justify-between gap-8 rounded-xl border border-ink/10 bg-cream-50/80 p-8 backdrop-blur-sm md:flex-row md:items-center md:p-10"
        >
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-ink md:text-3xl">
              Every batch is traceable.
            </h2>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-ink-muted">
              Scan your QR code or punch in your batch number to pull up the
              full COA and verification data. Takes about ten seconds.
            </p>
          </div>
          <a
            href="#verify"
            className="group flex shrink-0 items-center gap-4 text-ink transition-colors hover:text-gold-dark"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-gold-dark transition-colors group-hover:border-gold">
              <Shield className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em]">
              Verification
              <br />
              Center
            </span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>

      <TrustBar />
    </section>
  );
}
