'use client';

import { useRef, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { listStaff, createStaffMember, toggleStaffVisibility, deleteStaffMember, type AdminStaffMember } from '@/lib/actions/admin-staff';

export default function AdminStaffClient({ initialStaff }: { initialStaff: AdminStaffMember[] }) {
  const [staff, setStaff] = useState(initialStaff);
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => setStaff(await listStaff());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await createStaffMember(new FormData(e.currentTarget));
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    formRef.current?.reset();
    refresh();
  };

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="mb-10 grid gap-4 rounded-sm border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Full Name</label>
          <input name="fullName" required className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Position</label>
          <input name="position" required className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Department (optional)</label>
          <input name="department" className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Photo (optional)</label>
          <input type="file" name="photo" accept="image/*" className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-mist">Bio (optional)</label>
          <textarea name="bio" rows={3} className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink sm:col-span-2">
          <input type="checkbox" name="isLeadership" className="h-4 w-4" /> This person is part of school leadership
        </label>
        {error && <p className="sm:col-span-2 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-1.5 rounded-sm bg-loam px-5 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60 sm:col-span-2 sm:w-fit"
        >
          <Plus size={16} /> {saving ? 'Adding…' : 'Add Staff Member'}
        </button>
      </form>

      {staff.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No staff added yet — the public About page shows a "pending" notice
          until real staff are added here.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <StaffCard key={s.id} member={s} onChange={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

function StaffCard({ member, onChange }: { member: AdminStaffMember; onChange: () => void }) {
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    await toggleStaffVisibility(member.id, !member.visible);
    setBusy(false);
    onChange();
  };

  const remove = async () => {
    if (!confirm('Delete this staff member permanently?')) return;
    setBusy(true);
    await deleteStaffMember(member.id);
    setBusy(false);
    onChange();
  };

  return (
    <div className="rounded-sm border border-border bg-surface p-5">
      {member.publicPhotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={member.publicPhotoUrl} alt={member.full_name} className="mb-3 h-32 w-full rounded-sm object-cover" />
      )}
      <div className="mb-1 flex items-center gap-1.5">
        <h3 className="font-serif text-base text-canopy">{member.full_name}</h3>
        {member.is_leadership && <Star size={13} className="text-loam" fill="currentColor" />}
      </div>
      <p className="text-sm text-mist">{member.position}{member.department && ` · ${member.department}`}</p>
      {member.bio && <p className="mt-2 text-sm text-mist">{member.bio}</p>}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <button onClick={toggle} disabled={busy} className="flex items-center gap-1.5 text-xs font-semibold text-canopy">
          {member.visible ? <Eye size={14} /> : <EyeOff size={14} />} {member.visible ? 'Visible' : 'Hidden'}
        </button>
        <button onClick={remove} disabled={busy} className="flex items-center gap-1 text-xs font-semibold text-red-700">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
