'use server';

import { createClient } from '@/lib/supabase/server';

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  featured_image_path: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
};

export async function getPublishedNews(): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_posts')
    .select('id, slug, title, excerpt, body, featured_image_path, category, author, published_at')
    .eq('status', 'Published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Fetching news failed', error);
    return [];
  }
  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_posts')
    .select('id, slug, title, excerpt, body, featured_image_path, category, author, published_at')
    .eq('slug', slug)
    .eq('status', 'Published')
    .maybeSingle();

  if (error) {
    console.error('Fetching news post failed', error);
    return null;
  }
  return data;
}
