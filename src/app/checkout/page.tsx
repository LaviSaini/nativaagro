import CheckoutFlow from "@/components/CheckoutFlow";
import Container from "@/components/ui/Container";

export default function CheckoutPage() {
  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Checkout
          </h1>
          <div className="mt-8">
            <CheckoutFlow />
          </div>
        </div>
      </Container>
    </main>
  );
}
