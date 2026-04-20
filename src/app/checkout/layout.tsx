import { Suspense } from "react";
import CheckoutGate from "@/components/CheckoutGate";
import PageSkeleton from "@/components/PageSkeleton";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CheckoutGate>{children}</CheckoutGate>
    </Suspense>
  );
}
