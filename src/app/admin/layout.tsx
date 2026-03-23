import { Suspense } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "./AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-zinc-100">
        <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white">
          <div className="sticky top-0 flex h-screen flex-col p-4">
            <Link
              href="/admin"
              className="mb-6 text-xl font-bold text-zinc-900"
            >
              Admin
            </Link>
            <nav className="flex flex-1 flex-col gap-1">
              <AdminNav href="/admin">Dashboard</AdminNav>
              <AdminNav href="/admin/analytics">Analytics</AdminNav>
              <AdminNav href="/admin/products">Products</AdminNav>
              <AdminNav href="/admin/categories">Categories</AdminNav>
              <AdminNav href="/admin/orders">Orders</AdminNav>
            </nav>
            <Link
              href="/"
              className="mt-4 rounded-lg px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
            >
              ← Back to store
            </Link>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">
          <Suspense fallback={<p className="text-zinc-600">Loading...</p>}>
            {children}
          </Suspense>
        </main>
      </div>
    </AdminGuard>
  );
}
