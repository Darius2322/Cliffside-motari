import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Uses the anon key + the visitor's cookies — respects RLS as that visitor
// (anonymous, or an authenticated admin). Never use this for privileged
// writes; use createServiceClient for those.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — safe to ignore if you
            // have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

// Service-role client: bypasses RLS entirely. Server-only — this file must
// never be imported into a Client Component, and SUPABASE_SERVICE_ROLE_KEY
// must never be prefixed with NEXT_PUBLIC_. Use for: generating admission/
// complaint/tender reference numbers, status-check lookups, and any admin
// write that needs to bypass a "public can only insert" policy.
import { createClient as createRawClient } from '@supabase/supabase-js';

export function createServiceClient() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
