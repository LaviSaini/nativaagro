import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { normalizeProductImages } from "@/lib/product-images";

/** Normalized product for storefront pages (PDP, related grid). */
export type StorefrontProduct = Record<string, unknown> & {
  _id: string;
  name: string;
  price: number;
  description?: string;
  stock?: number;
  image: string;
  images: string[];
  highlights?: unknown;
  faqs?: unknown;
  promoLine?: string;
  packSize?: string;
};

function serializeStoreProduct(doc: Record<string, unknown> & { _id: ObjectId }): StorefrontProduct {
  const images = normalizeProductImages(doc);
  const stockRaw = doc.stock;
  const stock =
    typeof stockRaw === "number"
      ? stockRaw
      : stockRaw != null && Number.isFinite(Number(stockRaw))
        ? Number(stockRaw)
        : undefined;

  return {
    _id: doc._id.toString(),
    name: String(doc.name ?? ""),
    price: Number(doc.price) || 0,
    description: typeof doc.description === "string" ? doc.description : undefined,
    stock,
    image: images[0] || "",
    images,
    highlights: doc.highlights,
    faqs: doc.faqs,
    promoLine: typeof doc.promoLine === "string" ? doc.promoLine : undefined,
    packSize: typeof doc.packSize === "string" ? doc.packSize : undefined,
  } as StorefrontProduct;
}

/** Storefront PDP — reads Mongo directly (avoids slow server→HTTP→self fetches). */
export async function getStoreProductById(id: string): Promise<StorefrontProduct | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  try {
    const db = await connectToDatabase();
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) {
      return null;
    }
    return serializeStoreProduct(product as Record<string, unknown> & { _id: ObjectId });
  } catch {
    return null;
  }
}

export async function getStoreRelatedProducts(
  excludeId: string,
  limit = 3
): Promise<StorefrontProduct[]> {
  if (!ObjectId.isValid(excludeId)) {
    return [];
  }
  try {
    const db = await connectToDatabase();
    const oid = new ObjectId(excludeId);
    const products = await db
      .collection("products")
      .find({ _id: { $ne: oid } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return products.map((p) =>
      serializeStoreProduct(p as Record<string, unknown> & { _id: ObjectId })
    );
  } catch {
    return [];
  }
}

export type StoreCategory = { _id: string; name: string; slug: string };

/** Categories for storefront toolbar — direct DB (no self-fetch). */
export async function getStoreCategories(): Promise<StoreCategory[]> {
  try {
    const db = await connectToDatabase();
    const categories = await db.collection("categories").find({}).sort({ name: 1 }).toArray();
    return categories.map((c) => ({
      _id: c._id.toString(),
      name: String(c.name ?? ""),
      slug: String(c.slug ?? ""),
    }));
  } catch {
    return [];
  }
}

function categoryIdMatchesCategory(cat: { _id: ObjectId }) {
  const idStr = cat._id.toString();
  return {
    $or: [{ categoryId: idStr }, { categoryId: cat._id }],
  } as Record<string, unknown>;
}

/**
 * Product grid for /products — direct Mongo (avoids server-side fetch to NEXT_PUBLIC_APP_URL,
 * which is often wrong in prod or unreachable from the Node server).
 */
export async function getStoreProductsList(opts: {
  search?: string;
  categorySlug?: string;
}): Promise<StorefrontProduct[]> {
  const search = (opts.search || "").trim();
  const categorySlug = (opts.categorySlug || "").trim();

  try {
    const db = await connectToDatabase();
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (categorySlug) {
      const cat = await db.collection("categories").findOne({ slug: categorySlug });
      if (cat) {
        const catMatch = categoryIdMatchesCategory(cat as { _id: ObjectId });
        if (filter.$or) {
          filter.$and = [{ $or: filter.$or as unknown[] }, catMatch];
          delete filter.$or;
        } else {
          Object.assign(filter, catMatch);
        }
      }
    }

    const products = await db
      .collection("products")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return products.map((p) =>
      serializeStoreProduct(p as Record<string, unknown> & { _id: ObjectId })
    );
  } catch {
    return [];
  }
}
