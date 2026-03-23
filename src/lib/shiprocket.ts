const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getShiprocketToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD must be set in .env.local"
    );
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Shiprocket authentication failed");
  }

  const data = (await res.json()) as { token: string };
  cachedToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days (refresh before 10-day expiry)

  return cachedToken;
}

export interface ShiprocketTrackingScan {
  date?: string;
  time?: string;
  status?: string;
  activity?: string;
  location?: string;
}

export interface ShiprocketTrackingData {
  awb_code?: string;
  courier_name?: string;
  current_status?: string;
  delivered_date?: string;
  edd?: string;
  scan?: ShiprocketTrackingScan[];
  tracking_data?: {
    track_status?: number;
    shipment_track?: Array<{
      awb_code?: string;
      courier_id?: string;
      courier_name?: string;
      current_status?: string;
      delivered_date?: string;
      edd?: string;
      scan?: ShiprocketTrackingScan[];
    }>;
  };
}

export async function trackShipment(awbCode: string): Promise<ShiprocketTrackingData> {
  const token = await getShiprocketToken();

  const res = await fetch(`${BASE_URL}/courier/track/awb/${awbCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Tracking failed for AWB: ${awbCode}`);
  }

  return res.json();
}
