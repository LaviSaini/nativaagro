"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { setAuthToken, setAuthUser } from "@/lib/auth";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.token) {
        setAuthToken(data.token);
      }
      if (data.user) {
        setAuthUser(data.user);
      }
      router.push(returnTo);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
    >
      {error && (
        <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-xs font-medium tracking-wide text-zinc-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium tracking-wide text-zinc-700"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-zinc-600 hover:text-zinc-900"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
          />
        </div>
      </div>
      <div className="mt-6">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link
          href={`/auth/register${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
          className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="bg-white">
      <Container>
        <div className="mx-auto max-w-md py-16">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Login
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Welcome back. Please enter your details.
          </p>

          <div className="mt-8">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>

          <div className="mt-6">
            <ButtonLink href="/auth/register" variant="outline" className="w-full">
              Create account
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
