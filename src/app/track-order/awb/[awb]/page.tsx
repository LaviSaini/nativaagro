"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

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
      <main className="bg-white">
        <Container>
          <div className="py-14">
            <p className="text-zinc-600">Loading tracking...</p>
          </div>
        </Container>
      </main>
    );
  }

  const shipment = data?.tracking_data?.shipment_track?.[0] || data;
  const scans = shipment?.scan || data?.scan || [];
  const status = shipment?.current_status || data?.current_status;
  const courier = shipment?.courier_name || data?.courier_name;
  const edd = shipment?.edd || data?.edd;
  const delivered = shipment?.delivered_date || data?.delivered_date;

  return (
    <main className="bg-white">
      <Container>
        <div className="mx-auto max-w-5xl py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <ButtonLink href="/track-order" variant="ghost" size="sm">
                Back
              </ButtonLink>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
                AWB Tracking
              </h1>
              <p className="mt-3 text-sm text-zinc-600">
                Track shipment updates using your AWB/Tracking number.
              </p>
            </div>
          </div>

          {error ? (
            <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-sm text-zinc-700">{error}</p>
              <p className="mt-2 text-xs text-zinc-500">
                AWB: <span className="font-mono">{awb}</span>
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold tracking-wide text-zinc-900">
                    Shipment details
                  </p>
                  <div className="mt-5 grid gap-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        AWB
                      </p>
                      <p className="mt-2 font-mono text-sm text-zinc-900">
                        {data?.awb_code || awb}
                      </p>
                    </div>
                    {courier ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Courier
                        </p>
                        <p className="mt-2 text-sm text-zinc-900">{courier}</p>
                      </div>
                    ) : null}
                    {status ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Status
                        </p>
                        <p className="mt-2 text-sm font-medium text-zinc-900 capitalize">
                          {status}
                        </p>
                      </div>
                    ) : null}
                    {edd ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Est. delivery
                        </p>
                        <p className="mt-2 text-sm text-zinc-900">{edd}</p>
                      </div>
                    ) : null}
                    {delivered ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          Delivered
                        </p>
                        <p className="mt-2 text-sm text-zinc-900">{delivered}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                {scans.length > 0 ? (
                  <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                    <p className="text-sm font-semibold tracking-wide text-zinc-900">
                      Tracking history
                    </p>
                    <div className="mt-6 space-y-4">
                      {scans.map((scan, i) => (
                        <div key={i} className="flex gap-4 border-l-2 border-zinc-200 pl-4">
                          <div className="min-w-[120px] text-xs text-zinc-500">
                            {scan.date} {scan.time}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-900">
                              {scan.status || scan.activity}
                            </p>
                            {scan.location ? (
                              <p className="mt-1 text-xs text-zinc-500">{scan.location}</p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-sm text-zinc-600">
                    No tracking scans yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
