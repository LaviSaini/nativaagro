"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Order {
  _id: string;
  userId: string;
  total: number;
  status: string;
  awb_code?: string;
  createdAt: string;
  shippingAddress?: { fullName: string; address: string; city: string };
}

interface ChartPoint {
  period: string;
  orders: number;
  revenue: number;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "";
  const periodFilter = searchParams.get("period") || "";
  const [orders, setOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: "", awb_code: "" });

  const loadOrders = useCallback(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (periodFilter) params.set("period", periodFilter);
    const url = `/api/admin/orders${params.toString() ? `?${params}` : ""}`;
    setLoading(true);
    adminFetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [statusFilter, periodFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const p = periodFilter || "monthly";
    adminFetch(`/api/admin/analytics?period=${p}`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => setChartData(res.data?.slice(-12) || []));
  }, [periodFilter]);

  async function handleUpdate(id: string) {
    const res = await adminFetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...(editForm.status && { status: editForm.status }),
        ...(editForm.awb_code && { awb_code: editForm.awb_code }),
      }),
    });
    if (res.ok) {
      setEditing(null);
      loadOrders();
    }
  }

  const buildUrl = (status?: string, period?: string) => {
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    if (period) p.set("period", period);
    return `/admin/orders${p.toString() ? `?${p}` : ""}`;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="shrink-0 text-sm font-medium text-zinc-500">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                router.push(buildUrl(e.target.value, periodFilter))
              }
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="">All</option>
              <option value="active">Active</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="period-filter" className="shrink-0 text-sm font-medium text-zinc-500">
              Period:
            </label>
            <select
              id="period-filter"
              value={periodFilter}
              onChange={(e) =>
                router.push(buildUrl(statusFilter, e.target.value))
              }
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="">All time</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Orders & Revenue
            {periodFilter && (
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({periodFilter})
              </span>
            )}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#71717a" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#71717a" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  stroke="#71717a"
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value, name) =>
                    value != null
                      ? [
                          String(name) === "revenue" ? `$${Number(value).toFixed(2)}` : value,
                          String(name) === "revenue" ? "Revenue" : "Orders",
                        ]
                      : []
                  }
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e4e4e7",
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="orders"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Orders"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Link
            href="/admin/analytics"
            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
          >
            View full analytics →
          </Link>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-600">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <p className="text-zinc-600">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                    {order.shippingAddress?.fullName || "—"}
                  </p>
                  <p className="text-sm text-zinc-600">
                    ${order.total?.toFixed(2)} ·{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                  {order.awb_code && (
                    <p className="text-xs text-zinc-500">
                      AWB: {order.awb_code}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  {editing === order._id ? (
                    <div className="space-y-2">
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, status: e.target.value }))
                        }
                        className="rounded border border-zinc-300 px-3 py-1 text-sm"
                      >
                        <option value="">Keep status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <input
                        type="text"
                        placeholder="AWB code"
                        value={editForm.awb_code}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            awb_code: e.target.value,
                          }))
                        }
                        className="ml-2 rounded border border-zinc-300 px-3 py-1 text-sm"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleUpdate(order._id)}
                          className="rounded bg-zinc-900 px-3 py-1 text-sm text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="rounded border px-3 py-1 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditing(order._id);
                        setEditForm({
                          status: order.status,
                          awb_code: order.awb_code || "",
                        });
                      }}
                      className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
