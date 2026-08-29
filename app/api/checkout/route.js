// Checkout handoff: signs the cart into a WooCommerce checkout URL.
import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/woo";
import { resolveCartKey } from "@/lib/cart";

const sign = (value) =>
  createHmac("sha256", process.env.KOVA_CART_SECRET).update(value).digest("hex");

export async function POST(request) {
  const { items } = await request.json();

  if (!items || typeof items !== "object" || !Object.keys(items).length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const products = await getProducts();

  const pairs = Object.entries(items)
    .map(([key, qty]) => {
      const hit = resolveCartKey(key, products);
      if (!hit || !hit.size.inStock) return null;
      const n = Math.max(1, Math.floor(Number(qty) || 0));
      const { product, size } = hit;
      const variationId = size.id === product.wooId ? 0 : size.id;
      return `${product.wooId}:${variationId}:${n}`;
    })
    .filter(Boolean);

  if (!pairs.length) {
    return NextResponse.json(
      { error: "Nothing in the cart is currently available." },
      { status: 400 }
    );
  }

  const payload = pairs.join(",");
  const sig = sign(payload);

  const ref = cookies().get("kova_ref")?.value;
  const refParam = ref ? `&ref=${encodeURIComponent(ref)}&refsig=${sign(ref)}` : "";

  const publicBase = (
    process.env.WOO_PUBLIC_URL || process.env.WOO_STORE_URL
  ).replace(/\/$/, "");

  const url =
    `${publicBase}/?kova-cart=${encodeURIComponent(payload)}` +
    `&sig=${sig}${refParam}`;

  return NextResponse.json({ url });
}
