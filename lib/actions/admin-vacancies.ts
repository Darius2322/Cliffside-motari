'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AdminVacancy = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  closing_date: string;
  status: string;
  application_mode: string;
  external_url: string | null;
};

export async function listVacancies(): Promise<AdminVacancy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('vacancies').select('*').order('closing_date', { ascending: true });
  if (error) {
    console.error('Listing vacancies failed', error);
    return [];
  }
  return data ?? [];
}

export async function getVacancy(id: string): Promise<AdminVacancy | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('vacancies').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Fetching vacancy failed', error);
    return null;
  }
  return data;
}

export type VacancyInput = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  responsibilities: string;
  requirements: string;
  closingDate: string;
  status: string;
  applicationMode: string;
  externalUrl: string;
};

export async function createVacancy(input: VacancyInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('vacancies').insert({
    title: input.title,
    department: input.department || null,
    location: input.location || null,
    employment_type: input.employmentType || null,
    description: input.description,
    responsibilities: input.responsibilities || null,
    requirements: input.requirements || null,
    closing_date: input.closingDate,
    status: input.status,
    application_mode: input.applicationMode,
    external_url: input.externalUrl || null,
  });

  if (error) {
    console.error('Creating vacancy failed', error);
    return { success: false, error: 'Could not create the vacancy — check required fields.' };
  }

  revalidatePath('/admin/vacancies');
  revalidatePath('/opportunities/vacancies');
  return { success: true };
}

export async function updateVacancy(id: string, input: VacancyInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('vacancies')
    .update({
      title: input.title,
      department: input.department || null,
      location: input.location || null,
      employment_type: input.employmentType || null,
      description: input.description,
      responsibilities: input.responsibilities || null,
      requirements: input.requirements || null,
      closing_date: input.closingDate,
      status: input.status,
      application_mode: input.applicationMode,
      external_url: input.externalUrl || null,
    })
    .eq('id', id);

  if (error) {
    console.error('Updating vacancy failed', error);
    return { success: false, error: 'Could not update the vacancy.' };
  }

  revalidatePath('/admin/vacancies');
  revalidatePath('/opportunities/vacancies');
  return { success: true };
}

export async function deleteVacancy(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('vacancies').delete().eq('id', id);
  if (error) return { success: false };
  revalidatePath('/admin/vacancies');
  revalidatePath('/opportunities/vacancies');
  return { success: true };
}
