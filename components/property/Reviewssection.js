import { DUMMY_REVIEWS } from "@/util/data";


export default function ReviewsSection({ rating, reviewCount }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-[#FBDFC5]">★ {rating}</span>
        <span className="text-sm text-[#FBDFC5]/50">
          · {reviewCount} reviews
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {DUMMY_REVIEWS.map((review) => (
          <div key={review.id} className="rounded-2xl bg-[#1f1710] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CA6200] text-sm font-bold text-[#FBDFC5]">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#FBDFC5]">
                  {review.name}
                </p>
                <p className="text-xs text-[#FBDFC5]/40">{review.date}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#FBDFC5]/70">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
