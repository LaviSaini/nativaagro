"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadCategories() {
    adminFetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories);
  }

  useEffect(() => {
    loadCategories();
    setLoading(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create");
        return;
      }
      setForm({ name: "", slug: "", description: "", icon: "" });
      setShowForm(false);
      loadCategories();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await adminFetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) loadCategories();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: f.slug || e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  }));
                }}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-700">
                Icon (emoji)
              </label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="📦"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-lg bg-zinc-900 px-6 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-zinc-600">Loading...</p>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <p className="text-zinc-600">No categories yet.</p>
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
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                  Icon
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-zinc-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-zinc-100">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c.slug}</td>
                  <td className="px-4 py-3 text-xl">{c.icon || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
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
