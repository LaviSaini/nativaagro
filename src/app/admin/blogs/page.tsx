"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

type BlogRow = {
  _id: string;
  title: string;
  category?: string;
  publishedAt?: string | null;
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/blogs")
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || "Failed to load");
        }
        return r.json();
      })
      .then(setBlogs)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog post?")) return;
    const res = await adminFetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Delete failed");
      return;
    }
    setBlogs((b) => b.filter((x) => x._id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New post
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-zinc-600">Loading…</p>
      ) : blogs.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <p className="text-zinc-600">No blog posts yet.</p>
          <Link href="/admin/blogs/new" className="mt-4 inline-block text-blue-600 hover:underline">
            Create the first post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Published</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-zinc-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id} className="border-b border-zinc-100">
                  <td className="px-4 py-3 font-medium text-zinc-900">{b.title}</td>
                  <td className="px-4 py-3 text-zinc-600">{b.category || "—"}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">
                    {b.publishedAt
                      ? new Date(b.publishedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/blogs/${b._id}/edit`}
                      className="mr-2 text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(b._id)}
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
