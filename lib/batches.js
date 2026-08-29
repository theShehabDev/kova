// Batch and COA lookups from the WordPress batch API.
const BASE = process.env.WOO_STORE_URL;

async function batchFetch(path, { revalidate = 300 } = {}) {
  if (!BASE) {
    throw new Error("WOO_STORE_URL missing — cannot reach the batch API.");
  }

  const res = await fetch(`${BASE}/wp-json/kova/v1${path}`, {
    next: { revalidate },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Batches ${res.status} on ${path}: ${await res.text()}`);
  }
  return res.json();
}

function mapBatch(b) {
  if (!b) return null;

  const purity =
    b.purity && b.method
      ? `${b.purity} (${b.method} verified)`
      : b.purity || "";

  return {
    id: b.batch,
    product: b.productName,
    slug: b.productSlug,
    purity,
    purityValue: b.purity || "",
    method: b.method || "",
    laboratory: b.laboratory || "Independent",
    testedOn: b.testedOn || "",
    tested: formatDate(b.testedOn),
    coaUrl: b.coaUrl || "",
  };
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function getBatches({ perPage = 20, product = "" } = {}) {
  const params = new URLSearchParams({ per_page: String(perPage) });
  if (product) params.set("product", product);

  const data = await batchFetch(`/batches?${params}`);
  return (data || []).map(mapBatch).filter(Boolean);
}

export async function getBatchesSafe(options) {
  try {
    return await getBatches(options);
  } catch (err) {
    console.error("[batches] fetch failed:", err.message);
    return [];
  }
}

export async function getBatch(number) {
  if (!number) return null;
  try {
    return mapBatch(await batchFetch(`/batch/${encodeURIComponent(number)}`));
  } catch (err) {
    console.error("[batches] lookup failed:", err.message);
    return null;
  }
}

export async function getCurrentBatch(productSlug) {
  const [latest] = await getBatchesSafe({ perPage: 1, product: productSlug });
  return latest || null;
}
