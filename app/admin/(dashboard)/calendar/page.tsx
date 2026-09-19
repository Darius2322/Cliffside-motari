import { listCalendarEvents } from '@/lib/actions/admin-calendar';
import CalendarAdmin from '@/components/admin/CalendarAdmin';

export default async function AdminCalendarPage() {
  const events = await listCalendarEvents();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Academic Calendar</h1>
      <CalendarAdmin events={events} />
    </div>
  );
}
