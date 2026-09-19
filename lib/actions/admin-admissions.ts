'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';


export type AdminAdmission = {
  id: string;
  reference_number: string;
  student_class: string;
  stream: string | null;
  first_name: string;
  last_name: string | null;
  gender: string;
  date_of_birth: string;
  mobile_number: string | null;
  email: string;
  guardian_is: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_email: string | null;
  guardian_phone: string | null;
  guardian_occupation: string | null;
  guardian_address: string | null;
  document_paths: string[] | null;
  status: string;
  created_at: string;
};

export async function listAdmissions(): Promise<AdminAdmission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Listing admissions failed', error);
    return [];
  }
  return data ?? [];
}

export async function getAdmission(id: string): Promise<AdminAdmission | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('admissions').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Fetching admission failed', error);
    return null;
  }
  return data;
}

export async function updateAdmissionStatus(
  id: string,
  status: string
): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('admissions').update({ status }).eq('id', id);

  if (error) {
    console.error('Updating admission status failed', error);
    return { success: false };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action: 'admission_status_changed',
      resource: 'admissions',
      resource_id: id,
      metadata: { new_status: status },
    });
  }

  revalidatePath('/admin/admissions');
  revalidatePath(`/admin/admissions/${id}`);
  return { success: true };
}
