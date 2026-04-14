"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  onClick,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-[6px] font-semibold tracking-wide transition focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/35 disabled:opacity-50 disabled:pointer-events-none";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
  } as const;
  const variants = {
    primary:
      "bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-2)] text-white shadow-sm hover:brightness-[0.98]",
    outline:
      "border border-[color:var(--brand)] text-[color:var(--ink)] hover:bg-white/60",
    ghost: "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50",
  } as const;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-[6px] font-semibold tracking-wide transition focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/35";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
  } as const;
  const variants = {
    primary:
      "bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-2)] text-white shadow-sm hover:brightness-[0.98]",
    outline:
      "border border-[color:var(--brand)] text-[color:var(--ink)] hover:bg-white/60",
    ghost: "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50",
  } as const;

  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </Link>
  );
}

