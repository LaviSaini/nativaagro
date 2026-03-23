"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : []))
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await adminFetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProducts((p) => p.filter((x) => x._id !== id));
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-600">Loading...</p>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <p className="text-zinc-600">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                  Stock
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-zinc-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-zinc-100">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    ${p.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p._id}/edit`}
                      className="mr-2 text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
