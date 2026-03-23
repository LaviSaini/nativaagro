"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSessionId } from "@/lib/checkout";
import { getAuthToken } from "@/lib/auth";

interface Order {
  _id: string;
  total: number;
  status: string;
  awb_code?: string;
  createdAt: string;
  shippingAddress?: { fullName: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getAuthToken() ? "user" : getSessionId();
    fetch(`/api/orders?userId=${encodeURIComponent(userId)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/account"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to account
        </Link>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-zinc-900">
            Order History
          </h1>
          <Link
            href="/account/orders/in-transit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Orders in Transit
          </Link>
        </div>

        {loading ? (
          <p className="text-zinc-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-zinc-600">
              No orders yet. Orders will appear here after checkout.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div>
                  <p className="font-mono text-sm text-zinc-500">
                    #{order._id.slice(-8)}
                  </p>
                  <p className="font-medium text-zinc-900">
                    {order.shippingAddress?.fullName || "Order"}
                  </p>
                  <p className="text-sm text-zinc-600">
                    ${order.total?.toFixed(2)} ·{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/order-confirmation/${order._id}`}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    View
                  </Link>
                  <Link
                    href={`/track-order/${order._id}`}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
