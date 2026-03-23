import Link from "next/link";
import AddToCartForm from "./AddToCartForm";

async function getProduct(id: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Product not found</h1>
          <Link href="/products" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/products"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to products
        </Link>
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">{product.name}</h1>
          <p className="mt-4 text-zinc-600">{product.description}</p>
          <p className="mt-6 text-2xl font-semibold text-zinc-900">
            ${product.price?.toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {product.stock ?? 0} in stock
          </p>
          <AddToCartForm productId={product._id} />
        </div>
      </div>
    </div>
  );
}
