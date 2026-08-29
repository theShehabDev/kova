import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, getProductsSafe } from "@/lib/woo";
import { categories } from "@/data/site";

export async function generateStaticParams() {
  const products = await getProductsSafe();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Not found — KOVA Compounds" };
  return {
    title: `${product.name} ${product.dose} — KOVA Compounds`,
    description: product.desc,
  };
}

export default async function ProductPage({ params }) {
  const [product, products] = await Promise.all([
    getProduct(params.slug),
    getProductsSafe(),
  ]);
  if (!product) notFound();

  const categoryName =
    product.categoryName ||
    categories.find((c) => c.slug === product.category)?.name ||
    product.category;

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);
  const filler = products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug
  );
  while (related.length < 4 && filler.length) related.push(filler.shift());

  return <ProductDetail product={product} categoryName={categoryName} related={related} />;
}
