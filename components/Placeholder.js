export default function Placeholder({ note, tone = "light", frame = true, className = "" }) {
  const light = tone === "light";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        frame ? "border border-dashed" : ""
      } ${
        light
          ? "border-ink/25 bg-ink/[0.04] text-ink-muted"
          : "border-cream-100/25 bg-cream-100/[0.05] text-cream-100"
      } ${className}`}
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeOpacity="0.2" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeOpacity="0.2" />
      </svg>
      <div className="relative max-w-[240px] px-4 py-6 text-center">
        <span className="text-[9px] font-semibold uppercase tracking-label">Image placeholder</span>
        <p className="mt-2 text-[11px] leading-snug">{note}</p>
      </div>
    </div>
  );
}
