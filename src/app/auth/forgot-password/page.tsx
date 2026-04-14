"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="bg-white">
      <Container>
        <div className="mx-auto max-w-md py-16">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Forgot Your Password?
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Enter your email address and we’ll send you a verification code.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-sm text-zinc-700">
                If an account exists for that email, a verification code has been sent.
              </p>
              <div className="mt-6">
                <ButtonLink href="/auth/verify-code" className="w-full">
                  Enter verification code
                </ButtonLink>
              </div>
            </div>
          ) : (
            <form
              className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <label className="text-xs font-medium tracking-wide text-zinc-700">
                Email
              </label>
              <input
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                placeholder="you@example.com"
              />
              <div className="mt-6">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
              <div className="mt-6 text-center">
                <ButtonLink href="/auth/login" variant="ghost">
                  Back to login
                </ButtonLink>
              </div>
            </form>
          )}
        </div>
      </Container>
    </main>
  );
}

