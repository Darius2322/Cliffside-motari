'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVacancy, updateVacancy, deleteVacancy, type AdminVacancy, type VacancyInput } from '@/lib/actions/admin-vacancies';
import { vacancyStatuses, applicationModes } from '@/lib/constants';

export default function VacancyForm({ vacancy }: { vacancy?: AdminVacancy }) {
  const router = useRouter();
  const [values, setValues] = useState<VacancyInput>({
    title: vacancy?.title ?? '',
    department: vacancy?.department ?? '',
    location: vacancy?.location ?? '',
    employmentType: vacancy?.employment_type ?? '',
    description: vacancy?.description ?? '',
    responsibilities: vacancy?.responsibilities ?? '',
    requirements: vacancy?.requirements ?? '',
    closingDate: vacancy?.closing_date ?? '',
    status: vacancy?.status ?? 'Open',
    applicationMode: vacancy?.application_mode ?? 'internal',
    externalUrl: vacancy?.external_url ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof VacancyInput, value: string) => setValues((v) => ({ ...v, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = vacancy ? await updateVacancy(vacancy.id, values) : await createVacancy(values);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    router.push('/admin/vacancies');
  };

  const handleDelete = async () => {
    if (!vacancy) return;
    if (!confirm('Delete this vacancy permanently?')) return;
    setDeleting(true);
    await deleteVacancy(vacancy.id);
    router.push('/admin/vacancies');
  };

  return (
    <form onSubmit={handleSave} className="max-w-2xl grid gap-5 rounded-sm border border-border bg-surface p-7">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Title</label>
        <input value={values.title} onChange={(e) => update('title', e.target.value)} required className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Department</label>
          <input value={values.department} onChange={(e) => update('department', e.target.value)} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Location</label>
          <input value={values.location} onChange={(e) => update('location', e.target.value)} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Employment Type</label>
          <input value={values.employmentType} onChange={(e) => update('employmentType', e.target.value)} placeholder="Full-time" className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Description</label>
        <textarea rows={3} value={values.description} onChange={(e) => update('description', e.target.value)} required className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Responsibilities (optional)</label>
        <textarea rows={3} value={values.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Requirements (optional)</label>
        <textarea rows={3} value={values.requirements} onChange={(e) => update('requirements', e.target.value)} className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Closing Date</label>
          <input type="date" value={values.closingDate} onChange={(e) => update('closingDate', e.target.value)} required className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Status</label>
          <select value={values.status} onChange={(e) => update('status', e.target.value)} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm">
            {vacancyStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Application Mode</label>
          <select value={values.applicationMode} onChange={(e) => update('applicationMode', e.target.value)} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm">
            {applicationModes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {values.applicationMode === 'external' && (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">External Application URL</label>
          <input value={values.externalUrl} onChange={(e) => update('externalUrl', e.target.value)} placeholder="https://" className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        </div>
      )}

      {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <button type="submit" disabled={saving} className="rounded-sm bg-loam px-5 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60">
          {saving ? 'Saving…' : vacancy ? 'Save Changes' : 'Create Vacancy'}
        </button>
        {vacancy && (
          <button type="button" disabled={deleting} onClick={handleDelete} className="text-sm font-semibold text-red-700">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </form>
  );
}
