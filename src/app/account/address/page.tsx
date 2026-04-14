"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getAuthedUserId } from "@/lib/auth";

type Address = {
  id: string;
  label: "Home" | "Work";
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
};

export default function AccountAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<Address, "id">>({
    label: "Home",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    const userId = getAuthedUserId();
    if (!userId) {
      setAddresses([
        {
          id: "addr_demo",
          label: "Home",
          line1: "2118 Thornridge Cir.",
          line2: "Syracuse, Connecticut",
          city: "Syracuse",
          state: "Connecticut",
          zip: "35624",
          phone: "(209) 555-0104",
        },
      ]);
      return;
    }

    fetch("/api/account/addresses", { headers: { "x-user-id": userId } })
      .then((r) => (r.ok ? r.json() : { addresses: [] }))
      .then((d) => setAddresses(d.addresses || []))
      .catch(() => setAddresses([]));
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.line1.trim() &&
      form.city.trim() &&
      form.state.trim() &&
      form.zip.trim()
    );
  }, [form]);

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
                Address
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                The following addresses will be used on the checkout page by default.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setAdding((s) => !s)}
            >
              {adding ? "Close" : "Add New Address"}
            </Button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold tracking-wide text-zinc-900">
                  Addresses
                </h2>
                <div className="mt-5 space-y-4">
                  {addresses.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-zinc-200 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {a.line1}{" "}
                            <span className="ml-2 rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700">
                              {a.label}
                            </span>
                          </p>
                          <p className="mt-2 text-sm text-zinc-600">
                            {a.line2 ? (
                              <>
                                {a.line2}
                                <br />
                              </>
                            ) : null}
                            {a.city}, {a.state} {a.zip}
                            {a.phone ? (
                              <>
                                <br />
                                {a.phone}
                              </>
                            ) : null}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                          onClick={() => {
                            setAddresses((prev) => {
                              const next = prev.filter((x) => x.id !== a.id);
                              const userId = getAuthedUserId();
                              if (userId) {
                                fetch("/api/account/addresses", {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "x-user-id": userId,
                                  },
                                  body: JSON.stringify({ addresses: next }),
                                }).catch(() => {});
                              }
                              return next;
                            });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                <h2 className="text-sm font-semibold tracking-wide text-zinc-900">
                  Default usage
                </h2>
                <p className="mt-3 text-sm text-zinc-600">
                  Checkout will use your most recently added address.
                </p>
              </div>

              {adding ? (
                <form
                  className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!canSubmit) return;
                    const next: Address = {
                      id: `addr_${Date.now()}`,
                      ...form,
                      line2: form.line2?.trim() || undefined,
                      phone: form.phone?.trim() || undefined,
                    };
                    setAddresses((prev) => {
                      const updated = [next, ...prev];
                      const userId = getAuthedUserId();
                      if (userId) {
                        fetch("/api/account/addresses", {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            "x-user-id": userId,
                          },
                          body: JSON.stringify({ addresses: updated }),
                        }).catch(() => {});
                      }
                      return updated;
                    });
                    setAdding(false);
                    setForm({
                      label: "Home",
                      line1: "",
                      line2: "",
                      city: "",
                      state: "",
                      zip: "",
                      phone: "",
                    });
                  }}
                >
                  <h3 className="text-sm font-semibold tracking-wide text-zinc-900">
                    Add address
                  </h3>

                  <div className="mt-4 grid gap-4">
                    <div className="flex gap-2">
                      {(["Home", "Work"] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, label: l }))}
                          className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                            form.label === l
                              ? "bg-zinc-900 text-white"
                              : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>

                    <Field
                      label="Address line 1*"
                      value={form.line1}
                      onChange={(v) => setForm((f) => ({ ...f, line1: v }))}
                    />
                    <Field
                      label="Address line 2"
                      value={form.line2 || ""}
                      onChange={(v) => setForm((f) => ({ ...f, line2: v }))}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="City*"
                        value={form.city}
                        onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                      />
                      <Field
                        label="State*"
                        value={form.state}
                        onChange={(v) => setForm((f) => ({ ...f, state: v }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="ZIP*"
                        value={form.zip}
                        onChange={(v) => setForm((f) => ({ ...f, zip: v }))}
                      />
                      <Field
                        label="Phone"
                        value={form.phone || ""}
                        onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button type="submit" disabled={!canSubmit} className="w-full">
                      Save address
                    </Button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium tracking-wide text-zinc-700">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
      />
    </div>
  );
}

