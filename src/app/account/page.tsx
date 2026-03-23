import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">My Account</h1>
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="font-semibold text-zinc-900">Order History</h2>
            <p className="mt-2 text-sm text-zinc-600">
              View and track your orders
            </p>
          </Link>
          <Link
            href="/account/orders/in-transit"
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="font-semibold text-zinc-900">Orders in Transit</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Track orders not yet delivered
            </p>
          </Link>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-zinc-900">Profile</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Manage your account details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
