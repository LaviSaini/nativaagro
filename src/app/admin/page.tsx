"use client";

import { useState, useEffect } from "react";
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

interface Stats {
  products: number;
  categories: number;
  orders: number;
  users: number;
  revenue: number;
  pendingOrders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<{ period: string; orders: number; revenue: number }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(setStats)
      .catch(() => setError("Failed to load dashboard"));
  }, []);

  useEffect(() => {
    adminFetch("/api/admin/analytics?period=monthly")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => setChartData(res.data?.slice(-6) || []));
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!stats) {
    return <p className="text-zinc-600">Loading dashboard...</p>;
  }

  const cards = [
    { label: "Products", value: stats.products, href: "/admin/products" },
    { label: "Categories", value: stats.categories, href: "/admin/categories" },
    { label: "Orders", value: stats.orders, href: "/admin/orders" },
    { label: "Users", value: stats.users },
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, href: "/admin/analytics" },
    { label: "Pending Orders", value: stats.pendingOrders, href: "/admin/orders?status=active" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <a
          href="/admin/analytics"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Analytics
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-zinc-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">
              {card.value}
            </p>
            {card.href && (
              <Link
                href={card.href}
                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
              >
                View →
              </Link>
            )}
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">
              Sales Overview (Last 6 months)
            </h2>
            <Link
              href="/admin/analytics"
              className="text-sm text-blue-600 hover:underline"
            >
              View full analytics →
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#71717a" />
                <YAxis tick={{ fontSize: 11 }} stroke="#71717a" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value) =>
                    value != null ? [`$${Number(value).toFixed(2)}`, "Revenue"] : []
                  }
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
