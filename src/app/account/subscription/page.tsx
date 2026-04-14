"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getAuthedUserId } from "@/lib/auth";

type SubscriptionStatus = "Active" | "Cancelled" | "Paused";

type Subscription = {
  status: SubscriptionStatus;
  nextChargeDate: string;
  amount: number;
  endsOn?: string;
};

export default function ManageSubscriptionPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  useEffect(() => {
    const demo: Subscription = {
      status: "Active",
      nextChargeDate: "Jan 12, 2027",
      amount: 10,
      endsOn: "Jan 12, 2027",
    };
    const userId = getAuthedUserId();
    if (!userId) {
      setSub(demo);
      return;
    }

    fetch("/api/account/subscription", { headers: { "x-user-id": userId } })
      .then((r) => (r.ok ? r.json() : { subscription: null }))
      .then((d) => setSub(d.subscription || demo))
      .catch(() => setSub(demo));
  }, []);

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <ButtonLink href="/account" variant="ghost" size="sm">
                Back
              </ButtonLink>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
                Manage Subscription
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                Monthly subscription details and actions.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-zinc-900">
                      Monthly Subscription
                    </p>
                    <p className="mt-3 text-sm text-zinc-600">
                      Next charge is ${sub?.amount?.toFixed(2)} USD on{" "}
                      {sub?.nextChargeDate}.
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                      sub?.status === "Active"
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-300 text-zinc-700"
                    }`}
                  >
                    {sub?.status || "Active"}
                  </span>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Actions
                    </p>
                    <p className="mt-2 text-sm text-zinc-700">
                      Cancel subscription at any time.
                    </p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setConfirmingCancel(true)}
                        disabled={sub?.status !== "Active"}
                      >
                        Cancel subscription
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Ends on
                    </p>
                    <p className="mt-2 text-sm text-zinc-700">
                      {sub?.endsOn || "—"}
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                      When cancelled.
                    </p>
                  </div>
                </div>
              </div>

              {confirmingCancel ? (
                <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-sm font-semibold tracking-wide text-zinc-900">
                    Cancel Subscription
                  </p>
                  <p className="mt-3 text-sm text-zinc-600">
                    The subscription will be paused and we will not be charging you forward.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmingCancel(false)}
                    >
                      No
                    </Button>
                    <Button
                      onClick={() => {
                        const next: Subscription = {
                          ...(sub || {
                            status: "Cancelled",
                            nextChargeDate: "",
                            amount: 0,
                          }),
                          status: "Cancelled",
                        };
                        const userId = getAuthedUserId();
                        if (userId) {
                          fetch("/api/account/subscription", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              "x-user-id": userId,
                            },
                            body: JSON.stringify({ subscription: next }),
                          }).catch(() => {});
                        }
                        setSub(next);
                        setConfirmingCancel(false);
                      }}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-semibold tracking-wide text-zinc-900">
                  Notes
                </p>
                <p className="mt-3 text-sm text-zinc-600">
                  This subscription UI is implemented to match the PDF screens.
                  Billing provider integration can be added next (Razorpay/Stripe/etc.).
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

