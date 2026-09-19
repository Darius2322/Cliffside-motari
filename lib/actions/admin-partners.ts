'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export type AdminPartner = {
  id: string;
  name: string;
  description: string | null;
  logo_path: string | null;
  website_url: string | null;
  category: string | null;
  visible: boolean;
  publicLogoUrl: string | null;
};

export async function listPartners(): Promise<AdminPartner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('id, name, description, logo_path, website_url, category, visible')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Listing partners failed', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    publicLogoUrl: row.logo_path
      ? supabase.storage.from('gallery').getPublicUrl(row.logo_path).data.publicUrl
      : null,
  }));
}

export async function createPartner(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const websiteUrl = formData.get('websiteUrl') as string;
  const category = formData.get('category') as string;
  const logo = formData.get('logo') as File | null;

  if (!name) {
    return { success: false, error: 'Please enter a partner name.' };
  }

  let logoPath: string | null = null;
  if (logo && logo.size > 0) {
    const supabaseService = createServiceClient();
    logoPath = `partners/${Date.now()}-${logo.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabaseService.storage
      .from('gallery')
      .upload(logoPath, logo, { contentType: logo.type });
    if (uploadError) {
      console.error('Partner logo upload failed', uploadError);
      logoPath = null;
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from('partners').insert({
    name,
    description: description || null,
    website_url: websiteUrl || null,
    category: category || null,
    logo_path: logoPath,
  });

  if (error) {
    console.error('Creating partner failed', error);
    return { success: false, error: 'Could not add the partner.' };
  }

  revalidatePath('/admin/partners');
  revalidatePath('/partners');
  return { success: true };
}

export async function togglePartnerVisibility(id: string, visible: boolean): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('partners').update({ visible }).eq('id', id);
  if (error) return { success: false };
  revalidatePath('/admin/partners');
  revalidatePath('/partners');
  return { success: true };
}

export async function deletePartner(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) return { success: false };
  revalidatePath('/admin/partners');
  revalidatePath('/partners');
  return { success: true };
}
