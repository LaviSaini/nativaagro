"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);

  return (
    <main className="bg-white">
      <Container>
        <div className="mx-auto max-w-md py-16">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Reset Password
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Enter a new password for your account.
          </p>

          {done ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-sm text-zinc-700">Password updated.</p>
              <div className="mt-6">
                <ButtonLink href="/auth/login" className="w-full">
                  Back to login
                </ButtonLink>
              </div>
            </div>
          ) : (
            <form
              className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <label className="text-xs font-medium tracking-wide text-zinc-700">
                Enter New Password
              </label>
              <input
                type="password"
                required
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
              />

              <label className="mt-4 block text-xs font-medium tracking-wide text-zinc-700">
                Repeat New Password
              </label>
              <input
                type="password"
                required
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
              />

              <div className="mt-6">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>

              <div className="mt-6 text-center">
                <ButtonLink href="/auth/login" variant="ghost">
                  Back
                </ButtonLink>
              </div>
            </form>
          )}
        </div>
      </Container>
    </main>
  );
}

