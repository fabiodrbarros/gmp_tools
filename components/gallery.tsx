"use client";

import * as React from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = React.useState(0);
  if (images.length === 0) return null;

  return (
    <div>
      <div className="aspect-[4/3] bg-gray-50 border border-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden border transition-colors ${i === active ? "border-red-600" : "border-gray-100 hover:border-gray-300"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
