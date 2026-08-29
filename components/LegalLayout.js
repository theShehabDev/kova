import Link from "next/link";
import RuoBanner from "./RuoBanner";

export default function LegalLayout({ title, updated, intro, children }) {
  return (
    <main className="overflow-x-hidden pt-[104px]">
      <section className="border-b border-ink/10 bg-gradient-to-b from-cream-100 to-cream-200">
        <div className="container-x py-14 lg:py-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
            Legal
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
              {intro}
            </p>
          )}
          <p className="mt-6 text-[11px] uppercase tracking-label text-ink-faint">
            Last updated: {updated}
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container-x">
          <div className="legal-prose max-w-3xl text-[14px] leading-relaxed text-ink-soft">
            {children}
          </div>

          <div className="mt-16 max-w-3xl border-t border-ink/10 pt-8">
            <p className="text-[11px] uppercase tracking-label text-ink-faint">
              Related policies
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              <Link href="/terms" className="text-ink transition-colors hover:text-gold-dark">
                Terms &amp; Conditions
              </Link>
              <Link href="/privacy" className="text-ink transition-colors hover:text-gold-dark">
                Privacy Policy
              </Link>
              <Link href="/shipping" className="text-ink transition-colors hover:text-gold-dark">
                Shipping &amp; Returns
              </Link>
              <Link
                href="/research-use-only"
                className="text-ink transition-colors hover:text-gold-dark"
              >
                Research Use Only
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RuoBanner />
    </main>
  );
}
