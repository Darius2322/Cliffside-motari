import Link from 'next/link';
import { Plus } from 'lucide-react';
import { listTenders } from '@/lib/actions/admin-tenders';

const statusColor: Record<string, string> = {
  Open: 'bg-canopy text-white',
  'Closing Soon': 'bg-loam text-white',
  Closed: 'bg-border text-mist',
  Awarded: 'bg-canopy text-white',
  Archived: 'bg-border text-mist',
};

export default async function AdminTendersPage() {
  const tenders = await listTenders();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-canopy">Tenders</h1>
        <Link href="/admin/tenders/new" className="flex items-center gap-1.5 rounded-sm bg-canopy px-5 py-2.5 text-sm font-semibold text-white hover:bg-canopy-dark">
          <Plus size={17} /> New Tender
        </Link>
      </div>

      {tenders.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No tenders yet — create the first one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-border bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-paper text-xs font-semibold uppercase tracking-wide text-mist">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Closes</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-b-0 hover:bg-paper">
                  <td className="px-5 py-3">
                    <Link href={`/admin/tenders/${t.id}`} className="font-medium text-canopy">{t.title}</Link>
                  </td>
                  <td className="px-5 py-3 text-mist">{t.reference_number}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3 text-mist">{new Date(t.closing_date).toLocaleDateString('en-KE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
