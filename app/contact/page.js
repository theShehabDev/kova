import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import RuoBanner from "@/components/RuoBanner";
import { Arrow, CheckCircle } from "@/components/icons";

const TITLE = "Contact — KOVA Compounds";
const DESCRIPTION =
  "Reach KOVA research support about an order, a batch COA, or a compound question. For laboratory research use only.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const DIRECT = {
  entity: "Kova Compounds LLC",
  location: "South Jordan, Utah",
  email: "info@kovacompounds.com",
  hours: "24/7 support",
};

const ROUTES = [
  {
    k: "Orders",
    v: "Status, tracking, changes, and anything that went wrong in transit. Have the order number to hand.",
  },
  {
    k: "Documentation",
    v: "COAs, batch records, and analytical questions. Most of this is self-serve on the verification page.",
  },
  {
    k: "Wholesale",
    v: "Volume pricing, standing orders, and extended catalog access are handled by a named account contact, not this queue.",
  },
];

const BEFORE_YOU_WRITE = [
  "Batch COAs are published as each lot clears testing, so look the batch number up rather than waiting on a reply.",
  "Vial sizes and stock are live on each product page; if a size isn't listed, it isn't currently filled.",
  "Dispatch cutoff is 2PM ET. Orders after it go out the next business day.",
];

export default function ContactPage() {
  return (
    <main className="overflow-x-hidden">
      <section className="relative overflow-hidden pt-[104px]">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-200 to-clay/70" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div className="container-x relative py-20 md:py-24">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-dark">
              Research Support
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="display mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4rem)]">
              Talk to someone who knows the batch
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-[14px] leading-relaxed text-ink-soft">
              Questions about an order, a certificate of analysis, or a compound
              in the catalog. Messages reach research support directly. There
              is no ticket queue in between.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-cream-50 py-20 lg:py-28">
        <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div>
            <Reveal>
              <p className="label mb-3">Send a message</p>
              <h2 className="display text-[clamp(1.6rem,3.5vw,2.4rem)]">
                One form, straight to support
              </h2>
              <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-ink-muted">
                Everything marked with an asterisk is required. Nothing you type
                is lost if the send fails.
              </p>
            </Reveal>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Reveal delay={0.08}>
              <p className="label mb-4">Where things go</p>
              <dl className="divide-y divide-ink/10 border-y border-ink/10">
                {ROUTES.map((r) => (
                  <div key={r.k} className="py-5">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                      {r.k}
                    </dt>
                    <dd className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
                      {r.v}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="label mb-4 mt-10">Direct</p>
              <div className="space-y-1.5 text-[12.5px] leading-relaxed text-ink-muted">
                <p className="font-bold uppercase tracking-[0.16em] text-ink">
                  {DIRECT.entity}
                </p>
                <p>{DIRECT.location}</p>
                <p>
                  <a
                    href={`mailto:${DIRECT.email}`}
                    className="link-underline hover:text-gold"
                  >
                    {DIRECT.email}
                  </a>
                </p>
                <p>{DIRECT.hours}</p>
              </div>

              <p className="label mb-4 mt-10">Faster than writing in</p>
              <ul className="space-y-3">
                {BEFORE_YOU_WRITE.map((c) => (
                  <li key={c} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-soft">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/verification" className="link-underline group hover:text-gold">
                  Verify a batch
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/wholesale" className="link-underline group hover:text-gold">
                  Wholesale enquiries
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/shipping" className="link-underline group hover:text-gold">
                  Shipping &amp; returns
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <RuoBanner />
    </main>
  );
}
