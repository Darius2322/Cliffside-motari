'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { setReviewStatus, toggleReviewFeatured, deleteReview, type AdminReview } from '@/lib/actions/admin-reviews';

const statusColor: Record<string, string> = {
  Pending: 'bg-border text-mist',
  Approved: 'bg-canopy text-white',
  Rejected: 'bg-red-100 text-red-700',
};

export default function ReviewCard({ review }: { review: AdminReview }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const act = async (fn: () => Promise<{ success: boolean }>) => {
    setBusy(true);
    await fn();
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="rounded-sm border border-border bg-surface p-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-0.5 text-loam">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} fill={i < review.rating ? 'currentColor' : 'none'} />
          ))}
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[review.status]}`}>
          {review.status}
        </span>
      </div>
      <p className="mb-3 text-sm text-mist">{review.review_text}</p>
      <p className="mb-4 text-sm font-semibold text-canopy">
        {review.name} <span className="font-normal text-mist">— {review.relationship}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {review.status !== 'Approved' && (
          <button
            disabled={busy}
            onClick={() => act(() => setReviewStatus(review.id, 'Approved'))}
            className="flex items-center gap-1 rounded-sm bg-canopy px-3 py-1.5 text-xs font-semibold text-white"
          >
            <Check size={14} /> Approve
          </button>
        )}
        {review.status !== 'Rejected' && (
          <button
            disabled={busy}
            onClick={() => act(() => setReviewStatus(review.id, 'Rejected'))}
            className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-mist"
          >
            <X size={14} /> Reject
          </button>
        )}
        {review.status === 'Approved' && (
          <button
            disabled={busy}
            onClick={() => act(() => toggleReviewFeatured(review.id, !review.featured))}
            className={`rounded-sm px-3 py-1.5 text-xs font-semibold ${
              review.featured ? 'bg-loam text-white' : 'border border-border text-mist'
            }`}
          >
            {review.featured ? 'Featured' : 'Feature'}
          </button>
        )}
        <button
          disabled={busy}
          onClick={() => {
            if (confirm('Delete this review permanently?')) act(() => deleteReview(review.id));
          }}
          className="ml-auto flex items-center gap-1 text-xs font-semibold text-red-700"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
