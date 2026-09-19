'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export type AdminGalleryImage = {
  id: string;
  storage_path: string;
  alt_text: string;
  category: string | null;
  sort_order: number;
  publicUrl: string;
};

export async function listGalleryImages(): Promise<AdminGalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('gallery_images')
    .select('id, storage_path, alt_text, category, sort_order')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Listing gallery images failed', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    publicUrl: supabase.storage.from('gallery').getPublicUrl(row.storage_path).data.publicUrl,
  }));
}

export async function uploadGalleryImage(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const file = formData.get('file') as File | null;
  const altText = formData.get('altText') as string;
  const category = formData.get('category') as string;

  if (!file || file.size === 0) {
    return { success: false, error: 'Please choose an image to upload.' };
  }
  if (!altText) {
    return { success: false, error: 'Please add a short description (alt text).' };
  }

  const supabaseService = createServiceClient();
  const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  const { error: uploadError } = await supabaseService.storage
    .from('gallery')
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    console.error('Gallery upload failed', uploadError);
    return { success: false, error: 'Upload failed. Please try again.' };
  }

  const supabase = await createClient();
  const { error: insertError, data } = await supabase
    .from('gallery_images')
    .insert({
      storage_path: path,
      alt_text: altText,
      category: category || null,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Gallery image insert failed', insertError);
    return { success: false, error: 'Uploaded, but saving the record failed.' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action: 'gallery_image_uploaded',
      resource: 'gallery_images',
      resource_id: data.id,
    });
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}

export async function deleteGalleryImage(id: string, storagePath: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const supabaseService = createServiceClient();

  await supabaseService.storage.from('gallery').remove([storagePath]);

  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) {
    console.error('Deleting gallery image failed', error);
    return { success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action: 'gallery_image_deleted',
      resource: 'gallery_images',
      resource_id: id,
    });
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true };
}
