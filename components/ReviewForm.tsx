'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { reviewSchema, type ReviewFormValues } from '@/lib/validation/review';
import { submitReview } from '@/lib/actions/reviews';

export default function ReviewForm() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    const result = await submitReview(values);
    if (result.success) {
      setStatus('sent');
      reset();
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-sm border border-border bg-surface p-6 text-canopy">
        Thank you for your review — it will appear once approved by the school.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-sm border border-border bg-surface p-8">
      <h3 className="font-serif text-lg text-canopy">Share Your Experience</h3>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">
          Name <span className="text-loam">*</span>
        </label>
        <input {...register('name')} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">
          Relationship to CMA <span className="text-loam">*</span>
        </label>
        <input
          {...register('relationship')}
          placeholder="e.g. Parent, Student, Community member"
          className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
        />
        {errors.relationship && <p className="mt-1 text-xs text-red-700">{errors.relationship.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">
          Rating <span className="text-loam">*</span>
        </label>
        <select {...register('rating')} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'star' : 'stars'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">
          Your Review <span className="text-loam">*</span>
        </label>
        <textarea rows={4} {...register('reviewText')} className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        {errors.reviewText && <p className="mt-1 text-xs text-red-700">{errors.reviewText.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="justify-self-start rounded-sm bg-loam px-6 py-3 font-semibold text-white hover:bg-loam-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Review'}
      </button>
      <p className="text-xs italic text-mist">
        Reviews are moderated before publishing — yours won&apos;t appear immediately.
      </p>
    </form>
  );
}
