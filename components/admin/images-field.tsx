"use client";

import * as React from "react";
import { X, ImagePlus } from "lucide-react";

export function ImagesField({ initial = [] }: { initial?: string[] }) {
  const [kept, setKept] = React.useState<string[]>(initial);
  const [previews, setPreviews] = React.useState<string[]>([]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <div>
      {(kept.length > 0 || previews.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-4">
          {kept.map((url) => (
            <div key={url} className="relative h-24 w-24 border border-gray-200 bg-gray-50 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setKept((k) => k.filter((u) => u !== url))}
                className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Remover"
              >
                <X className="h-3 w-3" />
              </button>
              <input type="hidden" name="existingImages" value={url} />
            </div>
          ))}
          {previews.map((url, i) => (
            <div key={i} className="relative h-24 w-24 border border-dashed border-gray-300 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5">novo</span>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-sm text-gray-600 cursor-pointer hover:border-black transition-colors">
        <ImagePlus className="h-4 w-4" />
        Escolher imagens
        <input type="file" name="images" multiple accept="image/*" onChange={onChange} className="hidden" />
      </label>
      <p className="text-[11px] text-gray-400 mt-2">Pode seleccionar várias imagens. A primeira é a imagem principal.</p>
    </div>
  );
}
