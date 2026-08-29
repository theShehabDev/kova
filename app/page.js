import HomeHero from "@/components/HomeHero";
import FeaturedCompounds from "@/components/FeaturedCompounds";
import CategoryMarquee from "@/components/CategoryMarquee";
import Verification from "@/components/Verification";
import Promises from "@/components/Promises";
import TypewriterHeadline from "@/components/TypewriterHeadline";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <HomeHero />
      <FeaturedCompounds />
      <CategoryMarquee />
      <Verification />
      <Promises />
      <TypewriterHeadline />
    </main>
  );
}
