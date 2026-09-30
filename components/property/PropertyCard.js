import Image from "next/image";
import Link from "next/link";

export default function PropertyCard({ property }) {
  const { id, title, location, category, price_per_night, rating, guests } =
    property;

  return (
    <article className="group overflow-hidden rounded-[1.5rem] bg-[#1f1710] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.display_image}
          alt={property.title || "Property Image"}
          priority
          fill
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#17110C]/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FBDFC5] backdrop-blur-sm">
          {category}
        </span>

        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#17110C]/70 px-2.5 py-1 text-xs font-semibold text-[#FBDFC5] backdrop-blur-sm">
          ★ {rating}
        </span>
      </div>

      <div className="flex flex-col gap-1 p-5">
        <h3 className="text-base font-semibold text-[#FBDFC5]">{title}</h3>
        <p className="text-sm text-[#FBDFC5]/60">{location}</p>
        <p className="text-sm text-[#FBDFC5]/60">
          Up to {guests} guest{guests > 1 ? "s" : ""}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm">
            <span className="font-semibold text-[#FBDFC5]">
              ${price_per_night}
            </span>
            <span className="text-[#FBDFC5]/50"> / night</span>
          </p>

          <Link
            href={`/property/${id}`}
            type="button"
            className="rounded-full bg-[#CA6200] px-4 py-2 text-xs font-bold text-[#FBDFC5] transition-opacity hover:opacity-90"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}