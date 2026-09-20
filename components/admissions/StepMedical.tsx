'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { Field, inputClass } from './FormField';

export default function StepMedical() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const hasDisability = watch('hasDisability');

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Medical Information</h2>
      <p className="mb-6 text-sm text-mist">
        All fields here are optional and handled securely — only authorized
        school staff can view this information.
      </p>

      <div className="grid gap-5">
        <Field label="Allergies (optional)" error={errors.allergies?.message as string}>
          <textarea {...register('allergies')} rows={2} className={`${inputClass} resize-y`} />
        </Field>

        <Field label="Medical Conditions (optional)" error={errors.medicalConditions?.message as string}>
          <textarea {...register('medicalConditions')} rows={2} className={`${inputClass} resize-y`} />
        </Field>

        <Field label="Does the learner have a disability / require additional support?">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="No" {...register('hasDisability')} className="h-4 w-4" /> No
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="Yes" {...register('hasDisability')} className="h-4 w-4" /> Yes
            </label>
          </div>
        </Field>

        {hasDisability === 'Yes' && (
          <Field label="Please share relevant details (optional)" error={errors.disabilityDetails?.message as string}>
            <textarea {...register('disabilityDetails')} rows={2} className={`${inputClass} resize-y`} />
          </Field>
        )}

        <Field label="Other Medical Notes (optional)" error={errors.otherMedicalNotes?.message as string}>
          <textarea {...register('otherMedicalNotes')} rows={2} className={`${inputClass} resize-y`} />
        </Field>
      </div>
    </div>
  );
}
