import VerificationHero from "@/components/VerificationHero";
import VerificationCenter from "@/components/VerificationCenter";
import VerificationProcess from "@/components/VerificationProcess";
import RecentBatches from "@/components/RecentBatches";
import TrustBand from "@/components/TrustBand";
import RuoBanner from "@/components/RuoBanner";
import { getBatch, getBatchesSafe } from "@/lib/batches";

export async function generateMetadata({ params }) {
  const batch = await getBatch(decodeURIComponent(params.batch));
  if (!batch) {
    return { title: "Batch verification — KOVA Compounds" };
  }
  return {
    title: `Batch ${batch.id} — KOVA Compounds`,
    description: `${batch.product} · ${batch.purity} · tested ${batch.tested}. View the full certificate of analysis for this lot.`,
    robots: { index: false, follow: true },
  };
}

export default async function BatchPage({ params }) {
  const number = decodeURIComponent(params.batch);
  const [batch, batches] = await Promise.all([
    getBatch(number),
    getBatchesSafe({ perPage: 8 }),
  ]);

  return (
    <main className="overflow-x-hidden">
      <VerificationHero />
      <VerificationCenter initialBatch={batch} initialQuery={number} />
      <VerificationProcess />
      <RecentBatches batches={batches} />
      <TrustBand />
      <RuoBanner />
    </main>
  );
}
