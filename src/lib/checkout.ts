const SHIPPING_KEY = "ecomapp_shipping";
const SHIPPING_METHOD_KEY = "ecomapp_shipping_method";
const SESSION_KEY = "ecomapp_session";

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type ShippingMethodId = "free" | "express" | "schedule";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  price: number;
  description: string;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "free",
    label: "Free",
    price: 0,
    description: "Regular shipment",
  },
  {
    id: "express",
    label: "₹99",
    price: 99,
    description: "Get your delivery as soon as possible",
  },
  {
    id: "schedule",
    label: "Schedule",
    price: 49,
    description: "Pick a date when you want to get your delivery",
  },
];

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

export function setShippingMethod(methodId: ShippingMethodId) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SHIPPING_METHOD_KEY, methodId);
  }
}

export function getShippingMethod(): ShippingMethodId {
  if (typeof window === "undefined") return "free";
  const stored = sessionStorage.getItem(SHIPPING_METHOD_KEY) as ShippingMethodId | null;
  if (!stored) return "free";
  if (stored !== "free" && stored !== "express" && stored !== "schedule") return "free";
  return stored;
}

export function clearShippingMethod() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SHIPPING_METHOD_KEY);
  }
}
