// Cart key helpers. A key is `<slug>::<sizeId>`.
export const cartKey = (slug, sizeId) => `${slug}::${sizeId}`;

export function parseCartKey(key) {
  const [slug, id] = String(key).split("::");
  return { slug, sizeId: Number(id) || 0 };
}

export function defaultSize(product) {
  if (!product?.sizes?.length) return null;
  return product.sizes.find((s) => s.inStock) || product.sizes[0];
}

export function resolveCartKey(key, products) {
  const { slug, sizeId } = parseCartKey(key);
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  const size = sizeId
    ? product.sizes.find((s) => s.id === sizeId)
    : defaultSize(product);
  return size ? { product, size } : null;
}
