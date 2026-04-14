"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import { AdminFlash } from "@/components/admin/AdminFlash";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface Stats {
  products: number;
  categories: number;
  orders: number;
  users: number;
  revenue: number;
  pendingOrders: number;
  orderStatusBreakdown?: { status: string; count: number }[];
}

const PIE_COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899", "#14b8a6", "#a855f7", "#64748b"];

function StatCard({
  label,
  value,
  href,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  href: string;
  accent: "violet" | "emerald" | "amber" | "sky" | "rose" | "slate";
  sub?: string;
}) {
  const border = {
    violet: "border-l-violet-500 bg-violet-50/40",
    emerald: "border-l-emerald-500 bg-emerald-50/40",
    amber: "border-l-amber-500 bg-amber-50/40",
    sky: "border-l-sky-500 bg-sky-50/40",
    rose: "border-l-rose-500 bg-rose-50/40",
    slate: "border-l-slate-500 bg-slate-50/50",
  }[accent];
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md ${border} border-l-4`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-zinc-500">{sub}</p> : null}
      <span className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 group-hover:underline">
        Open
        <span className="ml-0.5" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<{ period: string; orders: number; revenue: number }[]>([]);
  const [error, setError] = useState("");
  const [chartError, setChartError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    adminFetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((s: Stats) =>
        setStats({
          ...s,
          orderStatusBreakdown: Array.isArray(s.orderStatusBreakdown) ? s.orderStatusBreakdown : [],
        })
      )
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setChartError("");
    adminFetch("/api/admin/analytics?period=monthly")
      .then((r) => {
        if (!r.ok) throw new Error("Chart unavailable");
        return r.json();
      })
      .then((res) => setChartData(res.data?.slice(-6) || []))
      .catch(() => {
        setChartData([]);
        setChartError("Could not load chart data.");
      });
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-zinc-500">Loading dashboard…</p>
      </div>
    );
  }

  if (error || !stats) {
    return <AdminFlash type="error">{error || "Failed to load dashboard"}</AdminFlash>;
  }

  const breakdown = stats.orderStatusBreakdown ?? [];
  const pieData = breakdown.filter((d) => d.count > 0).map((d) => ({ name: d.status, value: d.count }));

  return (
    <div className="space-y-8">
      {chartError ? <AdminFlash type="error">{chartError}</AdminFlash> : null}

      <section className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-950 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-zinc-300">Admin</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Snapshot of your store: catalog size, customers, orders, and revenue trends.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/analytics"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow hover:bg-zinc-100"
            >
              Full analytics
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              Add product
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              Orders
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Products" value={stats.products} href="/admin/products" accent="violet" />
          <StatCard label="Categories" value={stats.categories} href="/admin/categories" accent="emerald" />
          <StatCard label="Orders" value={stats.orders} href="/admin/orders" accent="amber" />
          <StatCard label="Users" value={stats.users} href="/admin/users" accent="sky" />
          <StatCard
            label="Total revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            href="/admin/analytics"
            accent="rose"
            sub="All-time from orders"
          />
          <StatCard
            label="Active pipeline"
            value={stats.pendingOrders}
            href="/admin/orders?status=active"
            accent="slate"
            sub="Pending, processing, or shipped"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Revenue &amp; orders</h2>
              <p className="text-sm text-zinc-500">Last six periods (monthly)</p>
            </div>
            <Link href="/admin/analytics" className="text-sm font-medium text-indigo-600 hover:underline">
              Details →
            </Link>
          </div>
          {chartData.length > 0 ? (
            <div className="h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#71717a" />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    stroke="#71717a"
                    tickFormatter={(v) => `$${v}`}
                    width={56}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    stroke="#71717a"
                    allowDecimals={false}
                    width={36}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "revenue" || name === "Revenue")
                        return [`$${Number(value).toFixed(2)}`, "Revenue"];
                      return [value, "Orders"];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    name="Revenue"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#f97316" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80">
              <p className="text-sm text-zinc-500">No analytics periods yet. Revenue chart appears when orders exist.</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Orders by status</h2>
          <p className="text-sm text-zinc-500">Share of all orders</p>
          {pieData.length > 0 ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`${entry.name}-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [Number(value ?? 0), "Orders"]}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-8 flex h-48 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80">
              <p className="px-4 text-center text-sm text-zinc-500">No orders yet, or status data is empty.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
