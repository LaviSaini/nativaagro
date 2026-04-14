"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type ReviewRow = {
  _id: string;
  name: string;
  rating: number;
  text: string;
  hidden: boolean;
  createdAt: string | null;
};

export default function AdminReviewsPage() {
  const [items, setItems] = useState<ReviewRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adminFetch("/api/admin/reviews?limit=100");
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to load reviews");
      setItems([]);
      setTotal(0);
    } else {
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setHidden(id: string, hidden: boolean) {
    const res = await adminFetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Update failed");
      return;
    }
    setItems((list) => list.map((r) => (r._id === id ? { ...r, hidden } : r)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    const res = await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Delete failed");
      return;
    }
    setItems((list) => list.filter((r) => r._id !== id));
    setTotal((t) => Math.max(0, t - 1));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Reviews</h1>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Refresh
        </button>
      </div>
      <p className="mb-4 text-sm text-zinc-600">
        Total in database: <strong>{total}</strong>. Hidden reviews are excluded from the public
        homepage feed.
      </p>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-zinc-600">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <p className="text-zinc-600">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <div
              key={r._id}
              className={`rounded-xl border p-4 ${
                r.hidden ? "border-amber-200 bg-amber-50" : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-900">{r.name}</p>
                  <p className="text-sm text-zinc-500">
                    {r.rating}★ ·{" "}
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-700">{r.text}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void setHidden(r._id, !r.hidden)}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
                  >
                    {r.hidden ? "Unhide" : "Hide"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(r._id)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
