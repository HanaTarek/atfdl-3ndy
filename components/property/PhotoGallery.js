"use client";

import { useState } from "react";

export default function PhotoGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main display image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] bg-[#1f1710]">
        <img
          src={images[activeIndex]}
          alt={`${title} — photo ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <span className="absolute bottom-4 right-4 rounded-full bg-[#17110C]/70 px-3 py-1 text-xs font-semibold text-[#FBDFC5] backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {/* Scrollable thumbnail strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {images.map((src, index) => (
          <button
            key={src + index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl transition-opacity ${
              index === activeIndex
                ? "ring-2 ring-[#CA6200]"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={src}
              alt={`${title} thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
