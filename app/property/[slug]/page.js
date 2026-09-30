import PhotoGallery from "@/components/property/PhotoGallery";
import AvailabilityCalendar from "@/components/property/Availabilitycalendar";
import BookingCard from "@/components/property/Bookingcard";
import ReviewsSection from "@/components/property/Reviewssection";
import PropertyMap from "@/components/property/Propertymap";
import WeatherWidget from "@/components/property/Weatherwidget";
import { DUMMY_PROPERTY } from "@/util/data";
import { getProperty } from "@/lib/actions/property";

export default async function PropertyDetailPage({ params }) {

    const resolvedParams = await ( params ) ;

  const property = await getProperty(resolvedParams.slug);

  const createdAT = new Date(property.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <main className="min-h-screen bg-[#17110C] px-6 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Title block */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#CA6200]">
            {property.category}
          </span>
          <h1 className="text-3xl font-semibold text-[#FBDFC5] md:text-4xl">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#FBDFC5]/60">
            <span>{property.location}</span>
            <span>·</span>
            <span>★ {property.rating || 0}</span>
            <span>·</span>
            <span>{property.review_count || 0} reviews</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-8">
          <PhotoGallery images={property.images} title={property.title} />
        </div>

        {/* Main content + sticky booking card */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-10">
            {/* Overview */}
            <div className="flex flex-col gap-4 border-b border-[#FBDFC5]/10 pb-8">
              <p className="text-sm text-[#FBDFC5]/60">
                {property.guests} guests · {property.bedrooms} bedrooms ·{" "}
                {property.beds} beds · {property.baths} baths
              </p>
              <p className="text-sm leading-relaxed text-[#FBDFC5]/70">
                {property.description}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#CA6200] text-sm font-bold text-[#FBDFC5]">
                  {property.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#FBDFC5]">
                    Hosted by {property.full_name}
                  </p>
                  <p className="text-xs text-[#FBDFC5]/40">{createdAT}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b border-[#FBDFC5]/10 pb-8">
              <h2 className="text-lg font-semibold text-[#FBDFC5]">
                What this place offers
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-xl bg-[#1f1710] px-3 py-2.5 text-sm text-[#FBDFC5]/80"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div className="border-b border-[#FBDFC5]/10 pb-8">
              <WeatherWidget location={property.location} />
            </div>

            {/* Reviews */}
            <div className="border-b border-[#FBDFC5]/10 pb-8">
              <h2 className="text-lg font-semibold text-[#FBDFC5]">Reviews</h2>
              <div className="mt-4">
                <ReviewsSection
                  rating={property.rating}
                  reviewCount={property.review_count}
                />
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-lg font-semibold text-[#FBDFC5]">
                Where you'll be
              </h2>
              <div className="mt-4">
                <PropertyMap
                  location={property.location}
                  latitude={property.latitude}
                  longitude={property.longitude}
                />
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div>
            <BookingCard
              pricePerNight={property.price_per_night}
              propertyId={resolvedParams.slug}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
