"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { setAuthToken, setAuthUser } from "@/lib/auth";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

function RegisterForm() {
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
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
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
          <label htmlFor="name" className="text-xs font-medium tracking-wide text-zinc-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium tracking-wide text-zinc-700">
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
          <label htmlFor="password" className="text-xs font-medium tracking-wide text-zinc-700">
            Password
          </label>
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
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href={`/auth/login${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
          className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <main className="bg-white">
      <Container>
        <div className="mx-auto max-w-md py-16">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Create account
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Join Nativa Agro for faster checkout and order tracking.
          </p>

          <div className="mt-8">
            <Suspense>
              <RegisterForm />
            </Suspense>
          </div>

          <div className="mt-6 grid gap-3">
            <ButtonLink href="#" variant="outline" className="w-full">
              Sign up with Google
            </ButtonLink>
            <ButtonLink href="#" variant="outline" className="w-full">
              Sign up with Facebook
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
