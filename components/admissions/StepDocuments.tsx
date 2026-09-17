'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { Field, inputClass } from './FormField';

export default function StepDocuments() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Upload Documents</h2>
      <p className="mb-6 text-sm text-mist">
        To upload multiple documents, compress them into a single file first, then
        upload it.
      </p>

      <Field label="Documents" error={errors.documents?.message as string}>
        <input
          type="file"
          multiple
          {...register('documents')}
          className={`${inputClass} cursor-pointer`}
        />
      </Field>
    </div>
  );
}
