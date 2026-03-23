"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [awb, setAwb] = useState("");
  const [error, setError] = useState("");

  async function handleTrackByOrderId(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    setError("");
    router.push(`/track-order/${orderId.trim()}`);
  }

  function handleTrackByAwb(e: React.FormEvent) {
    e.preventDefault();
    if (!awb.trim()) return;
    setError("");
    router.push(`/track-order/awb/${encodeURIComponent(awb.trim())}`);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">Track Your Order</h1>

        <div className="space-y-8">
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              Track by Order ID
            </h2>
            <p className="mb-4 text-sm text-zinc-600">
              Enter your order ID from the confirmation email or order history.
            </p>
            <form onSubmit={handleTrackByOrderId} className="flex gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 674a1b2c3d4e5f678901234"
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2"
              />
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white hover:bg-zinc-800"
              >
                Track
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              Track by AWB / Tracking Number
            </h2>
            <p className="mb-4 text-sm text-zinc-600">
              Enter the Shiprocket AWB code from your shipping confirmation.
            </p>
            <form onSubmit={handleTrackByAwb} className="flex gap-4">
              <input
                type="text"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="e.g. 12345678901"
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2"
              />
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white hover:bg-zinc-800"
              >
                Track
              </button>
            </form>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <Link
          href="/account/orders"
          className="mt-8 inline-block text-sm text-blue-600 hover:underline"
        >
          ← View order history
        </Link>
      </div>
    </div>
  );
}
