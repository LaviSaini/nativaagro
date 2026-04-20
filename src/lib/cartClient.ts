import { getSessionId } from "./checkout";

export const CART_UPDATED_EVENT = "ecomapp:cart-updated";

export function notifyCartUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

/** Total units across all cart lines (sum of quantities). */
export async function fetchCartItemCount(): Promise<number> {
  const sessionId = getSessionId();
  const r = await fetch(`/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
  if (!r.ok) return 0;
  const data: { items?: Array<{ quantity?: number }> } = await r.json();
  const items = data.items || [];
  return items.reduce(
    (sum, i) => sum + (typeof i.quantity === "number" ? i.quantity : 0),
    0
  );
}
