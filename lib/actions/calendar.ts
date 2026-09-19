'use server';

import { createClient } from '@/lib/supabase/server';

export type CalendarEvent = {
  id: string;
  title: string;
  event_type: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
};

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('academic_calendar_events')
    .select('id, title, event_type, start_date, end_date, description')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Fetching calendar events failed', error);
    return [];
  }
  return data ?? [];
}
