const SHIPPING_KEY = "ecomapp_shipping";
const SESSION_KEY = "ecomapp_session";

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "guest";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function setShippingAddress(address: ShippingAddress) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SHIPPING_KEY, JSON.stringify(address));
  }
}

export function getShippingAddress(): ShippingAddress | null {
  if (typeof window !== "undefined") {
    const data = sessionStorage.getItem(SHIPPING_KEY);
    return data ? (JSON.parse(data) as ShippingAddress) : null;
  }
  return null;
}

export function clearShippingAddress() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SHIPPING_KEY);
  }
}
