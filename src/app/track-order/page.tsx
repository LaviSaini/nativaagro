"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

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
    <main className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Track order
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Enter your Order ID or AWB/Tracking number to see delivery updates.
          </p>

          <div className="mt-10 space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
              <p className="text-sm font-semibold tracking-wide text-zinc-900">
                Track by Order ID
              </p>
              <form onSubmit={handleTrackByOrderId} className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID"
                  className="flex-1 rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
                <Button type="submit">Track</Button>
              </form>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
              <p className="text-sm font-semibold tracking-wide text-zinc-900">
                Track by AWB / Tracking Number
              </p>
              <form onSubmit={handleTrackByAwb} className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="AWB / Tracking number"
                  className="flex-1 rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
                <Button type="submit">Track</Button>
              </form>
            </div>
          </div>

          {error ? (
            <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Link
            href="/account/orders"
            className="mt-8 inline-block text-sm text-zinc-600 hover:text-zinc-900"
          >
            View order history
          </Link>
        </div>
      </Container>
    </main>
  );
}
