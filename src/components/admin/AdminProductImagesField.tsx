"use client";

import Image from "next/image";
import { useState } from "react";
import { adminUploadImage } from "@/lib/admin-api";
import { MAX_PRODUCT_IMAGES } from "@/lib/product-images";

type Props = {
  images: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  helpText?: string;
};

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function AdminProductImagesField({
  images,
  onChange,
  label = "Product images",
  helpText = `Up to ${MAX_PRODUCT_IMAGES} images. First image is the main thumbnail (cart, cards). JPEG, PNG, WebP, GIF, or SVG — saved under public/products.`,
}: Props) {
  const list = Array.isArray(images) ? images : [];
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (list.length >= MAX_PRODUCT_IMAGES) {
      setErr(`Maximum ${MAX_PRODUCT_IMAGES} images.`);
      return;
    }
    setErr(null);
    setUploading(true);
    try {
      const { url } = await adminUploadImage(file, "products");
      onChange([...list, url]);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(i: number) {
    onChange(list.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {helpText ? <p className="mt-1 text-xs text-zinc-500">{helpText}</p> : null}
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={(e) => void onFile(e)}
          disabled={uploading || list.length >= MAX_PRODUCT_IMAGES}
          className="block w-full max-w-md text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 disabled:opacity-50"
        />
        {uploading ? <span className="text-sm text-zinc-500">Uploading…</span> : null}
      </div>
      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
      {list.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {list.map((url, i) => (
            <li
              key={`${i}-${url.slice(0, 48)}`}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-white">
                {isRemote(url) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={url.endsWith(".svg")}
                  />
                )}
              </div>
              <p className="min-w-0 flex-1 break-all text-xs text-zinc-600">{url}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="rounded border border-zinc-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={i === list.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded border border-zinc-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
              {i === 0 ? (
                <span className="w-full text-xs font-medium text-zinc-500">Main image (thumbnail)</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-zinc-500">No images yet — optional; storefront uses a default placeholder.</p>
      )}
    </div>
  );
}
