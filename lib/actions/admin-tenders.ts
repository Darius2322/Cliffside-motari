'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateUniqueReference } from '@/lib/reference-number';

export type AdminTender = {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  eligibility: string | null;
  opening_date: string;
  closing_date: string;
  status: string;
  application_mode: string;
  external_url: string | null;
  contact_info: string | null;
};

export async function listTenders(): Promise<AdminTender[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('tenders').select('*').order('closing_date', { ascending: true });
  if (error) {
    console.error('Listing tenders failed', error);
    return [];
  }
  return data ?? [];
}

export async function getTender(id: string): Promise<AdminTender | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('tenders').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('Fetching tender failed', error);
    return null;
  }
  return data;
}

export type TenderInput = {
  title: string;
  description: string;
  eligibility: string;
  openingDate: string;
  closingDate: string;
  status: string;
  applicationMode: string;
  externalUrl: string;
  contactInfo: string;
};

export async function createTender(input: TenderInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const referenceNumber = await generateUniqueReference('tenders', 'CMA-TND');

  const { error } = await supabase.from('tenders').insert({
    reference_number: referenceNumber,
    title: input.title,
    description: input.description,
    eligibility: input.eligibility || null,
    opening_date: input.openingDate,
    closing_date: input.closingDate,
    status: input.status,
    application_mode: input.applicationMode,
    external_url: input.externalUrl || null,
    contact_info: input.contactInfo || null,
  });

  if (error) {
    console.error('Creating tender failed', error);
    return { success: false, error: 'Could not create the tender — check required fields.' };
  }

  revalidatePath('/admin/tenders');
  revalidatePath('/opportunities/tenders');
  return { success: true };
}

export async function updateTender(id: string, input: TenderInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tenders')
    .update({
      title: input.title,
      description: input.description,
      eligibility: input.eligibility || null,
      opening_date: input.openingDate,
      closing_date: input.closingDate,
      status: input.status,
      application_mode: input.applicationMode,
      external_url: input.externalUrl || null,
      contact_info: input.contactInfo || null,
    })
    .eq('id', id);

  if (error) {
    console.error('Updating tender failed', error);
    return { success: false, error: 'Could not update the tender.' };
  }

  revalidatePath('/admin/tenders');
  revalidatePath('/opportunities/tenders');
  return { success: true };
}

export async function deleteTender(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('tenders').delete().eq('id', id);
  if (error) return { success: false };
  revalidatePath('/admin/tenders');
  revalidatePath('/opportunities/tenders');
  return { success: true };
}
