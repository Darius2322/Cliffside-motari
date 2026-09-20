'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { Field, inputClass } from './FormField';

export default function StepGuardians() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const hasSecondGuardian = watch('hasSecondGuardian');
  const g1Errors = errors.guardian1;

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Guardian</h2>
      <p className="mb-6 text-sm text-mist">At least one guardian is required.</p>

      <div className="mb-6 rounded-sm border border-border bg-paper p-5">
        <h3 className="mb-4 text-sm font-bold tracking-wide text-loam">GUARDIAN 1 — REQUIRED</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" required error={g1Errors?.fullName?.message as string}>
            <input {...register('guardian1.fullName')} className={inputClass} />
          </Field>
          <Field label="Relationship to Learner" required error={g1Errors?.relationship?.message as string}>
            <input {...register('guardian1.relationship')} className={inputClass} placeholder="e.g. Mother, Father, Uncle" />
          </Field>
          <Field label="Primary Phone Number" required error={g1Errors?.primaryPhone?.message as string}>
            <input {...register('guardian1.primaryPhone')} className={inputClass} />
          </Field>
          <Field label="Second Phone Number (optional)" error={g1Errors?.secondaryPhone?.message as string}>
            <input {...register('guardian1.secondaryPhone')} className={inputClass} />
          </Field>
          <Field label="Email (optional)" error={g1Errors?.email?.message as string}>
            <input type="email" {...register('guardian1.email')} className={inputClass} />
          </Field>
          <Field label="Address (optional)" error={g1Errors?.address?.message as string}>
            <input {...register('guardian1.address')} className={inputClass} />
          </Field>
        </div>
      </div>

      <label className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
        <input type="checkbox" {...register('hasSecondGuardian')} className="h-4 w-4" />
        Add a second guardian (optional)
      </label>

      {hasSecondGuardian && (
        <div className="rounded-sm border border-border bg-paper p-5">
          <h3 className="mb-4 text-sm font-bold tracking-wide text-mist">GUARDIAN 2 — OPTIONAL</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name">
              <input {...register('guardian2.fullName')} className={inputClass} />
            </Field>
            <Field label="Relationship to Learner">
              <input {...register('guardian2.relationship')} className={inputClass} />
            </Field>
            <Field label="Primary Phone Number">
              <input {...register('guardian2.primaryPhone')} className={inputClass} />
            </Field>
            <Field label="Second Phone Number (optional)">
              <input {...register('guardian2.secondaryPhone')} className={inputClass} />
            </Field>
            <Field label="Email (optional)" error={errors.guardian2?.email?.message as string}>
              <input type="email" {...register('guardian2.email')} className={inputClass} />
            </Field>
            <Field label="Address (optional)">
              <input {...register('guardian2.address')} className={inputClass} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
