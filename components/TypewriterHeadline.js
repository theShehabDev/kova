"use client";

import { useEffect, useState } from "react";

const LINES = ["Precision.", "Purity.", "Purpose."];
const bounds = LINES.reduce((acc, line) => {
  const start = acc.length ? acc[acc.length - 1].end : 0;
  acc.push({ start, end: start + line.length });
  return acc;
}, []);
const TOTAL = bounds[bounds.length - 1].end;

export default function TypewriterHeadline() {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(TOTAL);
      return;
    }
    let i = 0;
    let dir = 1;
    let timer;
    const tick = () => {
      i += dir;
      setTyped(i);
      let delay = dir === 1 ? 140 : 100;
      if (i >= TOTAL) {
        dir = -1;
        delay = 1000;
      } else if (i <= 0) {
        dir = 1;
        delay = 500;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 140);
    return () => clearTimeout(timer);
  }, []);

  const done = typed >= TOTAL;

  return (
    <section className="snap-start bg-coal-deep py-20 lg:py-24">
      <div className="container-x">
        <h2
          aria-label={LINES.join(" ")}
          className="bg-[linear-gradient(160deg,#f6f6f5_0%,#c2c4c5_38%,#7c8285_62%,#33373a_100%)] bg-clip-text text-center font-condensed text-[clamp(calc(3.6rem+12px),calc(7.2vw+12px),calc(6.8rem+12px))] font-bold uppercase leading-[0.88] tracking-[0.01em] text-transparent"
        >
          {LINES.map((line, k) => {
            const { start, end } = bounds[k];
            const shown = line.slice(0, Math.max(0, Math.min(typed, end) - start));
            const cursorHere = done ? k === LINES.length - 1 : typed >= start && typed < end;
            return (
              <span key={line} className="block">
                {shown}
                {cursorHere && (
                  <span className="animate-blink inline-block w-0 whitespace-nowrap text-cream-50">
                    _
                  </span>
                )}
                {!shown && !cursorHere && " "}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
