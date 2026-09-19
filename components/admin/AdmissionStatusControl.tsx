'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAdmissionStatus } from '@/lib/actions/admin-admissions';
import { admissionStatuses } from '@/lib/constants';

export default function AdmissionStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newStatus: string) => {
    setSaving(true);
    setCurrent(newStatus);
    await updateAdmissionStatus(id, newStatus);
    setSaving(false);
    router.refresh();
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold tracking-wide text-mist">STATUS</label>
      <select
        value={current}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-canopy"
      >
        {admissionStatuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
