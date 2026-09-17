'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function AdmissionStatusPage() {
  const [reference, setReference] = useState('');
  const [dob, setDob] = useState('');
  const [checked, setChecked] = useState(false);

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
          <form
            className="rounded-sm border border-border bg-surface p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setChecked(true);
            }}
          >
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
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-canopy px-6 py-3 font-semibold text-white hover:bg-canopy-dark"
            >
              <Search size={18} /> Check Status
            </button>
          </form>

          {checked && (
            <div className="mt-6 rounded-sm border border-dashed border-border bg-[#EFE8D8] p-4 text-sm italic text-mist">
              Status lookup isn&apos;t connected to a backend yet — once the admissions
              database exists, this will return the real status for {reference || 'your reference number'}.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
