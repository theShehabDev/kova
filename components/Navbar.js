// Site header: nav, search, cart.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import SearchOverlay from "./SearchOverlay";
import { User, Bag, Search, Arrow } from "./icons";
import { useCart } from "./CartContext";
import { useScrollLock } from "@/lib/useScrollLock";

const links = [
  { label: "Compounds", href: "/products" },
  { label: "Verification", href: "/verification" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count, setOpen: setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useScrollLock(open);

  return (
    <>
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-ink/10 bg-cream-50/95 backdrop-blur-md shadow-[0_8px_30px_-18px_rgba(23,25,26,0.25)]"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* announcement bar */}
      <div className="flex h-8 items-center justify-center bg-coal px-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-cream-50">
          For Research Use Only
        </p>
      </div>

      <nav className="container-x relative flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative text-[11px] font-semibold uppercase tracking-label transition-colors ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">

          <Link
            href="/wholesale"
            className="hidden items-center gap-2.5 rounded-full border border-gold/40 bg-coal px-4 py-2.5 text-[10px] font-semibold uppercase tracking-label text-cream-100 transition-colors hover:border-gold hover:text-cream-50 sm:inline-flex"
          >
            Wholesale
            <Arrow className="h-3 w-3" />
          </Link>

          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="tap-target text-ink-soft transition-colors hover:text-gold"
          >
            <Search className="h-[21px] w-[21px]" />
          </button>

          <a href="/my-account" aria-label="Account" className="tap-target text-ink-soft transition-colors hover:text-gold">
            <User className="h-[21px] w-[21px]" />
          </a>
          <button
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
            className="tap-target text-ink-soft transition-colors hover:text-gold"
          >
            <Bag className="h-[21px] w-[21px]" />
            <span className="absolute -right-1.5 -top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-gold text-[8px] font-bold text-cream-50">
              {count}
            </span>
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="tap-target ml-1 flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span className={`h-px w-5 bg-ink transition-all ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-ink transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-5 bg-ink transition-all ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

    </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-ink/45 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 right-0 top-0 z-[60] flex w-[300px] max-w-[85vw] flex-col border-l border-ink/10 bg-cream-50 shadow-[-24px_0_60px_-30px_rgba(23,25,26,0.4)] lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-ink-muted">
                  Menu
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="relative flex h-9 w-9 items-center justify-center"
                >
                  <span className="absolute h-px w-5 rotate-45 bg-ink" />
                  <span className="absolute h-px w-5 -rotate-45 bg-ink" />
                </button>
              </div>

              <nav className="flex flex-col px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setSearchOpen(true);
                  }}
                  className="group flex items-center justify-between border-b border-ink/5 py-4 text-[13px] font-semibold uppercase tracking-label text-ink-soft transition-colors hover:text-ink"
                >
                  Search
                  <Search className="h-4 w-4 text-ink-faint transition-colors duration-300 group-hover:text-gold-dark" />
                </button>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between border-b border-ink/5 py-4 text-[13px] font-semibold uppercase tracking-label text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                    <Arrow className="h-4 w-4 text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold-dark" />
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t border-ink/10 p-6">

                <Link
                  href="/wholesale"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2.5 rounded-full border border-gold/40 bg-coal px-4 py-3.5 text-[11px] font-semibold uppercase tracking-label text-cream-100 transition-colors hover:border-gold hover:text-cream-50"
                >
                  Wholesale
                  <Arrow className="h-3.5 w-3.5" />
                </Link>

                <a
                  href="/my-account"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2.5 rounded-full border border-ink/25 px-4 py-3.5 text-[11px] font-semibold uppercase tracking-label text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream-50"
                >
                  <User className="h-4 w-4" />
                  My Account
                </a>
                <p className="mt-5 text-center text-[9px] font-bold uppercase tracking-[0.28em] text-ink-faint">
                  For Research Use Only
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
