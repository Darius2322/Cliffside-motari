'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTender, updateTender, deleteTender, type AdminTender, type TenderInput } from '@/lib/actions/admin-tenders';
import { tenderStatuses, applicationModes } from '@/lib/constants';

export default function TenderForm({ tender }: { tender?: AdminTender }) {
  const router = useRouter();
  const [values, setValues] = useState<TenderInput>({
    title: tender?.title ?? '',
    description: tender?.description ?? '',
    eligibility: tender?.eligibility ?? '',
    openingDate: tender?.opening_date ?? '',
    closingDate: tender?.closing_date ?? '',
    status: tender?.status ?? 'Open',
    applicationMode: tender?.application_mode ?? 'internal',
    externalUrl: tender?.external_url ?? '',
    contactInfo: tender?.contact_info ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof TenderInput, value: string) => setValues((v) => ({ ...v, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = tender ? await updateTender(tender.id, values) : await createTender(values);
    setSaving(false);
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    router.push('/admin/tenders');
  };

  const handleDelete = async () => {
    if (!tender) return;
    if (!confirm('Delete this tender permanently?')) return;
    setDeleting(true);
    await deleteTender(tender.id);
    router.push('/admin/tenders');
  };

  return (
    <form onSubmit={handleSave} className="max-w-2xl grid gap-5 rounded-sm border border-border bg-surface p-7">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Title</label>
        <input value={values.title} onChange={(e) => update('title', e.target.value)} required className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Description</label>
        <textarea rows={4} value={values.description} onChange={(e) => update('description', e.target.value)} required className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Eligibility (optional)</label>
        <textarea rows={2} value={values.eligibility} onChange={(e) => update('eligibility', e.target.value)} className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Opening Date</label>
          <input type="date" value={values.openingDate} onChange={(e) => update('openingDate', e.target.value)} required className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Closing Date</label>
          <input type="date" value={values.closingDate} onChange={(e) => update('closingDate', e.target.value)} required className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Status</label>
          <select value={values.status} onChange={(e) => update('status', e.target.value)} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm">
            {tenderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
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

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-mist">Contact Info (optional)</label>
        <input value={values.contactInfo} onChange={(e) => update('contactInfo', e.target.value)} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
      </div>

      {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <button type="submit" disabled={saving} className="rounded-sm bg-loam px-5 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60">
          {saving ? 'Saving…' : tender ? 'Save Changes' : 'Create Tender'}
        </button>
        {tender && (
          <button type="button" disabled={deleting} onClick={handleDelete} className="text-sm font-semibold text-red-700">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </form>
  );
}
