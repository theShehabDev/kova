// Site footer.
"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Arrow, FlagUS, Instagram, XSocial, Mail } from "./icons";

const cols = [
  {
    title: "Compounds",
    links: [
      { label: "All Compounds", href: "/products" },
      { label: "Compounds", href: "/products?category=Compounds" },
      { label: "View All", href: "/products" },
    ],
  },
  {
    title: "Verification",
    links: [
      { label: "Verification Center", href: "/verification#verify" },
      { label: "How It Works", href: "/verification" },
      { label: "COA Example", href: "/verification#batches" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Manufacturing", href: "/about" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Research Use Only", href: "/research-use-only" },
    ],
  },
];

const socials = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: XSocial, label: "X", href: "#" },
  { Icon: Mail, label: "Email", href: "mailto:info@kovacompounds.com" },
];

export default function Footer() {
  return (
    <footer className="snap-end bg-coal-deep text-cream-100">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[3fr_2fr_2fr_2fr_2fr_3fr] lg:gap-8">
        {/* brand */}
        <div>
          <Logo light />
          <p className="mt-6 text-[12px] text-cream-100">
            Built for research. Made in America.
          </p>
          <p className="mt-5 flex items-center gap-2.5">
            <FlagUS className="h-[13px] w-[20px]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cream-100">
              Made in the USA
            </span>
          </p>
          <address className="mt-6 space-y-1.5 text-[12px] not-italic leading-relaxed text-cream-100">
            <p className="font-semibold">Kova Compounds LLC</p>
            <p>South Jordan, Utah</p>
            <p>
              <a
                href="mailto:info@kovacompounds.com"
                className="transition-colors hover:text-cream-50"
              >
                info@kovacompounds.com
              </a>
            </p>
            <p>24/7 support</p>
          </address>
          <div className="mt-7 flex gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="tap-target flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/20 text-cream-100 transition-colors hover:border-gold-soft hover:text-cream-50"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* link columns */}
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-[11px] font-semibold uppercase tracking-label text-cream-100">
              {c.title}
            </h4>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[12px] text-cream-100 transition-colors hover:text-cream-50"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* newsletter */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-label text-cream-100">
            Stay Updated
          </h4>
          <p className="mt-5 text-[12px] leading-relaxed text-cream-100">
            New compounds, restocks and research notes, straight to your
            inbox. No spam, promise.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full min-w-0 rounded-l-full border border-cream-100/15 bg-cream-100/[0.06] px-4 py-3 text-[13px] text-cream-100 placeholder:text-cream-100 focus:border-gold-soft focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex shrink-0 items-center justify-center rounded-r-full bg-gold px-5 text-coal transition-colors hover:bg-gold-soft"
            >
              <Arrow className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* disclaimer */}
      <div className="border-t border-white/10">
        <div className="container-x py-8 text-[11px] leading-relaxed text-cream-100">
          <p className="font-semibold uppercase tracking-label text-cream-100">
            Research Use Only
          </p>
          <p className="mt-2 max-w-3xl">
            Products sold by KOVA are intended exclusively for laboratory
            research (e.g., in vitro, ex vivo, or approved animal models).
            Sold exclusively to qualified researchers and licensed
            laboratories. They are not medicines, supplements, or diagnostic
            tools and not intended for human or veterinary use. By
            purchasing, you confirm that you are a qualified researcher and
            assume all responsibility for safe handling, storage, and lawful
            application.
          </p>
          <p className="mt-2 max-w-3xl">
            KOVA is not a pharmacy and does not provide medical advice,
            prescriptions, or consultations.
          </p>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-7 text-[11px] text-cream-100 md:flex-row">
          <p>© {new Date().getFullYear()} Kova Compounds LLC. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-cream-50">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-cream-50">
              Privacy
            </Link>
            <Link href="/shipping" className="transition-colors hover:text-cream-50">
              Shipping
            </Link>
            <Link href="/research-use-only" className="transition-colors hover:text-cream-50">
              Research Use Only
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
