import { createClient } from '@/lib/supabase/server';

export default async function AnnouncementBar() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from('announcements')
    .select('id, message, priority')
    .eq('published', true)
    .or(`start_date.is.null,start_date.lte.${today}`)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return (
    <div
      className={`px-6 py-2.5 text-center text-sm font-medium ${
        data.priority === 'High' ? 'bg-loam text-white' : 'bg-canopy text-white'
      }`}
    >
      {data.message}
    </div>
  );
}
