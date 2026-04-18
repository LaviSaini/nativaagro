"use client";

import Image from "next/image";
import { useState } from "react";
import { adminUploadImage, type ImageUploadFolder } from "@/lib/admin-api";

type Props = {
  label?: string;
  folder: ImageUploadFolder;
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  helpText?: string;
};

export function AdminMultiImageField({
  label = "Product images",
  folder,
  images,
  onChange,
  max = 15,
  helpText,
}: Props) {
  const list = Array.isArray(images) ? images : [];
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    e.target.value = "";
    if (!files?.length) return;
    setErr(null);
    setUploading(true);
    try {
      const next = [...list];
      for (const file of Array.from(files)) {
        if (next.length >= max) break;
        const { url } = await adminUploadImage(file, folder);
        next.push(url);
      }
      onChange(next);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(i: number) {
    onChange(list.filter((_, idx) => idx !== i));
  }

  function move(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    const t = next[i];
    next[i] = next[j]!;
    next[j] = t!;
    onChange(next);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {helpText ? <p className="mt-1 text-xs text-zinc-500">{helpText}</p> : null}
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={(e) => void onFiles(e)}
          disabled={uploading || list.length >= max}
          className="block w-full max-w-md text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 disabled:opacity-50"
        />
        {uploading ? <span className="text-sm text-zinc-500">Uploading…</span> : null}
      </div>
      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">
        First image is the main photo (cards, cart). Up to {max} images.
      </p>
      {list.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {list.map((url, i) => (
            <li
              key={`${i}-${url}`}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-white">
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized={url.endsWith(".svg")}
                />
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-zinc-500">No images yet — upload one or more files.</p>
      )}
    </div>
  );
}
