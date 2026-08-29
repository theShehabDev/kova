"use client";

import { useProducts } from "./ProductsContext";

export default function Ticker() {
  const products = useProducts();
  const items = products.map((p) => `${p.name} ${p.dose}`);
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-ink/10 bg-ink py-3.5"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {items.map((t) => (
              <span
                key={half + t}
                className="flex items-center gap-8 pr-8 text-[10px] font-semibold uppercase tracking-label text-cream-100"
              >
                {t}
                <span className="text-[8px] text-gold">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
