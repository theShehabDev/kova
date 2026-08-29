import { Suspense } from "react";
import CompoundsHero from "@/components/CompoundsHero";
import CatalogGrid from "@/components/CatalogGrid";

const TITLE = "Compounds — KOVA Compounds";
const DESCRIPTION =
  "The KOVA research catalog. ≥99% purity by HPLC, synthesized and tested in the United States, with a batch-specific COA on every order. For laboratory research use only.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
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
