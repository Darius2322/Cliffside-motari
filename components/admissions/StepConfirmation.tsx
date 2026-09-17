'use client';

import { useState } from 'react';
import { CheckCircle2, Copy, Printer } from 'lucide-react';

export default function StepConfirmation({
  referenceNumber,
  learnerName,
}: {
  referenceNumber: string;
  learnerName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — the reference is still visible to copy manually
    }
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-canopy/10 text-canopy">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="mb-2 font-serif text-2xl text-canopy">Application Received</h2>
      <p className="mx-auto mb-8 max-w-md text-mist">
        Thank you{learnerName ? `, application for ${learnerName}` : ''} has been
        submitted. Keep your reference number safe — you&apos;ll need it to check your
        application status.
      </p>

      <div className="mx-auto mb-8 flex max-w-sm items-center justify-between rounded-sm border border-border bg-paper px-5 py-4">
        <span className="font-serif text-lg text-canopy">{referenceNumber}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm font-semibold text-loam"
        >
          <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mb-8 mx-auto max-w-md rounded-sm border border-dashed border-border bg-[#EFE8D8] p-4 text-left text-sm italic text-mist">
        This confirmation is generated in your browser for now — once the admissions
        backend is connected, this reference will also be recorded server-side so you
        can check status at any time and the school can review your submission.
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-sm border border-canopy px-6 py-3 font-semibold text-canopy hover:bg-canopy hover:text-white"
        >
          <Printer size={18} /> Print / Save Confirmation
        </button>
        <a
          href="/"
          className="flex items-center rounded-sm bg-loam px-6 py-3 font-semibold text-white hover:bg-loam-dark"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
