'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AdminCalendarEvent = {
  id: string;
  title: string;
  event_type: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
};

export async function listCalendarEvents(): Promise<AdminCalendarEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('academic_calendar_events')
    .select('id, title, event_type, start_date, end_date, description')
    .order('start_date', { ascending: true });
  if (error) {
    console.error('Listing calendar events failed', error);
    return [];
  }
  return data ?? [];
}

export async function createCalendarEvent(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error, data } = await supabase
    .from('academic_calendar_events')
    .insert({
      title: formData.get('title'),
      event_type: formData.get('eventType'),
      start_date: formData.get('startDate'),
      end_date: formData.get('endDate') || null,
      description: formData.get('description') || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Creating calendar event failed', error);
    return { success: false, error: 'Could not add the event — check required fields.' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action: 'calendar_event_created',
      resource: 'academic_calendar_events',
      resource_id: data.id,
    });
  }

  revalidatePath('/admin/calendar');
  revalidatePath('/academic-calendar');
  return { success: true };
}

export async function deleteCalendarEvent(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.from('academic_calendar_events').delete().eq('id', id);
  if (error) {
    console.error('Deleting calendar event failed', error);
    return { success: false };
  }
  revalidatePath('/admin/calendar');
  revalidatePath('/academic-calendar');
  return { success: true };
}
