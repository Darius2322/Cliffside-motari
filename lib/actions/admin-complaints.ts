'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AdminComplaint = {
  id: string;
  reference_number: string;
  category: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  description: string;
  status: string;
  created_at: string;
};

export async function listComplaints(): Promise<AdminComplaint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Listing complaints failed', error);
    return [];
  }
  return data ?? [];
}

export async function updateComplaintStatus(id: string, status: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('complaints').update({ status }).eq('id', id);
  if (error) {
    console.error('Updating complaint status failed', error);
    return { success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action: 'complaint_status_changed',
      resource: 'complaints',
      resource_id: id,
      metadata: { new_status: status },
    });
  }

  revalidatePath('/admin/complaints');
  return { success: true };
}
