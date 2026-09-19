'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AdminReview = {
  id: string;
  name: string;
  relationship: string;
  rating: number;
  review_text: string;
  status: string;
  featured: boolean;
  created_at: string;
};

export async function listReviews(): Promise<AdminReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Listing reviews failed', error);
    return [];
  }
  return data ?? [];
}

async function logAudit(action: string, id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('audit_logs').insert({ admin_id: user.id, action, resource: 'reviews', resource_id: id });
}

export async function setReviewStatus(id: string, status: 'Approved' | 'Rejected' | 'Pending'): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
  if (error) return { success: false };
  await logAudit(`review_${status.toLowerCase()}`, id);
  revalidatePath('/admin/reviews');
  revalidatePath('/reviews');
  return { success: true };
}

export async function toggleReviewFeatured(id: string, featured: boolean): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('reviews').update({ featured }).eq('id', id);
  if (error) return { success: false };
  revalidatePath('/admin/reviews');
  revalidatePath('/reviews');
  return { success: true };
}

export async function deleteReview(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return { success: false };
  await logAudit('review_deleted', id);
  revalidatePath('/admin/reviews');
  revalidatePath('/reviews');
  return { success: true };
}
