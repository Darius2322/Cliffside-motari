'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import type { ReviewFormValues } from '@/lib/validation/review';

export async function submitReview(values: ReviewFormValues): Promise<{ success: boolean }> {
  const supabase = createServiceClient();
  const { error } = await supabase.from('reviews').insert({
    name: values.name,
    relationship: values.relationship,
    rating: values.rating,
    review_text: values.reviewText,
    status: 'Pending',
  });

  if (error) {
    console.error('Review insert failed', error);
    return { success: false };
  }
  return { success: true };
}

export type ApprovedReview = {
  id: string;
  name: string;
  relationship: string;
  rating: number;
  review_text: string;
  created_at: string;
};

export async function getApprovedReviews(): Promise<ApprovedReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('id, name, relationship, rating, review_text, created_at')
    .eq('status', 'Approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetching reviews failed', error);
    return [];
  }
  return data ?? [];
}
