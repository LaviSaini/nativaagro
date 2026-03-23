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
    const userId = getAuthToken() ? "user" : getSessionId();
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
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/account/orders"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to all orders
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">
          Orders in Transit
        </h1>
        <p className="mb-8 text-zinc-600">
          Track the progress of your orders that haven&apos;t been delivered yet.
        </p>

        {loading ? (
          <p className="text-zinc-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-zinc-600">
              No orders in transit. All your orders have been delivered or you
              haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const progressIndex = getProgressIndex(order.status);
              return (
                <div
                  key={order._id}
                  className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-zinc-500">
                        #{order._id.slice(-8)}
                      </p>
                      <p className="font-medium text-zinc-900">
                        {order.shippingAddress?.fullName || "Order"}
                      </p>
                      <p className="text-sm text-zinc-600">
                        ${order.total?.toFixed(2)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Placed {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/track-order/${order._id}`}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                      >
                        Check Progress
                      </Link>
                      <Link
                        href={`/order-confirmation/${order._id}`}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-medium text-zinc-500">
                      {STATUS_STEPS.slice(0, -1).map((step, i) => (
                        <span
                          key={step}
                          className={
                            i <= progressIndex ? "text-blue-600" : ""
                          }
                        >
                          {STATUS_LABELS[step] || step}
                        </span>
                      ))}
                      <span
                        className={
                          progressIndex >= 3 ? "text-blue-600" : ""
                        }
                      >
                        Delivered
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${(progressIndex / 3) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-zinc-700">
                      Current: {STATUS_LABELS[order.status] || order.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
