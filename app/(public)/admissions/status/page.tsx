'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { checkAdmissionStatus, type AdmissionStatusResult } from '@/lib/actions/admissions';

export default function AdmissionStatusPage() {
  const [reference, setReference] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<AdmissionStatusResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await checkAdmissionStatus(reference.trim(), dob);
    setResult(res);
    setLoading(false);
  };

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">ADMISSIONS</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Check Your Application Status
          </h1>
          <p className="max-w-xl text-mist">
            Enter your reference number and the learner&apos;s date of birth to check
            your application status.
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-md">
          <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-surface p-8">
            <label className="mb-1.5 block text-sm font-semibold text-mist">
              Reference Number <span className="text-loam">*</span>
            </label>
            <input
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. CMA-2026-04821"
              className="mb-5 w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
            />

            <label className="mb-1.5 block text-sm font-semibold text-mist">
              Date of Birth <span className="text-loam">*</span>
            </label>
            <input
              required
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mb-6 w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-canopy px-6 py-3 font-semibold text-white hover:bg-canopy-dark disabled:opacity-60"
            >
              <Search size={18} /> {loading ? 'Checking…' : 'Check Status'}
            </button>
          </form>

          {result && result.found && (
            <div className="mt-6 rounded-sm border border-border bg-surface p-5">
              <p className="text-xs font-bold tracking-wide text-mist">STATUS</p>
              <p className="font-serif text-xl text-canopy">{result.status}</p>
            </div>
          )}
          {result && !result.found && (
            <div className="mt-6 rounded-sm border border-dashed border-border bg-[#EFE8D8] p-4 text-sm italic text-mist">
              No application found matching that reference number and date of birth.
              Double-check both and try again.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
