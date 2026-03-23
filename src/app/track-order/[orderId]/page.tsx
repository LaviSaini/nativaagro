"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TrackingScan {
  date?: string;
  time?: string;
  status?: string;
  activity?: string;
  location?: string;
}

interface TrackingData {
  orderId: string;
  awbCode?: string;
  hasTracking?: boolean;
  status?: string;
  message?: string;
  courier_name?: string;
  current_status?: string;
  delivered_date?: string;
  edd?: string;
  scan?: TrackingScan[];
  tracking_data?: {
    shipment_track?: Array<{
      awb_code?: string;
      courier_name?: string;
      current_status?: string;
      delivered_date?: string;
      edd?: string;
      scan?: TrackingScan[];
    }>;
  };
}

export default function TrackOrderByIdPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}/track`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error && res.orderId) {
          setError(res.error);
          setData({ orderId: res.orderId });
        } else if (res.error) {
          setError(res.error);
        } else {
          setData(res);
        }
      })
      .catch(() => setError("Failed to load tracking"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const hasTracking = data?.hasTracking;
  const orderStatus = data?.status;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-zinc-600">Loading tracking...</p>
        </div>
      </div>
    );
  }

  const shipment = data?.tracking_data?.shipment_track?.[0] || data;
  const scans = shipment?.scan || data?.scan || [];
  const status = shipment?.current_status || data?.current_status;
  const courier = shipment?.courier_name || data?.courier_name;
  const edd = shipment?.edd || data?.edd;
  const delivered = shipment?.delivered_date || data?.delivered_date;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href="/track-order"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to track order
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-zinc-900">
          Order Tracking
        </h1>

        {error && !data?.awbCode ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-zinc-600">{error}</p>
            <p className="mt-2 text-sm text-zinc-500">
              Order ID: {data?.orderId || orderId}
            </p>
            <Link
              href="/account/orders"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              View order history
            </Link>
          </div>
        ) : !hasTracking && data?.orderId ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500">Order ID</p>
                  <p className="font-mono text-sm text-zinc-900">
                    {data.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">Status</p>
                  <p className="text-sm font-medium text-zinc-900 capitalize">
                    {orderStatus || "pending"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-600">
                {data.message}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-zinc-900">
                Order Progress
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-600" />
                  <span className="text-sm">Order Placed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      ["processing", "shipped", "delivered"].includes(
                        orderStatus || ""
                      )
                        ? "bg-blue-600"
                        : "bg-zinc-200"
                    }`}
                  />
                  <span className="text-sm">Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      ["shipped", "delivered"].includes(orderStatus || "")
                        ? "bg-blue-600"
                        : "bg-zinc-200"
                    }`}
                  />
                  <span className="text-sm">Shipped / In Transit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      orderStatus === "delivered" ? "bg-blue-600" : "bg-zinc-200"
                    }`}
                  />
                  <span className="text-sm">Delivered</span>
                </div>
              </div>
            </div>
            <Link
              href="/account/orders/in-transit"
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              ← View all orders in transit
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500">Order ID</p>
                  <p className="font-mono text-sm text-zinc-900">
                    {data?.orderId || orderId}
                  </p>
                </div>
                {data?.awbCode && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">AWB</p>
                    <p className="font-mono text-sm text-zinc-900">
                      {data.awbCode}
                    </p>
                  </div>
                )}
                {courier && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Courier</p>
                    <p className="text-sm text-zinc-900">{courier}</p>
                  </div>
                )}
                {status && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Status</p>
                    <p className="text-sm font-medium text-zinc-900 capitalize">
                      {status}
                    </p>
                  </div>
                )}
                {edd && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Est. Delivery
                    </p>
                    <p className="text-sm text-zinc-900">{edd}</p>
                  </div>
                )}
                {delivered && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Delivered
                    </p>
                    <p className="text-sm text-zinc-900">{delivered}</p>
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/account/orders/in-transit"
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              ← View all orders in transit
            </Link>

            {scans.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-zinc-900">
                  Tracking History
                </h2>
                <div className="space-y-4">
                  {scans.map((scan, i) => (
                    <div
                      key={i}
                      className="flex gap-4 border-l-2 border-zinc-200 pl-4"
                    >
                      <div className="min-w-[80px] text-xs text-zinc-500">
                        {scan.date} {scan.time}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {scan.status || scan.activity}
                        </p>
                        {scan.location && (
                          <p className="text-xs text-zinc-500">
                            {scan.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
