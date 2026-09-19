'use server';

import { createClient } from '@/lib/supabase/server';

export type Tender = {
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

export async function getTenders(): Promise<Tender[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tenders')
    .select('*')
    .order('closing_date', { ascending: true });
  if (error) {
    console.error('Fetching tenders failed', error);
    return [];
  }
  return data ?? [];
}

export type Vacancy = {
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

export async function getVacancies(): Promise<Vacancy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vacancies')
    .select('*')
    .eq('status', 'Open')
    .order('closing_date', { ascending: true });
  if (error) {
    console.error('Fetching vacancies failed', error);
    return [];
  }
  return data ?? [];
}

export type Partner = {
  id: string;
  name: string;
  description: string | null;
  logo_path: string | null;
  website_url: string | null;
  category: string | null;
};

export async function getPartners(): Promise<Partner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('id, name, description, logo_path, website_url, category')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Fetching partners failed', error);
    return [];
  }
  return data ?? [];
}

export type Resource = {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  category: string | null;
};

export async function getResources(): Promise<Resource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resources')
    .select('id, title, description, file_path, category')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Fetching resources failed', error);
    return [];
  }
  return data ?? [];
}
