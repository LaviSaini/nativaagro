"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { adminFetch } from "@/lib/admin-api";
import { AdminFlash } from "@/components/admin/AdminFlash";

interface DataPoint {
  period: string;
  orders: number;
  revenue: number;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"daily" | "monthly" | "quarterly">(
    "monthly"
  );
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    adminFetch(`/api/admin/analytics?period=${period}`)
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || "Failed to load analytics");
        }
        return r.json();
      })
      .then((res) => setData(res.data || []))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div>
      {error ? <AdminFlash type="error">{error}</AdminFlash> : null}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Sales & Orders</h1>
        <div className="flex gap-2">
          {(["daily", "monthly", "quarterly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                period === p
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-600">Loading analytics...</p>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
          <p className="text-zinc-600">No data for this period yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              Revenue
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12 }}
                    stroke="#71717a"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                  <Tooltip
                    formatter={(value) =>
                      value != null ? [`$${Number(value).toFixed(2)}`, "Revenue"] : []
                    }
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              Orders
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12 }}
                    stroke="#71717a"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", r: 4 }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              Combined View
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12 }}
                    stroke="#71717a"
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#71717a" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
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
                  <Legend />
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
                    name="Revenue ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
