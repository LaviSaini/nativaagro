"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TrackingScan {
  date?: string;
  time?: string;
  status?: string;
  activity?: string;
  location?: string;
}

interface TrackingData {
  awb_code?: string;
  courier_name?: string;
  current_status?: string;
  delivered_date?: string;
  edd?: string;
  scan?: TrackingScan[];
  tracking_data?: {
    shipment_track?: Array<{
      awb_code?: string;
      courier_name?: string;
      current_status?: string;
      delivered_date?: string;
      edd?: string;
      scan?: TrackingScan[];
    }>;
  };
}

export default function TrackByAwbPage() {
  const params = useParams();
  const awb = params.awb as string;
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!awb) return;
    fetch(`/api/shiprocket/track?awb=${encodeURIComponent(awb)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) setError(res.error);
        else setData(res);
      })
      .catch(() => setError("Failed to load tracking"))
      .finally(() => setLoading(false));
  }, [awb]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-zinc-600">Loading tracking...</p>
        </div>
      </div>
    );
  }

  const shipment = data?.tracking_data?.shipment_track?.[0] || data;
  const scans = shipment?.scan || data?.scan || [];
  const status = shipment?.current_status || data?.current_status;
  const courier = shipment?.courier_name || data?.courier_name;
  const edd = shipment?.edd || data?.edd;
  const delivered = shipment?.delivered_date || data?.delivered_date;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href="/track-order"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to track order
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-zinc-900">
          AWB Tracking
        </h1>

        {error ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-zinc-600">{error}</p>
            <p className="mt-2 text-sm text-zinc-500">AWB: {awb}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500">AWB</p>
                  <p className="font-mono text-sm text-zinc-900">
                    {data?.awb_code || awb}
                  </p>
                </div>
                {courier && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Courier</p>
                    <p className="text-sm text-zinc-900">{courier}</p>
                  </div>
                )}
                {status && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Status</p>
                    <p className="text-sm font-medium text-zinc-900 capitalize">
                      {status}
                    </p>
                  </div>
                )}
                {edd && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Est. Delivery
                    </p>
                    <p className="text-sm text-zinc-900">{edd}</p>
                  </div>
                )}
                {delivered && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Delivered
                    </p>
                    <p className="text-sm text-zinc-900">{delivered}</p>
                  </div>
                )}
              </div>
            </div>

            {scans.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold text-zinc-900">
                  Tracking History
                </h2>
                <div className="space-y-4">
                  {scans.map((scan, i) => (
                    <div
                      key={i}
                      className="flex gap-4 border-l-2 border-zinc-200 pl-4"
                    >
                      <div className="min-w-[80px] text-xs text-zinc-500">
                        {scan.date} {scan.time}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {scan.status || scan.activity}
                        </p>
                        {scan.location && (
                          <p className="text-xs text-zinc-500">
                            {scan.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
