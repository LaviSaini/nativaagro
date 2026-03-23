import { Suspense } from "react";
import CheckoutGate from "@/components/CheckoutGate";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <p className="text-zinc-600">Loading...</p>
        </div>
      }
    >
      <CheckoutGate>{children}</CheckoutGate>
    </Suspense>
  );
}
