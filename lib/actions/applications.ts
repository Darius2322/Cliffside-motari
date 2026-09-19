'use server';

import { createServiceClient } from '@/lib/supabase/server';
import type { TenderApplicationValues, VacancyApplicationValues } from '@/lib/validation/applications';

export async function submitTenderApplication(
  tenderId: string,
  values: TenderApplicationValues
): Promise<{ success: boolean }> {
  const supabase = createServiceClient();
  const { error } = await supabase.from('tender_applications').insert({
    tender_id: tenderId,
    company_name: values.companyName,
    contact_name: values.contactName,
    email: values.email,
    phone: values.phone || null,
  });

  if (error) {
    console.error('Tender application insert failed', error);
    return { success: false };
  }
  return { success: true };
}

export async function submitVacancyApplication(
  vacancyId: string,
  values: VacancyApplicationValues
): Promise<{ success: boolean }> {
  const supabase = createServiceClient();
  const { error } = await supabase.from('vacancy_applications').insert({
    vacancy_id: vacancyId,
    full_name: values.fullName,
    email: values.email,
    phone: values.phone || null,
    cover_note: values.coverNote || null,
  });

  if (error) {
    console.error('Vacancy application insert failed', error);
    return { success: false };
  }
  return { success: true };
}
