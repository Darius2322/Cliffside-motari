'use server';

import { createServiceClient } from '@/lib/supabase/server';

// Only ever call this from pages already behind the /admin middleware gate
// — it does not itself re-check the caller's role, since generating a
// signed URL for a private bucket is only meaningful for an authenticated
// admin viewing application/complaint attachments.
export async function getSignedUrl(bucket: string, path: string): Promise<string | null> {
  if (!path) return null;
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
  if (error) {
    console.error('Signed URL generation failed', error);
    return null;
  }
  return data.signedUrl;
}
