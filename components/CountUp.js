// Number that counts up when scrolled into view.
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function CountUp({ to, suffix = "", duration = 1.8, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [mounted, setMounted] = useState(false);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inView) return;

    let raf;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [mounted, inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {mounted ? Math.round(val) : to}
      {suffix}
    </span>
  );
}
