"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/product-images";

function isRemote(u: string) {
  return u.startsWith("http://") || u.startsWith("https://");
}

export function ProductImageGallery({ urls, alt }: { urls: string[]; alt: string }) {
  const list = useMemo(() => {
    const u = (urls || []).map((x) => String(x).trim()).filter(Boolean);
    return u.length ? u : [FALLBACK_PRODUCT_IMAGE];
  }, [urls]);

  const [active, setActive] = useState(0);
  const safeIndex = Math.min(Math.max(0, active), list.length - 1);
  const main = list[safeIndex] ?? FALLBACK_PRODUCT_IMAGE;

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-zinc-200 bg-zinc-100">
        {isRemote(main) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={main} alt={alt} className="h-full w-full object-contain p-8" />
        ) : (
          <Image
            src={main}
            alt={alt}
            fill
            className="object-contain p-8"
            sizes="(max-width: 768px) 100vw, 58vw"
            priority
          />
        )}
      </div>
      {list.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {list.map((u, i) => (
            <button
              key={`${i}-${u}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-14 w-14 overflow-hidden rounded-lg border-2 bg-white transition ${
                i === safeIndex ? "border-zinc-900 ring-2 ring-zinc-900/20" : "border-zinc-200 opacity-80 hover:opacity-100"
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              {isRemote(u) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u} alt="" className="h-full w-full object-cover" />
              ) : (
                <Image src={u} alt="" fill className="object-cover" sizes="56px" unoptimized={u.endsWith(".svg")} />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
