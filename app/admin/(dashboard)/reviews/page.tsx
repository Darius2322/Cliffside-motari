import { listReviews } from '@/lib/actions/admin-reviews';
import ReviewCard from '@/components/admin/ReviewCard';

export default async function AdminReviewsPage() {
  const reviews = await listReviews();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Reviews</h1>

      {reviews.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No reviews submitted yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
