"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin, isAuthenticated } from "@/lib/auth";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated()) {
      router.replace("/auth/login?returnTo=/admin");
      return;
    }
    if (!isAdmin()) {
      router.replace("/");
      return;
    }
  }, [mounted, router]);

  // Always show loading until mounted - avoids hydration mismatch (localStorage is client-only)
  if (!mounted || !isAuthenticated() || !isAdmin()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
