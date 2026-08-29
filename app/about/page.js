import Link from "next/link";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import RuoBanner from "@/components/RuoBanner";
import { Building, Microscope, FileCheck, Shield, Arrow } from "@/components/icons";

const TITLE = "About — KOVA Compounds";
const DESCRIPTION =
  "Research compounds synthesized, tested, and filled in the United States. ≥99% purity by HPLC, independently verified, with a batch-specific COA on every order. For laboratory research use only.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const values = [
  {
    Icon: Building,
    title: "Made here, not imported",
    text: "Synthesized, tested, and filled in US facilities. Nothing sourced overseas, nothing repackaged from a bulk drum, nothing sitting in a customs queue while it degrades.",
  },
  {
    Icon: Microscope,
    title: "Tested by someone who doesn't work for us",
    text: "In-house testing is a company grading its own work. Every lot goes to an independent laboratory. We publish what comes back.",
  },
  {
    Icon: FileCheck,
    title: "Documented to the batch",
    text: "Your order ships with the COA for your specific lot, available before it leaves. A batch code that leads to a generic sample report isn't documentation. It's decoration.",
  },
  {
    Icon: Shield,
    title: "≥99% or it doesn't ship",
    text: "Material below specification is rejected, not discounted. There is no B-grade tier here, because a discounted vial of something unverified is how this industry earned its reputation.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      {/* hero */}
      <section className="relative overflow-hidden pt-[104px]">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-200 to-clay/70" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:py-20">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Our Mission
            </p>
            <h1 className="mt-5 font-condensed text-[clamp(calc(3.6rem+12px),calc(7.2vw+12px),calc(6.8rem+12px))] font-bold uppercase leading-[0.88] tracking-[0.01em] text-ink">
              <span className="block">Raise</span>
              <span className="block text-transparent [-webkit-text-stroke:2px_rgb(var(--gold-dark))]">
                The
              </span>
              <span className="block text-gold-dark">Standard.</span>
            </h1>
            <p className="mt-7 max-w-[420px] text-[14px] leading-relaxed text-ink-soft">
              Most research compounds arrive from overseas with no paperwork and
              no way to check what&apos;s in the vial. You trust a number on a
              label and hope. We built KOVA to remove the hoping: synthesized
              in the United States, every lot independently tested, every result
              published against the batch code on your vial.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="relative lg:-mr-[34px]">
            <img
              src="/images/about-hero.png"
              alt="A stone monolith carved with the KOVA mark, in a courtyard"
              className="aspect-[16/11] w-full rounded-sm object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* story */}
      <section className="border-t border-ink/10 bg-cream-50 py-28">
        <div className="container-x">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Traceability
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              Don&apos;t take our word for it. That&apos;s the point.
            </h2>
            <p className="mt-7 max-w-[65ch] text-[14px] leading-relaxed text-ink-soft">
              Anyone can print a purity figure on a label. We publish the
              analysis behind ours. Every lot goes to an independent laboratory
              before it ships: ≥99% by HPLC, identity confirmed by mass
              spectrometry, and the result is filed against a batch code
              you&apos;ll find on your own vial. Not a representative sample.
              Not a report from a previous lot. Yours.
            </p>
            <Link
              href="/verification"
              className="group mt-9 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-ink transition-colors hover:text-gold-dark"
            >
              View COAs
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Stats />

      {/* values */}
      <section className="border-t border-ink/10 bg-cream-50 py-28">
        <div className="container-x">
          <Reveal className="text-center">
            <h2 className="text-[16px] font-bold uppercase tracking-[0.28em] text-ink">
              Four things we don&apos;t flex on.
            </h2>
            <span className="mx-auto mt-4 block h-px w-12 bg-gold" />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, text }, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-ink/10 bg-cream-100 p-8 transition-colors duration-300 hover:border-gold/50">
                  <Icon className="h-8 w-8 text-gold-dark" />
                  <h3 className="mt-6 text-[13px] font-bold text-ink">{title}</h3>
                  <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink/10 bg-cream-200 py-28">
        <div className="container-x text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Built for research. Made in America.
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#484848_0%,#202020_52%,#060606_100%)] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-label text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_1px_rgba(0,0,0,0.6),0_12px_28px_-12px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition-transform duration-300 hover:scale-[1.03]"
              >
                View All Compounds
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mx-auto mt-14 max-w-xl border-t border-ink/15 pt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
                Buying at volume?
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
                Laboratories and institutions run standing orders at
                wholesale rates from 100 units, with access to compounds we
                don&apos;t list at retail.
              </p>
              <Link
                href="/wholesale"
                className="group mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-ink transition-colors hover:text-gold-dark"
              >
                Start a wholesale account
                <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <RuoBanner />
    </main>
  );
}
