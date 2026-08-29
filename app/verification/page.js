import VerificationHero from "@/components/VerificationHero";
import VerificationCenter from "@/components/VerificationCenter";
import VerificationProcess from "@/components/VerificationProcess";
import PopularCompounds from "@/components/PopularCompounds";
import RecentBatches from "@/components/RecentBatches";
import TrustBand from "@/components/TrustBand";
import RuoBanner from "@/components/RuoBanner";
import { getBatchesSafe } from "@/lib/batches";

export const metadata = {
  title: "Verification — KOVA Compounds",
  description:
    "Verify any KOVA batch by QR code or batch number. View COAs, purity results, and recent verified batches before you buy.",
};

export default async function VerificationPage() {
  const batches = await getBatchesSafe({ perPage: 8 });

  return (
    <main className="overflow-x-hidden">
      <VerificationHero />
      <VerificationCenter />
      <VerificationProcess />
      <PopularCompounds />
      <RecentBatches batches={batches} />
      <TrustBand />
      <RuoBanner />
    </main>
  );
}
