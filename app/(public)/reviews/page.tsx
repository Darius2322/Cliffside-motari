import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import ReviewForm from '@/components/ReviewForm';
import { getApprovedReviews } from '@/lib/actions/reviews';

export const metadata: Metadata = { title: 'Reviews' };

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">REVIEWS</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            What Our Community Says
          </h1>
          <p className="max-w-xl text-mist">
            Genuine reviews from parents, students, and the CMA community — moderated
            before publishing.
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            {reviews.length === 0 ? (
              <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-6 text-sm italic text-mist">
                No reviews have been approved yet — be the first to share your
                experience.
              </div>
            ) : (
              <div className="grid gap-5">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-sm border border-border bg-surface p-6">
                    <div className="mb-2 flex gap-0.5 text-loam">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="mb-3 text-mist">{review.review_text}</p>
                    <p className="text-sm font-semibold text-canopy">
                      {review.name} <span className="font-normal text-mist">— {review.relationship}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
