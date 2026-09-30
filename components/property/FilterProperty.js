"use client"

import { CATEGORIESFilter } from "@/util/data";

export default function FilterProperty() {

 function handleCategoryClick(category) {
    // TODO: wire up filter logic
  }

  function handlePriceChange(e) {
    // TODO: wire up price filter logic
  }

  return (<>
  
          {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {CATEGORIESFilter.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className="rounded-full border border-[#FBDFC5]/20 px-4 py-2 text-sm font-semibold text-[#FBDFC5]/70 transition-colors hover:border-[#CA6200] hover:text-[#FBDFC5]"
            >
              {category}
            </button>
          ))}

          <select
            onChange={handlePriceChange}
            defaultValue=""
            className="rounded-full border border-[#FBDFC5]/20 bg-transparent px-4 py-2 text-sm font-semibold text-[#FBDFC5]/70 outline-none"
          >
            <option value="" disabled className="bg-[#17110C]">
              Price range
            </option>
            <option value="0-75" className="bg-[#17110C]">
              $0 – $75
            </option>
            <option value="75-150" className="bg-[#17110C]">
              $75 – $150
            </option>
            <option value="150+" className="bg-[#17110C]">
              $150+
            </option>
          </select>
        </div>
        </>);
}
