'use server';

import { createClient } from '@/lib/supabase/server';
import { galleryImages as fallbackImages } from '@/lib/content';

export type GalleryImage = { src: string; alt: string; category?: string | null };

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('gallery_images')
    .select('storage_path, alt_text, category')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Fetching gallery images failed', error);
    return fallbackImages;
  }

  if (!data || data.length === 0) {
    // Nothing uploaded via the admin yet — show the real launch photos
    // instead of an empty gallery.
    return fallbackImages;
  }

  return data.map((row) => ({
    src: supabase.storage.from('gallery').getPublicUrl(row.storage_path).data.publicUrl,
    alt: row.alt_text,
    category: row.category,
  }));
}
