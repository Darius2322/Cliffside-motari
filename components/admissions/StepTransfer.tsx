'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { Field, inputClass } from './FormField';

export default function StepTransfer() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const isTransferring = watch('isTransferring');

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Transfer Information</h2>
      <p className="mb-6 text-sm text-mist">Is this learner transferring from another school?</p>

      <Field label="Is this learner transferring from another school?" required error={errors.isTransferring?.message as string}>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="Yes" {...register('isTransferring')} className="h-4 w-4" /> Yes
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="No" {...register('isTransferring')} className="h-4 w-4" /> No
          </label>
        </div>
      </Field>

      {isTransferring === 'Yes' && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Previous School Name (optional)">
            <input {...register('transferSchoolName')} className={inputClass} />
          </Field>
          <Field label="Previous School Location (optional)">
            <input {...register('transferSchoolLocation')} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Reason for Transfer (optional)">
              <textarea {...register('transferReason')} rows={3} className={`${inputClass} resize-y`} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
