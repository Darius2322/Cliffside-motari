'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export type AdminStaffMember = {
  id: string;
  full_name: string;
  position: string;
  department: string | null;
  bio: string | null;
  photo_path: string | null;
  is_leadership: boolean;
  visible: boolean;
  publicPhotoUrl: string | null;
};

export async function listStaff(): Promise<AdminStaffMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('staff_members')
    .select('id, full_name, position, department, bio, photo_path, is_leadership, visible')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Listing staff failed', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    publicPhotoUrl: row.photo_path
      ? supabase.storage.from('staff-photos').getPublicUrl(row.photo_path).data.publicUrl
      : null,
  }));
}

export async function createStaffMember(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const fullName = formData.get('fullName') as string;
  const position = formData.get('position') as string;
  const department = formData.get('department') as string;
  const bio = formData.get('bio') as string;
  const isLeadership = formData.get('isLeadership') === 'on';
  const photo = formData.get('photo') as File | null;

  if (!fullName || !position) {
    return { success: false, error: 'Name and position are required.' };
  }

  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const supabaseService = createServiceClient();
    photoPath = `${Date.now()}-${photo.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabaseService.storage
      .from('staff-photos')
      .upload(photoPath, photo, { contentType: photo.type });
    if (uploadError) {
      console.error('Staff photo upload failed', uploadError);
      photoPath = null;
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from('staff_members').insert({
    full_name: fullName,
    position,
    department: department || null,
    bio: bio || null,
    photo_path: photoPath,
    is_leadership: isLeadership,
  });

  if (error) {
    console.error('Creating staff member failed', error);
    return { success: false, error: 'Could not add the staff member.' };
  }

  revalidatePath('/admin/staff');
  revalidatePath('/about');
  return { success: true };
}

export async function toggleStaffVisibility(id: string, visible: boolean): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('staff_members').update({ visible }).eq('id', id);
  if (error) return { success: false };
  revalidatePath('/admin/staff');
  revalidatePath('/about');
  return { success: true };
}

export async function deleteStaffMember(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('staff_members').delete().eq('id', id);
  if (error) return { success: false };
  revalidatePath('/admin/staff');
  revalidatePath('/about');
  return { success: true };
}
