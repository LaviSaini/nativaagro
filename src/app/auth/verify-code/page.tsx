"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function VerifyCodePage() {
  const [code, setCode] = useState("");

  return (
    <main className="bg-white">
      <Container>
        <div className="mx-auto max-w-md py-16">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Enter Verification Code
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Enter the verification code that has been sent to your registered email address.
          </p>

          <form
            className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              // Placeholder flow: proceed to reset page.
              window.location.href = "/auth/reset-password";
            }}
          >
            <label className="text-xs font-medium tracking-wide text-zinc-700">
              Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm tracking-widest outline-none focus:ring-2 focus:ring-zinc-900/20"
              placeholder="123456"
              maxLength={6}
            />

            <div className="mt-6">
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-zinc-600 hover:text-zinc-900"
                onClick={() => {
                  // Placeholder: resend not implemented
                }}
              >
                Resend
              </button>
              <ButtonLink href="/auth/login" variant="ghost">
                Back
              </ButtonLink>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}

