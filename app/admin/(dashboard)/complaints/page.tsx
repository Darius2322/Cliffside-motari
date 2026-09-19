import { listComplaints } from '@/lib/actions/admin-complaints';
import ComplaintRow from '@/components/admin/ComplaintRow';

export default async function AdminComplaintsPage() {
  const complaints = await listComplaints();

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl font-semibold text-canopy">Complaints</h1>

      {complaints.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No complaints submitted yet.
        </div>
      ) : (
        <div className="rounded-sm border border-border bg-surface">
          {complaints.map((c) => (
            <ComplaintRow key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
