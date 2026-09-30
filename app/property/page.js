import FilterProperty from "@/components/property/FilterProperty";
import PropertyGrid from "@/components/property/Propertygrid";
import SearchProperty from "@/components/property/SearchProperty";
import { getProperties } from "@/lib/actions/property";
import { Suspense } from "react";


async function Properties() {
  

  const properties = await getProperties();

  console.log("propertieeessss ::: " , properties);

  return <PropertyGrid properties={properties} />;

}

export default function PropertiesPage() {


  return (
    <main className="min-h-screen bg-[#17110C] px-6 pb-20 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#CA6200]">
            Handpicked stays
          </span>
          <h1 className="text-4xl font-semibold text-[#FBDFC5] md:text-5xl">
            Explore Unique Stays
          </h1>
          <p className="max-w-xl text-sm text-[#FBDFC5]/60 md:text-base">
            Farms, campsites, and mountain retreats — find a place that's part
            of the adventure, not just where you sleep.
          </p>
        </div>

        <SearchProperty/>

        <FilterProperty/>

        {/* Properties grid */}
        <Suspense
          fallback={<p >Fetching meals...</p>}
        >
          <Properties />
        </Suspense>
      </div>
    </main>
  );
}
