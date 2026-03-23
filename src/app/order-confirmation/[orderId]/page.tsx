import Link from "next/link";

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
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Order not found</h1>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const total = order.total ?? 0;
  const address = order.shippingAddress || {};

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-zinc-600">
            Thank you for your order. We&apos;ll send you a confirmation email
            shortly.
          </p>

          <div className="mt-8 rounded-lg bg-zinc-50 p-6 text-left">
            <p className="text-sm font-medium text-zinc-900">
              Order ID: <span className="font-mono">{order._id}</span>
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Status: <span className="capitalize">{order.status}</span>
            </p>

            <div className="mt-4 border-t border-zinc-200 pt-4">
              <h3 className="text-sm font-medium text-zinc-900">
                Shipping to
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                {address.fullName}
                <br />
                {address.address}
                <br />
                {address.city}, {address.state} {address.zip}
                <br />
                {address.country}
              </p>
            </div>

            <div className="mt-4 border-t border-zinc-200 pt-4">
              <h3 className="text-sm font-medium text-zinc-900">
                Order Summary
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                {items.map(
                  (item: {
                    productId: string;
                    quantity: number;
                    product?: { name: string; price: number };
                  }) => (
                    <li key={item.productId}>
                      {item.product?.name || "Item"} × {item.quantity}
                      {item.product?.price != null &&
                        ` — $${(item.product.price * item.quantity).toFixed(2)}`}
                    </li>
                  )
                )}
              </ul>
              <p className="mt-2 font-semibold text-zinc-900">
                Total: ${total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/track-order/${order._id}`}
              className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
            >
              Track Order
            </Link>
            <Link
              href="/account/orders"
              className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              View Orders
            </Link>
            <Link
              href="/products"
              className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
