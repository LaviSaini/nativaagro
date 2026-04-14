"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import { AdminImageField } from "@/components/admin/AdminImageField";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "0",
    image: "",
  });

  useEffect(() => {
    adminFetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories);
  }, []);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_APP_URL || "";
    fetch(`${base}/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (p) {
          setForm({
            name: p.name || "",
            description: p.description || "",
            price: String(p.price ?? ""),
            categoryId: p.categoryId || "",
            stock: String(p.stock ?? 0),
            image: p.image || "",
          });
        }
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price) || 0,
          categoryId: form.categoryId || undefined,
          stock: parseInt(form.stock, 10) || 0,
          image: form.image || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      router.push("/admin/products");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
      >
        ← Back to products
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Stock
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoryId: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <AdminImageField
          label="Product image"
          folder="products"
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          helpText="Upload replaces the stored path; file is saved under public/products."
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-6 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <Link
            href="/admin/products"
            className="rounded-lg border border-zinc-300 px-6 py-2 hover:bg-zinc-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
