'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';

function fileLabel(value: unknown): string {
  if (value instanceof FileList) {
    if (value.length === 0) return '—';
    return Array.from(value).map((f) => f.name).join(', ');
  }
  if (value instanceof File) return value.name;
  return '—';
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2.5 text-sm last:border-b-0">
      <span className="text-mist">{label}</span>
      <span className="text-right font-medium text-ink">{value || '—'}</span>
    </div>
  );
}

function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-sm border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-base text-canopy">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs font-semibold text-loam underline">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export default function StepReview({ onEditStep }: { onEditStep: (step: number) => void }) {
  const { getValues } = useFormContext<AdmissionFormValues>();
  const v = getValues();

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Review Your Application</h2>
      <p className="mb-6 text-sm text-mist">Please check everything below carefully before submitting.</p>

      <Section title="Learner" onEdit={() => onEditStep(0)}>
        <Row label="Name" value={[v.firstName, v.middleName, v.lastName].filter(Boolean).join(' ')} />
        <Row label="Gender" value={v.gender} />
        <Row label="Date of Birth" value={v.dateOfBirth} />
        <Row label="Previous / Current School" value={v.previousSchool} />
        <Row label="Class Applying For" value={v.studentClass} />
        <Row label="Stream" value={v.stream} />
        <Row label="Student Photo" value={v.studentPhoto ? (v.studentPhoto as File).name : 'None — initials will be used'} />
      </Section>

      <Section title="Transfer" onEdit={() => onEditStep(1)}>
        <Row label="Transferring?" value={v.isTransferring} />
        {v.isTransferring === 'Yes' && (
          <>
            <Row label="Previous School" value={v.transferSchoolName} />
            <Row label="Location" value={v.transferSchoolLocation} />
            <Row label="Reason" value={v.transferReason} />
          </>
        )}
      </Section>

      <Section title="Medical" onEdit={() => onEditStep(2)}>
        <Row label="Allergies" value={v.allergies} />
        <Row label="Medical Conditions" value={v.medicalConditions} />
        <Row label="Disability / Additional Support" value={v.hasDisability} />
        {v.hasDisability === 'Yes' && <Row label="Details" value={v.disabilityDetails} />}
        <Row label="Other Notes" value={v.otherMedicalNotes} />
      </Section>

      <Section title="Guardian" onEdit={() => onEditStep(3)}>
        <p className="mb-2 text-xs font-bold tracking-wide text-loam">GUARDIAN 1</p>
        <Row label="Name" value={v.guardian1?.fullName} />
        <Row label="Relationship" value={v.guardian1?.relationship} />
        <Row label="Primary Phone" value={v.guardian1?.primaryPhone} />
        <Row label="Second Phone" value={v.guardian1?.secondaryPhone} />
        <Row label="Email" value={v.guardian1?.email} />
        <Row label="Address" value={v.guardian1?.address} />
        {v.hasSecondGuardian && (
          <>
            <p className="mb-2 mt-4 text-xs font-bold tracking-wide text-mist">GUARDIAN 2</p>
            <Row label="Name" value={v.guardian2?.fullName} />
            <Row label="Relationship" value={v.guardian2?.relationship} />
            <Row label="Primary Phone" value={v.guardian2?.primaryPhone} />
            <Row label="Email" value={v.guardian2?.email} />
          </>
        )}
      </Section>

      <Section title="Documents" onEdit={() => onEditStep(4)}>
        {v.isTransferring === 'Yes' && <Row label="Transfer Documents" value={fileLabel(v.transferDocuments)} />}
        <Row label="Result Slip" value={fileLabel(v.resultSlip)} />
        <Row label="Other Documents" value={fileLabel(v.otherDocuments)} />
      </Section>
    </div>
  );
}
