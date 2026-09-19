'use client';

import { useRef, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { listPartners, createPartner, togglePartnerVisibility, deletePartner, type AdminPartner } from '@/lib/actions/admin-partners';

export default function AdminPartnersClient({ initialPartners }: { initialPartners: AdminPartner[] }) {
  const [partners, setPartners] = useState(initialPartners);
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => setPartners(await listPartners());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await createPartner(new FormData(e.currentTarget));
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
          <label className="mb-1.5 block text-sm font-semibold text-mist">Name</label>
          <input name="name" required className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Website URL (optional)</label>
          <input name="websiteUrl" placeholder="https://" className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Category (optional)</label>
          <input name="category" className="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">Logo (optional)</label>
          <input type="file" name="logo" accept="image/*" className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm" />
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
          <Plus size={16} /> {saving ? 'Adding…' : 'Add Partner'}
        </button>
      </form>

      {partners.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-surface p-8 text-center text-sm text-mist">
          No partners yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} onChange={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerCard({ partner, onChange }: { partner: AdminPartner; onChange: () => void }) {
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    await togglePartnerVisibility(partner.id, !partner.visible);
    setBusy(false);
    onChange();
  };

  const remove = async () => {
    if (!confirm('Delete this partner permanently?')) return;
    setBusy(true);
    await deletePartner(partner.id);
    setBusy(false);
    onChange();
  };

  return (
    <div className="rounded-sm border border-border bg-surface p-5">
      {partner.publicLogoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partner.publicLogoUrl} alt={partner.name} className="mb-3 h-16 object-contain" />
      )}
      <h3 className="font-serif text-base text-canopy">{partner.name}</h3>
      {partner.category && <p className="text-xs font-semibold text-loam">{partner.category}</p>}
      {partner.description && <p className="mt-2 text-sm text-mist">{partner.description}</p>}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <button onClick={toggle} disabled={busy} className="flex items-center gap-1.5 text-xs font-semibold text-canopy">
          {partner.visible ? <Eye size={14} /> : <EyeOff size={14} />} {partner.visible ? 'Visible' : 'Hidden'}
        </button>
        <button onClick={remove} disabled={busy} className="flex items-center gap-1 text-xs font-semibold text-red-700">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
