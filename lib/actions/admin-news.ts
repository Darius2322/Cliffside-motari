'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AdminNewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string | null;
  author: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
};

export async function listAllNews(): Promise<AdminNewsPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_posts')
    .select('id, slug, title, excerpt, body, category, author, status, published_at, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Listing news failed', error);
    return [];
  }
  return data ?? [];
}

export async function getNewsById(id: string): Promise<AdminNewsPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_posts')
    .select('id, slug, title, excerpt, body, category, author, status, published_at, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Fetching news by id failed', error);
    return null;
  }
  return data;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function logAudit(action: string, resourceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('audit_logs').insert({
    admin_id: user.id,
    action,
    resource: 'news_posts',
    resource_id: resourceId,
  });
}

export type NewsInput = {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  status: 'Draft' | 'Published';
};

export async function createNews(input: NewsInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const slug = `${slugify(input.title)}-${Date.now().toString().slice(-5)}`;

  const { data, error } = await supabase
    .from('news_posts')
    .insert({
      slug,
      title: input.title,
      excerpt: input.excerpt || null,
      body: input.body,
      category: input.category || null,
      author: input.author || null,
      status: input.status,
      published_at: input.status === 'Published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Create news failed', error);
    return { success: false, error: 'Could not create the post — check required fields.' };
  }

  await logAudit('news_created', data.id);
  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}

export async function updateNews(id: string, input: NewsInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: existing } = await supabase.from('news_posts').select('status, published_at').eq('id', id).single();

  const { error } = await supabase
    .from('news_posts')
    .update({
      title: input.title,
      excerpt: input.excerpt || null,
      body: input.body,
      category: input.category || null,
      author: input.author || null,
      status: input.status,
      published_at:
        input.status === 'Published' ? existing?.published_at ?? new Date().toISOString() : existing?.published_at,
    })
    .eq('id', id);

  if (error) {
    console.error('Update news failed', error);
    return { success: false, error: 'Could not update the post.' };
  }

  await logAudit('news_updated', id);
  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}

export async function deleteNews(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('news_posts').delete().eq('id', id);
  if (error) {
    console.error('Delete news failed', error);
    return { success: false };
  }
  await logAudit('news_deleted', id);
  revalidatePath('/news');
  revalidatePath('/admin/news');
  return { success: true };
}
