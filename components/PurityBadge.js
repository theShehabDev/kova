// Purity figure with its COA link.
import { Shield } from "./icons";

export default function PurityBadge({ product, align = "left", className = "" }) {
  const withPurity = !product || product.showPurityClaim !== false;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <Shield className="h-3 w-3 shrink-0 text-gold-dark" />
      {withPurity ? <>&gt;99% Purity · USA-Made</> : <>USA-Made</>}
    </span>
  );
}
