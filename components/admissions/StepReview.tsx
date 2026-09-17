'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';

function fileLabel(value: unknown): string {
  if (value instanceof FileList) {
    if (value.length === 0) return '—';
    return Array.from(value).map((f) => f.name).join(', ');
  }
  return '—';
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2.5 text-sm last:border-b-0">
      <span className="text-mist">{label}</span>
      <span className="text-right font-medium text-ink">{value || '—'}</span>
    </div>
  );
}

export default function StepReview({ onEditStep }: { onEditStep: (step: number) => void }) {
  const { getValues } = useFormContext<AdmissionFormValues>();
  const v = getValues();

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Review Your Application</h2>
      <p className="mb-6 text-sm text-mist">
        Please check everything below carefully before submitting.
      </p>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-base text-canopy">Learner Details</h3>
          <button
            type="button"
            onClick={() => onEditStep(0)}
            className="text-xs font-semibold text-loam underline"
          >
            Edit
          </button>
        </div>
        <Row label="Class" value={v.studentClass} />
        <Row label="Stream" value={v.stream} />
        <Row label="First Name" value={v.firstName} />
        <Row label="Last Name" value={v.lastName} />
        <Row label="Gender" value={v.gender} />
        <Row label="Date of Birth" value={v.dateOfBirth} />
        <Row label="Mobile Number" value={v.mobileNumber} />
        <Row label="Email" value={v.email} />
        <Row label="Student Photo" value={fileLabel(v.studentPhoto)} />
      </div>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-base text-canopy">Guardian Details</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs font-semibold text-loam underline"
          >
            Edit
          </button>
        </div>
        <Row label="If Guardian Is" value={v.guardianIs} />
        <Row label="Guardian Name" value={v.guardianName} />
        <Row label="Guardian Relation" value={v.guardianRelation} />
        <Row label="Guardian Email" value={v.guardianEmail} />
        <Row label="Guardian Phone" value={v.guardianPhone} />
        <Row label="Guardian Occupation" value={v.guardianOccupation} />
        <Row label="Guardian Address" value={v.guardianAddress} />
        <Row label="Guardian Photo" value={fileLabel(v.guardianPhoto)} />
      </div>

      <div className="rounded-sm border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-serif text-base text-canopy">Documents</h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs font-semibold text-loam underline"
          >
            Edit
          </button>
        </div>
        <Row label="Documents" value={fileLabel(v.documents)} />
      </div>
    </div>
  );
}
