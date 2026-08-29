import Link from "next/link";
import Reveal from "@/components/Reveal";
import RuoBanner from "@/components/RuoBanner";
import WholesaleForm from "@/components/WholesaleForm";
import { Arrow, CheckCircle } from "@/components/icons";

const TITLE = "Wholesale — KOVA Compounds";
const DESCRIPTION =
  "Volume pricing on research compounds for qualified laboratories and institutional buyers. ≥99% purity by HPLC, batch-specific COAs, made in the USA. For laboratory research use only.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const HERO_STATS = [
  { figure: "100 units", label: "Minimum order, any mix of SKUs" },
  { figure: "3 tiers", label: "100 / 250 / 500+" },
  { figure: "2PM ET", label: "Same-day dispatch" },
];

const PROGRAM = [
  "Wholesale rates from 100 units. Mix any SKUs to qualify. Tier is assessed on total order volume, not per line item.",
  "Tier pricing at 100, 250, and 500 units",
  "Extended catalog access to compounds we don't list at retail",
  "Vial sizes to spec, filled to the size your protocol calls for, not just catalog defaults",
  "Standing orders with consistent batch supply",
  "Bulk COA packages delivered before your shipment leaves",
  "A named account contact, not a support queue",
];

const VERIFICATION_CHECKS = [
  "Synthesized, tested, and filled in US facilities",
  "Nothing imported, nothing repackaged, nothing held at customs",
  "Documentation available before your order ships",
  "Discreet packaging on every unit",
];

export default function WholesalePage() {
  return (
    <main className="overflow-x-hidden">
      <section className="relative overflow-hidden pt-[104px]">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-200 to-clay/70" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div className="container-x relative py-20 md:py-24">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Wholesale
            </p>
            <h1 className="mt-5 max-w-3xl font-condensed text-[clamp(calc(3.2rem+12px),calc(6.4vw+12px),calc(5.8rem+12px))] font-bold uppercase leading-[0.9] tracking-[0.01em] text-ink">
              Ordering <span className="text-gold-dark">at Scale?</span>
            </h1>
            <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
              Standing orders for laboratories and institutional buyers.
              Wholesale rates from 100 units. Combine any compounds
              to reach it. Access to a catalog well beyond what we list at
              retail.
            </p>
            <a href="#request-pricing" className="btn-primary group mt-9">
              Request Pricing
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-16 grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-3">
              {HERO_STATS.map((s) => (
                <div key={s.figure} className="bg-cream-50 px-7 py-8">
                  <dt className="font-serif text-3xl font-medium text-ink md:text-4xl">
                    {s.figure}
                  </dt>
                  <dd className="mt-3 text-[11px] font-semibold uppercase tracking-label text-ink-muted">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-cream-50 py-24 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-20">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              The Program
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              Built around what you actually order.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {PROGRAM.map((item) => (
                <li key={item} className="flex gap-4 py-5">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                  <span className="text-[14px] leading-relaxed text-ink-soft">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-cream-100 py-24 lg:py-28">
        <div className="container-x max-w-3xl">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Beyond the Storefront
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              What we list isn&apos;t what we can supply.
            </h2>
            <p className="mt-7 text-[15px] leading-relaxed text-ink-soft">
              The retail catalog is a fraction of our sourcing range. Wholesale
              accounts work from a substantially wider list, filled to the vial
              size your protocol calls for. Tell us what your work requires. If
              we can source it to our specification, we will, and if we
              can&apos;t verify it to that standard, we&apos;ll tell you that
              instead of shipping it anyway.
            </p>
            <p className="mt-10 border-l-2 border-gold pl-6 font-serif text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              Ask for what you need. The answer is usually yes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-ink/10 bg-coal-deep py-24 text-cream-100 lg:py-28">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.16]" />
        <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
              What Doesn&apos;t Change
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-cream-50 md:text-5xl">
              The five hundredth vial is documented like the first.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed text-cream-100">
              Every lot goes to an independent laboratory for purity and
              identity before it ships. ≥99% by HPLC. Identity confirmed by mass
              spectrometry. Every unit in your order carries a batch code linked
              to its own analytical record, not a generic sample report. Order
              five hundred and you can trace all five hundred.
            </p>
            <ul className="mt-8 space-y-3">
              {VERIFICATION_CHECKS.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-[13px] leading-relaxed text-cream-100">{c}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/verification"
              className="group mt-9 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-cream-50 transition-colors hover:text-gold"
            >
              View COAs
              <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-cream-50 py-24 lg:py-28">
        <div className="container-x max-w-3xl">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Account Verification
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              We verify before we quote.
            </h2>
            <p className="mt-7 text-[15px] leading-relaxed text-ink-soft">
              KOVA supplies qualified researchers, licensed laboratories, and
              institutional buyers. Wholesale accounts are reviewed before
              pricing is issued: entity, research application, and intended
              handling. It adds a day to your first order. It&apos;s why the
              program stays clean.
            </p>
            <p className="mt-8 border-t border-ink/15 pt-6 text-[12px] font-semibold leading-relaxed text-ink-muted">
              All materials are supplied for laboratory research use only. Not
              for human or veterinary use. KOVA is not a pharmacy and does not
              provide medical advice, prescriptions, or consultations.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="request-pricing"
        className="scroll-mt-24 border-t border-ink/10 bg-cream-200 py-24 lg:py-28"
      >
        <div className="container-x max-w-3xl">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Request Pricing
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              Start a wholesale account.
            </h2>
            <p className="mt-7 text-[15px] leading-relaxed text-ink-soft">
              Tell us the compounds, your monthly volume, and how often you
              reorder, including anything you don&apos;t see listed. Approved
              accounts are quoted within one to two business days.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="mt-12">
            <WholesaleForm />
          </Reveal>
        </div>
      </section>

      <RuoBanner />
    </main>
  );
}
