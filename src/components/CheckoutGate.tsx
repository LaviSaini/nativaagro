"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function CheckoutGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/checkout";

  if (isAuthenticated()) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900">
        Login required to checkout
      </h2>
      <p className="mt-2 text-zinc-600">
        Please login or create an account to complete your order.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
        >
          Login
        </Link>
        <Link
          href={`/auth/register?returnTo=${encodeURIComponent(returnTo)}`}
          className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Create Account
        </Link>
      </div>
      <Link
        href="/cart"
        className="mt-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to cart
      </Link>
    </div>
  );
}
