'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { inputClass } from './FormField';

export default function StepDocuments() {
  const { register, watch } = useFormContext<AdmissionFormValues>();
  const isTransferring = watch('isTransferring');

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Documents</h2>
      <p className="mb-6 text-sm text-mist">
        All documents here are optional unless the school has told you
        otherwise. Accepted formats: PDF, JPG, JPEG, PNG.
      </p>

      <div className="grid gap-6">
        {isTransferring === 'Yes' && (
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-mist">
              Transfer Documents <span className="italic text-mist">(optional)</span>
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              {...register('transferDocuments')}
              className={`${inputClass} cursor-pointer`}
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">
            Result Slip <span className="italic text-mist">(optional)</span>
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            {...register('resultSlip')}
            className={`${inputClass} cursor-pointer`}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-mist">
            Other Documents <span className="italic text-mist">(optional)</span>
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            {...register('otherDocuments')}
            className={`${inputClass} cursor-pointer`}
          />
        </div>
      </div>
    </div>
  );
}
