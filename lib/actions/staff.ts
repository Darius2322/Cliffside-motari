'use server';

import { createClient } from '@/lib/supabase/server';

export type PublicStaffMember = {
  id: string;
  full_name: string;
  position: string;
  department: string | null;
  bio: string | null;
  is_leadership: boolean;
  publicPhotoUrl: string | null;
};

export async function getVisibleStaff(): Promise<PublicStaffMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('staff_members')
    .select('id, full_name, position, department, bio, is_leadership, photo_path')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Fetching staff failed', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    full_name: row.full_name,
    position: row.position,
    department: row.department,
    bio: row.bio,
    is_leadership: row.is_leadership,
    publicPhotoUrl: row.photo_path
      ? supabase.storage.from('staff-photos').getPublicUrl(row.photo_path).data.publicUrl
      : null,
  }));
}
