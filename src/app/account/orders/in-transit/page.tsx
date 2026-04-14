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

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

export default function OrdersInTransitPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getAuthedUserId() || getSessionId();
    fetch(`/api/orders?userId=${encodeURIComponent(userId)}&status=active`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  function getProgressIndex(status: string): number {
    const i = STATUS_STEPS.indexOf(status);
    return i >= 0 ? i : 0;
  }

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <ButtonLink href="/account/orders" variant="ghost" size="sm">
                Back
              </ButtonLink>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
                In transit
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                Track the progress of your active orders.
              </p>
            </div>
            <ButtonLink href="/account/orders" variant="outline" size="sm">
              All orders
            </ButtonLink>
          </div>

          {loading ? (
            <p className="mt-8 text-zinc-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-sm text-zinc-600">
                No orders in transit. All your orders have been delivered or you
                haven&apos;t placed any yet.
              </p>
              <div className="mt-6">
                <ButtonLink href="/products" variant="outline">
                  Start shopping
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => {
                const progressIndex = getProgressIndex(order.status);
                const pct = `${(progressIndex / 3) * 100}%`;
                return (
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
                          <span className="capitalize">
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Placed {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/track-order/${order._id}`}
                          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                        >
                          Check progress
                        </Link>
                        <Link
                          href={`/order-confirmation/${order._id}`}
                          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                        >
                          View
                        </Link>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-xs font-medium text-zinc-500">
                        {STATUS_STEPS.slice(0, -1).map((step, i) => (
                          <span
                            key={step}
                            className={i <= progressIndex ? "text-zinc-900" : ""}
                          >
                            {STATUS_LABELS[step] || step}
                          </span>
                        ))}
                        <span className={progressIndex >= 3 ? "text-zinc-900" : ""}>
                          Delivered
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                        <div
                          className="h-full rounded-full bg-zinc-900 transition-all"
                          style={{ width: pct }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-zinc-600">
                        Current:{" "}
                        <span className="font-medium text-zinc-900">
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
