'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { updateComplaintStatus, type AdminComplaint } from '@/lib/actions/admin-complaints';
import { complaintStatuses } from '@/lib/constants';

const statusColor: Record<string, string> = {
  Received: 'bg-border text-mist',
  'Under Review': 'bg-loam text-white',
  'In Progress': 'bg-loam text-white',
  Resolved: 'bg-canopy text-white',
};

export default function ComplaintRow({ complaint }: { complaint: AdminComplaint }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(complaint.status);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    setStatus(newStatus);
    await updateComplaintStatus(complaint.id, newStatus);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-paper"
      >
        <div className="flex-1">
          <p className="text-xs font-bold tracking-wide text-loam">{complaint.reference_number}</p>
          <p className="font-medium text-canopy">{complaint.full_name} — {complaint.category}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[status]}`}>
          {status}
        </span>
        {open ? <ChevronUp size={18} className="text-mist" /> : <ChevronDown size={18} className="text-mist" />}
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="mb-3 text-sm text-mist">{complaint.description}</p>
          <p className="mb-3 text-xs text-mist">
            {complaint.email && <>Email: {complaint.email} · </>}
            {complaint.phone && <>Phone: {complaint.phone} · </>}
            Submitted {new Date(complaint.created_at).toLocaleDateString('en-KE')}
          </p>
          <label className="mb-1.5 block text-xs font-bold tracking-wide text-mist">STATUS</label>
          <select
            value={status}
            disabled={saving}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-sm border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-canopy"
          >
            {complaintStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
