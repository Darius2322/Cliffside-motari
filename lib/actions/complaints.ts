'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { generateUniqueReference } from '@/lib/reference-number';
import type { ComplaintFormValues } from '@/lib/validation/complaint';

export type SubmitComplaintResult =
  | { success: true; referenceNumber: string }
  | { success: false; error: string };

export async function submitComplaint(
  values: ComplaintFormValues
): Promise<SubmitComplaintResult> {
  const supabase = createServiceClient();
  const referenceNumber = await generateUniqueReference('complaints', 'CMA-CMP');

  const { error } = await supabase.from('complaints').insert({
    reference_number: referenceNumber,
    category: values.category,
    full_name: values.fullName,
    email: values.email || null,
    phone: values.phone || null,
    description: values.description,
  });

  if (error) {
    console.error('Complaint insert failed', error);
    return { success: false, error: 'Something went wrong submitting your complaint. Please try again.' };
  }
  return { success: true, referenceNumber };
}
