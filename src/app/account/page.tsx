"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { getAuthUser, type AuthUser } from "@/lib/auth";

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);
  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            My Account
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            {user ? `Signed in as ${user.email}` : "Manage your orders and account details."}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Navigation
                </p>
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  <Link className="rounded-2xl px-3 py-2 hover:bg-zinc-50" href="/account/orders">
                    Orders
                  </Link>
                  <Link
                    className="rounded-2xl px-3 py-2 hover:bg-zinc-50"
                    href="/account/orders/in-transit"
                  >
                    In transit
                  </Link>
                  <Link className="rounded-2xl px-3 py-2 hover:bg-zinc-50" href="/account/address">
                    Address
                  </Link>
                  <Link className="rounded-2xl px-3 py-2 hover:bg-zinc-50" href="/account/details">
                    Account Details
                  </Link>
                  <Link className="rounded-2xl px-3 py-2 hover:bg-zinc-50" href="/account/subscription">
                    Manage Subscription
                  </Link>
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <Link
                  href="/account/orders"
                  className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
                >
                  <p className="text-sm font-semibold tracking-wide text-zinc-900">
                    Orders
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    View and track your orders
                  </p>
                </Link>
                <Link
                  href="/account/orders/in-transit"
                  className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
                >
                  <p className="text-sm font-semibold tracking-wide text-zinc-900">
                    Orders in transit
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Track orders not yet delivered
                  </p>
                </Link>
              </div>

              {!user ? (
                <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-sm text-zinc-700">
                    Sign in to see your account details and faster checkout.
                  </p>
                  <div className="mt-4">
                    <ButtonLink href="/auth/login" variant="outline">
                      Login
                    </ButtonLink>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
