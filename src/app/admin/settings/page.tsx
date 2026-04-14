"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

const defaults = {
  homepageFeaturedProductIds: "",
  shippingMethodsJson: "[]",
  couponsJson: "[]",
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [form, setForm] = useState(defaults);

  useEffect(() => {
    adminFetch("/api/admin/settings")
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || "Failed to load");
        }
        return r.json();
      })
      .then((data: { settings?: Record<string, string> }) => {
        setForm({
          homepageFeaturedProductIds:
            data.settings?.homepageFeaturedProductIds ?? "",
          shippingMethodsJson:
            data.settings?.shippingMethodsJson?.trim() || defaults.shippingMethodsJson,
          couponsJson: data.settings?.couponsJson?.trim() || defaults.couponsJson,
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      JSON.parse(form.shippingMethodsJson || "[]");
      JSON.parse(form.couponsJson || "[]");
    } catch {
      setSaving(false);
      setError("shippingMethodsJson and couponsJson must be valid JSON arrays.");
      return;
    }
    const res = await adminFetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: form }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      return;
    }
    setOk("Settings saved.");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Settings</h1>
      <p className="mb-6 max-w-2xl text-sm text-zinc-600">
        Store configuration used by the storefront and checkout. Values are saved in MongoDB
        collection <code className="rounded bg-zinc-100 px-1">settings</code> (one document per
        key). Wire these into pages/APIs as needed.
      </p>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {ok}
        </p>
      ) : null}

      {loading ? (
        <p className="text-zinc-600">Loading…</p>
      ) : (
        <form
          onSubmit={(e) => void handleSave(e)}
          className="max-w-3xl space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Homepage featured product IDs
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              Comma-separated MongoDB <code>_id</code> strings (optional).
            </p>
            <input
              value={form.homepageFeaturedProductIds}
              onChange={(e) =>
                setForm((f) => ({ ...f, homepageFeaturedProductIds: e.target.value }))
              }
              placeholder="id1,id2,id3"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Shipping methods (JSON)
            </label>
            <p className="mt-1 text-xs text-zinc-500">Must be valid JSON array, e.g. []</p>
            <textarea
              value={form.shippingMethodsJson}
              onChange={(e) => setForm((f) => ({ ...f, shippingMethodsJson: e.target.value }))}
              rows={8}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Coupons (JSON)</label>
            <p className="mt-1 text-xs text-zinc-500">Must be valid JSON array, e.g. []</p>
            <textarea
              value={form.couponsJson}
              onChange={(e) => setForm((f) => ({ ...f, couponsJson: e.target.value }))}
              rows={8}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
        </form>
      )}
    </div>
  );
}
