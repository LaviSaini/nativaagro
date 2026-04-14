"use client";

import Image from "next/image";
import { useState } from "react";
import { adminUploadImage, type ImageUploadFolder } from "@/lib/admin-api";

type Props = {
  label: string;
  folder: ImageUploadFolder;
  value: string;
  onChange: (publicUrl: string) => void;
  helpText?: string;
};

export function AdminImageField({ label, folder, value, onChange, helpText }: Props) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const { url } = await adminUploadImage(file, folder);
      onChange(url);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setUploading(false);
    }
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
          disabled={uploading}
          className="block w-full max-w-md text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800 disabled:opacity-50"
        />
        {uploading ? (
          <span className="text-sm text-zinc-500">Uploading…</span>
        ) : null}
      </div>
      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
      {value ? (
        <div className="mt-3 flex items-start gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
            <Image src={value} alt="Preview" fill className="object-cover" sizes="96px" unoptimized={value.endsWith(".svg")} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="break-all text-xs text-zinc-600">{value}</p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Remove image
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
