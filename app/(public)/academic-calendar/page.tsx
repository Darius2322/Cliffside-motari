import type { Metadata } from 'next';
import { getCalendarEvents } from '@/lib/actions/calendar';

export const metadata: Metadata = { title: 'Academic Calendar' };

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function AcademicCalendarPage() {
  const events = await getCalendarEvents();

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">ACADEMIC CALENDAR</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Academic Calendar
          </h1>
          <p className="max-w-xl text-mist">
            Terms, holidays, exams and other important school dates.
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {events.length === 0 ? (
            <div className="rounded-sm border border-dashed border-border bg-[#EFE8D8] p-6 text-sm italic text-mist">
              No calendar events published yet — term dates, holidays and exam periods
              will appear here once added from the admin dashboard.
            </div>
          ) : (
            <div className="divide-y divide-border rounded-sm border border-border bg-surface">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-6 p-5">
                  <div className="w-28 shrink-0 text-sm text-mist">
                    {formatDate(event.start_date)}
                    {event.end_date && <> &ndash; {formatDate(event.end_date)}</>}
                  </div>
                  <div>
                    <span className="mb-1 block text-xs font-bold tracking-wide text-loam">
                      {event.event_type.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-base text-canopy">{event.title}</h3>
                    {event.description && <p className="mt-1 text-sm text-mist">{event.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
