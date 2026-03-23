import CheckoutFlow from "@/components/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">Checkout</h1>
        <CheckoutFlow />
      </div>
    </div>
  );
}
