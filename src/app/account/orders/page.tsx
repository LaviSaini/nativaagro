"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSessionId } from "@/lib/checkout";
import { getAuthedUserId } from "@/lib/auth";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

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
    const userId = getAuthedUserId() || getSessionId();
    fetch(`/api/orders?userId=${encodeURIComponent(userId)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <ButtonLink href="/account" variant="ghost" size="sm">
                Back
              </ButtonLink>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
                Orders
              </h1>
            </div>
            <ButtonLink href="/account/orders/in-transit" variant="outline" size="sm">
              In transit
            </ButtonLink>
          </div>

          {loading ? (
            <p className="mt-8 text-zinc-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-sm text-zinc-600">
                No orders yet. Orders will appear here after checkout.
              </p>
              <div className="mt-6">
                <ButtonLink href="/products" variant="outline">
                  Start shopping
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Order No. {order._id.slice(-8)}
                      </p>
                      <p className="mt-2 text-sm font-semibold tracking-wide text-zinc-900">
                        {order.shippingAddress?.fullName || "Order"}
                      </p>
                      <p className="mt-2 text-sm text-zinc-600">
                        ₹{Math.round(order.total)} ·{" "}
                        <span className="capitalize">{order.status}</span>
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/order-confirmation/${order._id}`}
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                      >
                        View
                      </Link>
                      <Link
                        href={`/track-order/${order._id}`}
                        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
