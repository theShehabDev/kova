import { Suspense } from "react";
import CompoundsHero from "@/components/CompoundsHero";
import CatalogGrid from "@/components/CatalogGrid";

export const metadata = {
  title: "Compounds — KOVA Compounds",
  description:
    "Browse premium research compounds. Purity you can verify. Quality you can trust.",
};

export default function CatalogPage() {
  return (
    <main className="overflow-x-hidden">
      <CompoundsHero />
      <Suspense fallback={<div className="container-x py-20 text-ink-muted">Loading compounds…</div>}>
        <CatalogGrid />
      </Suspense>
    </main>
  );
}
