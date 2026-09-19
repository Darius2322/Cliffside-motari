'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react';
import { createCalendarEvent, deleteCalendarEvent, type AdminCalendarEvent } from '@/lib/actions/admin-calendar';
import { calendarEventTypes } from '@/lib/constants';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function CalendarAdmin({ events }: { events: AdminCalendarEvent[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await createCalendarEvent(new FormData(e.currentTarget));
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    formRef.current?.reset();
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    setDeletingId(id);
    await deleteCalendarEvent(id);
    setDeletingId(null);
    router.refresh();
  };

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="mb-10 grid gap-4 rounded-sm border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Title</label>
          <input name="title" required className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Type</label>
          <select name="eventType" required className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm">
            {calendarEventTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Start Date</label>
          <input type="date" name="startDate" required className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">End Date (optional)</label>
          <input type="date" name="endDate" className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-mist">Description (optional)</label>
          <textarea name="description" rows={2} className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        {error && <p className="sm:col-span-2 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-1.5 rounded-sm bg-loam px-5 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60 sm:col-span-2 sm:w-fit"
        >
          <Plus size={16} /> {saving ? 'Adding…' : 'Add Event'}
        </button>
      </form>

      {events.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No calendar events yet.
        </div>
      ) : (
        <div className="divide-y divide-border rounded-sm border border-border bg-surface">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-xs font-bold tracking-wide text-loam">{event.event_type.toUpperCase()}</p>
                <p className="font-serif text-base text-canopy">{event.title}</p>
                <p className="text-sm text-mist">
                  {formatDate(event.start_date)}{event.end_date && <> &ndash; {formatDate(event.end_date)}</>}
                </p>
              </div>
              <button
                onClick={() => handleDelete(event.id)}
                disabled={deletingId === event.id}
                className="text-red-700"
                aria-label="Delete event"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
