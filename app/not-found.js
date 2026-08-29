import Link from "next/link";
import { Arrow } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-100 to-cream-200 px-6 pt-[104px] text-center">
      <p className="label mb-6">Off protocol</p>
      <h1 className="display text-[clamp(4rem,18vw,11rem)] leading-none text-ink">404</h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
        We couldn&apos;t find that page. Try the catalog or head back home.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary group">
          Back Home
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link href="/products" className="btn-ghost">Browse Catalog</Link>
      </div>
    </main>
  );
}
