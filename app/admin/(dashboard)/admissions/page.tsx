import Link from 'next/link';
import { listAdmissions } from '@/lib/actions/admin-admissions';

const statusColor: Record<string, string> = {
  Submitted: 'bg-border text-mist',
  'Under Review': 'bg-loam text-white',
  Approved: 'bg-canopy text-white',
  Rejected: 'bg-red-100 text-red-700',
  'Additional Information Required': 'bg-loam text-white',
};

export default async function AdminAdmissionsPage() {
  const admissions = await listAdmissions();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Admissions</h1>

      {admissions.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No applications submitted yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-border bg-surface">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-paper text-xs font-semibold uppercase tracking-wide text-mist">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Learner</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Transfer</th>
                <th className="px-5 py-3">Guardian</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-b-0 hover:bg-paper">
                  <td className="px-5 py-3">
                    <Link href={`/admin/admissions/${a.id}`} className="font-medium text-canopy">
                      {a.reference_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{[a.first_name, a.last_name].filter(Boolean).join(' ')}</td>
                  <td className="px-5 py-3 text-mist">{a.student_class}</td>
                  <td className="px-5 py-3 text-mist">{a.is_transferring ? 'Yes' : 'No'}</td>
                  <td className="px-5 py-3 text-mist">{a.admission_guardians?.[0]?.full_name ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-mist">
                    {new Date(a.created_at).toLocaleDateString('en-KE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
