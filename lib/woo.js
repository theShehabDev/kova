// WooCommerce REST client: catalog and products.
import "server-only";

const BASE = process.env.WOO_STORE_URL;
const KEY = process.env.WOO_CONSUMER_KEY;
const SECRET = process.env.WOO_CONSUMER_SECRET;

function auth() {
  return "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
}

async function wooFetch(path, { revalidate = 300 } = {}) {
  if (!BASE || !KEY || !SECRET) {
    throw new Error(
      "WooCommerce env vars missing. Check WOO_STORE_URL, WOO_CONSUMER_KEY, WOO_CONSUMER_SECRET."
    );
  }

  const res = await fetch(`${BASE}/wp-json/wc/v3${path}`, {
    headers: { Authorization: auth() },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Woo ${res.status} on ${path}: ${await res.text()}`);
  }
  return res.json();
}

function decodeEntities(text = "") {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&#0?39;|&apos;|&#8217;/g, "’")
    .replace(/&quot;|&#8220;|&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&middot;/g, "·")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function plain(html = "") {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

const LIST_FIELDS = [
  "id",
  "slug",
  "name",
  "type",
  "price",
  "sku",
  "stock_status",
  "short_description",
  "categories",
  "images",
  "attributes",
  "tags",
].join(",");

const DETAIL_FIELDS = `${LIST_FIELDS},description`;

const VARIATION_FIELDS = ["id", "price", "stock_status", "sku", "attributes"].join(",");

const VIAL_ATTR = "vial size";

const NO_PURITY_CLAIM_TAG = "no-purity-claim";

function mg(size) {
  const n = parseFloat(String(size).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : Infinity;
}

function mapSize({ id, size, price, stockStatus, sku }) {
  return {
    id,
    size,
    price: Number(price) || 0,
    inStock: stockStatus !== "outofstock",
    sku: sku || "",
  };
}

function buildSizes(p, variations) {
  if (p.type === "variable") {
    return (variations || [])
      .map((v) =>
        mapSize({
          id: v.id,
          size:
            v.attributes?.find((a) => a.name?.toLowerCase() === VIAL_ATTR)?.option || "",
          price: v.price,
          stockStatus: v.stock_status,
          sku: v.sku,
        })
      )
      .filter((s) => s.size)
      .sort((a, b) => mg(a.size) - mg(b.size));
  }

  const size =
    p.attributes?.find((a) => a.name?.toLowerCase() === VIAL_ATTR)?.options?.[0] || "";
  if (!size) return [];
  return [
    mapSize({
      id: p.id,
      size,
      price: p.price,
      stockStatus: p.stock_status,
      sku: p.sku,
    }),
  ];
}

function mapProduct(p, variations) {
  const short = plain(p.short_description);
  const sizes = buildSizes(p, variations);

  const doseLabel =
    sizes.length > 1
      ? `${sizes[0].size}–${sizes[sizes.length - 1].size}`
      : sizes[0]?.size || "";

  const prices = sizes.map((s) => s.price).filter((n) => n > 0);
  const minPrice = prices.length ? Math.min(...prices) : Number(p.price) || 0;

  return {
    wooId: p.id,
    slug: p.slug,
    name: decodeEntities(p.name),
    price: minPrice,
    priceFrom: prices.length > 1 && Math.max(...prices) !== minPrice,
    sizes,
    dose: doseLabel,
    tagline: short.split("·")[0].trim(),
    category: p.categories?.[0]?.slug || "",
    categoryName: decodeEntities(p.categories?.[0]?.name || ""),
    image: p.images?.[0]?.src || "/images/product.png",
    inStock: sizes.length
      ? sizes.some((s) => s.inStock)
      : p.stock_status === "instock",
    showPurityClaim: !(p.tags || []).some(
      (t) => t.slug?.toLowerCase() === NO_PURITY_CLAIM_TAG
    ),
    descriptionHtml: p.description || "",
    desc: short,
  };
}

async function withSizes(p) {
  if (p.type !== "variable") return mapProduct(p);
  try {
    const variations = await wooFetch(
      `/products/${p.id}/variations?per_page=100&_fields=${VARIATION_FIELDS}`
    );
    return mapProduct(p, variations);
  } catch (err) {
    console.error(`[woo] variations failed for ${p.slug}:`, err.message);
    return { ...mapProduct(p), sizes: [], inStock: false };
  }
}

export async function getProducts() {
  const data = await wooFetch(
    `/products?per_page=100&status=publish&_fields=${LIST_FIELDS}`
  );
  return Promise.all(data.map(withSizes));
}

export async function getProductsSafe() {
  try {
    return await getProducts();
  } catch (err) {
    console.error("[woo] catalog fetch failed:", err.message);
    return [];
  }
}

export async function getProduct(slug) {
  const data = await wooFetch(
    `/products?slug=${encodeURIComponent(slug)}&_fields=${DETAIL_FIELDS}`
  );
  return data[0] ? withSizes(data[0]) : null;
}

export async function getCategories() {
  const data = await wooFetch("/products/categories?per_page=100&hide_empty=false");
  return data
    .filter((c) => c.slug !== "uncategorized")
    .map((c) => ({ slug: c.slug, name: decodeEntities(c.name), count: c.count }));
}
