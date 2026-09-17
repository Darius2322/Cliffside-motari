'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { guardianIsOptions } from '@/lib/validation/admission';
import { Field, inputClass } from './FormField';

export default function StepGuardian() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Guardian Details</h2>
      <p className="mb-6 text-sm text-mist">Details for the parent or guardian.</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="If Guardian Is" required error={errors.guardianIs?.message as string}>
          <select {...register('guardianIs')} className={inputClass}>
            <option value="">Select</option>
            {guardianIsOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>

        <Field label="Guardian Name" required error={errors.guardianName?.message as string}>
          <input {...register('guardianName')} className={inputClass} />
        </Field>

        <Field label="Guardian Relation" required error={errors.guardianRelation?.message as string}>
          <input {...register('guardianRelation')} className={inputClass} placeholder="e.g. Father" />
        </Field>

        <Field label="Guardian Email" error={errors.guardianEmail?.message as string}>
          <input type="email" {...register('guardianEmail')} className={inputClass} />
        </Field>

        <Field label="Guardian Phone" error={errors.guardianPhone?.message as string}>
          <input {...register('guardianPhone')} className={inputClass} />
        </Field>

        <Field label="Guardian Occupation" error={errors.guardianOccupation?.message as string}>
          <input {...register('guardianOccupation')} className={inputClass} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Guardian Address" error={errors.guardianAddress?.message as string}>
            <textarea {...register('guardianAddress')} rows={3} className={`${inputClass} resize-y`} />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Guardian Photo" error={errors.guardianPhoto?.message as string}>
            <input
              type="file"
              accept="image/*"
              {...register('guardianPhoto')}
              className={`${inputClass} cursor-pointer`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
