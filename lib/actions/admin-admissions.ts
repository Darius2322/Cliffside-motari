'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AdminGuardian = {
  guardian_order: number;
  full_name: string;
  relationship: string;
  primary_phone: string;
  secondary_phone: string | null;
  email: string | null;
  address: string | null;
};

export type AdminAdmission = {
  id: string;
  reference_number: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  gender: string;
  date_of_birth: string;
  previous_school: string | null;
  student_class: string;
  stream: string | null;
  student_photo_path: string | null;
  is_transferring: boolean;
  transfer_school_name: string | null;
  transfer_school_location: string | null;
  transfer_reason: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  has_disability: boolean;
  disability_details: string | null;
  other_medical_notes: string | null;
  document_paths: string[] | null;
  status: string;
  admission_number: string | null;
  report_purpose: string | null;
  report_date: string | null;
  admission_requirements: string | null;
  created_at: string;
  admission_guardians: AdminGuardian[];
};

export async function listAdmissions(): Promise<AdminAdmission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admissions')
    .select('*, admission_guardians(*)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Listing admissions failed', error);
    return [];
  }
  return (data ?? []) as AdminAdmission[];
}

export async function getAdmission(id: string): Promise<AdminAdmission | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admissions')
    .select('*, admission_guardians(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Fetching admission failed', error);
    return null;
  }
  return data as AdminAdmission | null;
}

export async function updateAdmissionStatus(id: string, status: string): Promise<{ success: boolean }> {
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
