import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

async function getOrder(orderId: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/orders/${orderId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <main className="bg-white">
        <Container>
          <div className="py-20 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Order not found
            </h1>
            <div className="mt-6">
              <ButtonLink href="/" variant="outline">
                Back to home
              </ButtonLink>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const items = order.items || [];
  const total = order.total ?? 0;
  const address = order.shippingAddress || {};

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
              Congratulations on your order!
            </h1>
            <p className="mt-3 text-sm text-zinc-600">
              While you wait for your order to arrive, why not start a habit of a short breathing exercise to help you feel relaxed.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-zinc-600">
                      Orders · ID <span className="font-mono">{String(order._id).slice(-10)}</span>
                    </p>
                    <div className="flex gap-2">
                      <ButtonLink href={`/track-order/${order._id}`} variant="outline" size="sm">
                        Track order
                      </ButtonLink>
                      <ButtonLink href="/account/orders" size="sm">
                        Orders
                      </ButtonLink>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Order ID
                    </p>
                    <p className="mt-2 font-mono text-sm text-zinc-900">{order._id}</p>
                    <p className="mt-2 text-sm text-zinc-600">
                      Status: <span className="capitalize">{order.status}</span>
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold tracking-wide text-zinc-900">
                      Items
                    </p>
                    <div className="mt-4 space-y-3">
                      {items.map(
                        (item: {
                          productId: string;
                          quantity: number;
                          product?: { name: string; price: number };
                        }) => (
                          <div
                            key={item.productId}
                            className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-200 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-14 w-14 rounded-xl bg-zinc-100" />
                              <div>
                                <p className="text-sm font-medium text-zinc-900">
                                  {item.product?.name || "Item"}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-zinc-900">
                              ₹
                              {Math.round(
                                (item.product?.price || 0) * (item.quantity || 0)
                              )}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <h2 className="text-lg font-semibold tracking-wide text-zinc-900">
                    Order Summary
                  </h2>
                  <div className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm">
                    <div className="flex justify-between text-zinc-700">
                      <span>Delivery</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span>Tax</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-semibold text-zinc-900">
                      <span>Total</span>
                      <span>₹{Math.round(total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <p className="text-sm font-semibold tracking-wide text-zinc-900">
                      Delivery Address
                    </p>
                    <p className="mt-3 text-sm text-zinc-600">
                      {address.fullName}
                      <br />
                      {address.address}
                      <br />
                      {address.city}, {address.state} {address.zip}
                      <br />
                      {address.country}
                    </p>
                  </div>

                  <div className="mt-6">
                    <ButtonLink href="/products" variant="outline" className="w-full">
                      Continue shopping
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
