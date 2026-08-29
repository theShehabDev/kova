"use client";

const PHRASES = [
  "Research-Grade",
  "Laboratory Use Only",
  "Third-Party Verified",
  "Compliance-Oriented",
];

export default function CategoryMarquee() {
  const items = [...PHRASES, ...PHRASES, ...PHRASES];

  return (
    <div
      aria-hidden="true"
      className="snap-start overflow-hidden border-t border-ink/10 bg-cream-300 py-3"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-10 pr-10 font-condensed text-lg font-semibold uppercase tracking-[0.14em] text-ink"
              >
                {t}
                <span className="text-[10px] text-gold-dark">▲</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
