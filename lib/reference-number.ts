import { createServiceClient } from '@/lib/supabase/server';

/**
 * Generates a reference number like "CMA-2026-04821" and retries on the
 * (very unlikely) chance of a collision with an existing unique value in
 * the given table/column.
 */
export async function generateUniqueReference(
  table: string,
  prefix: string,
  column = 'reference_number'
): Promise<string> {
  const supabase = createServiceClient();
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 5; attempt++) {
    const random = Math.floor(10000 + Math.random() * 90000);
    const candidate = `${prefix}-${year}-${random}`;

    const { data } = await supabase
      .from(table)
      .select(column)
      .eq(column, candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  // Fallback: timestamp-based, effectively guaranteed unique.
  return `${prefix}-${year}-${Date.now().toString().slice(-6)}`;
}
