export const MAX_PRODUCT_IMAGES = 15;
const MAX_IMAGES = MAX_PRODUCT_IMAGES;
export const FALLBACK_PRODUCT_IMAGE = "/products/raw-honey-250g.svg";

function dedupePreserveOrder(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

/** All gallery URLs for a product document (legacy `image` + new `images`). */
export function normalizeProductImages(doc: unknown): string[] {
  const d =
    doc && typeof doc === "object" ? (doc as Record<string, unknown>) : {};
  if (Array.isArray(d.images)) {
    const urls = d.images.map((u) => String(u).trim()).filter(Boolean);
    if (urls.length) {
      return dedupePreserveOrder(urls).slice(0, MAX_IMAGES);
    }
  }
  const one = typeof d.image === "string" && d.image.trim() ? d.image.trim() : "";
  return one ? [one] : [];
}

export function primaryProductImage(doc: unknown): string {
  const list = normalizeProductImages(doc);
  return list[0] || FALLBACK_PRODUCT_IMAGE;
}

/** Admin API: build stored `images` from body (prefers `images[]`, else legacy `image`). */
export function parseProductImagesBody(body: Record<string, unknown>): string[] {
  const raw = body.images;
  if (Array.isArray(raw)) {
    const urls = raw.map((u) => String(u).trim()).filter(Boolean);
    if (urls.length) {
      return dedupePreserveOrder(urls).slice(0, MAX_IMAGES);
    }
  }
  const legacy = typeof body.image === "string" && body.image.trim() ? body.image.trim() : "";
  return legacy ? [legacy] : [];
}
