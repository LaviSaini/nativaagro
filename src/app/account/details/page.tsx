"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getAuthUser, setAuthUser, getAuthedUserId, type AuthUser } from "@/lib/auth";

export default function AccountDetailsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const u = getAuthUser();
    setUser(u);
    if (u) {
      const parts = (u.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(u.email || "");
    }

    const userId = u?._id;
    if (userId) {
      fetch("/api/account/profile", { headers: { "x-user-id": userId } })
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => {
          if (p?.phone) setPhone(String(p.phone));
        })
        .catch(() => {});
    }
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
                Account Details
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                Personal information and password settings.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditing((s) => !s)}
              disabled={!user}
            >
              {editing ? "Close" : "Edit"}
            </Button>
          </div>

          {!user ? (
            <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-sm text-zinc-700">
                Please login to manage account details.
              </p>
              <div className="mt-6">
                <ButtonLink href="/auth/login" variant="outline">
                  Login
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold tracking-wide text-zinc-900">
                      Personal Information
                    </p>
                    <button
                      type="button"
                      className="text-sm text-zinc-600 hover:text-zinc-900"
                      onClick={() => setEditing(true)}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4">
                    <Field
                      label="First name"
                      value={firstName}
                      onChange={setFirstName}
                      disabled={!editing}
                      placeholder="Enter your first name"
                    />
                    <Field
                      label="Last name"
                      value={lastName}
                      onChange={setLastName}
                      disabled={!editing}
                      placeholder="Enter your last name"
                    />
                    <Field
                      label="Email address"
                      value={email}
                      onChange={setEmail}
                      disabled
                      placeholder="Enter your email address"
                    />
                    <Field
                      label="Phone number"
                      value={phone}
                      onChange={setPhone}
                      disabled={!editing}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => {
                        if (!editing || !user) return;
                        const nextName = `${firstName} ${lastName}`.trim();
                        const nextUser: AuthUser = { ...user, name: nextName };
                        setAuthUser(nextUser);
                        setUser(nextUser);
                        const userId = getAuthedUserId();
                        if (userId) {
                          fetch("/api/account/profile", {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              "x-user-id": userId,
                            },
                            body: JSON.stringify({ name: nextName, phone }),
                          }).catch(() => {});
                        }
                        setEditing(false);
                      }}
                      disabled={!editing}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold tracking-wide text-zinc-900">
                    Password Change
                  </p>
                  <p className="mt-3 text-sm text-zinc-600">
                    Password change UI is available; backend update is not wired yet.
                  </p>

                  <div className="mt-6 grid gap-4">
                    <Field
                      label="Current Password (Leave blank to leave unchanged)"
                      value=""
                      onChange={() => {}}
                      disabled
                      placeholder="********"
                      type="password"
                    />
                    <Field
                      label="New Password (Leave blank to leave unchanged)"
                      value=""
                      onChange={() => {}}
                      disabled
                      placeholder=""
                      type="password"
                    />
                    <Field
                      label="Confirm New Password"
                      value=""
                      onChange={() => {}}
                      disabled
                      placeholder=""
                      type="password"
                    />
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" disabled className="w-full">
                      Update password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium tracking-wide text-zinc-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20 disabled:bg-zinc-50"
      />
    </div>
  );
}

