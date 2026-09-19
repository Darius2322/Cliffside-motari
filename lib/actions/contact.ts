'use server';

import { createServiceClient } from '@/lib/supabase/server';
import type { ContactFormValues } from '@/lib/validation/contact';

export async function submitContactMessage(
  values: ContactFormValues
): Promise<{ success: boolean }> {
  const supabase = createServiceClient();
  const { error } = await supabase.from('contact_messages').insert({
    name: values.name,
    email: values.email,
    message: values.message,
  });

  if (error) {
    console.error('Contact message insert failed', error);
    return { success: false };
  }
  return { success: true };
}
