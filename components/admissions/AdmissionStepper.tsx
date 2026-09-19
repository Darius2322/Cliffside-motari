'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import {
  admissionSchema,
  stepFields,
  type AdmissionFormValues,
} from '@/lib/validation/admission';
import { submitAdmission } from '@/lib/actions/admissions';
import StepperHeader from './StepperHeader';
import StepLearner from './StepLearner';
import StepGuardian from './StepGuardian';
import StepDocuments from './StepDocuments';
import StepReview from './StepReview';
import StepConfirmation from './StepConfirmation';

const TOTAL_STEPS = 4; // Learner, Guardian, Documents, Review (Confirmation replaces the form on submit)

function toFormData(values: AdmissionFormValues): FormData {
  const fd = new FormData();
  const fileFields = new Set(['studentPhoto', 'guardianPhoto', 'documents']);

  Object.entries(values).forEach(([key, value]) => {
    if (fileFields.has(key)) {
      const fileList = value as FileList | undefined;
      if (fileList && fileList.length > 0) {
        Array.from(fileList).forEach((file) => fd.append(key, file));
      }
      return;
    }
    if (value !== undefined && value !== null) {
      fd.append(key, String(value));
    }
  });

  return fd;
}

export default function AdmissionStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    mode: 'onBlur',
  });

  const { trigger, handleSubmit, getValues } = methods;

  const goNext = async () => {
    const fields = stepFields[currentStep];
    const valid = fields.length === 0 ? true : await trigger(fields as any);
    if (valid) setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: AdmissionFormValues) => {
    setSubmitting(true);
    setSubmitError('');
    const result = await submitAdmission(toFormData(values));
    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }
    setReferenceNumber(result.referenceNumber);
    setSubmitted(true);
  };

  if (submitted) {
    const values = getValues();
    const learnerName = [values.firstName, values.lastName].filter(Boolean).join(' ');
    return (
      <div className="rounded-sm border border-border bg-surface p-8 md:p-12">
        <StepConfirmation referenceNumber={referenceNumber} learnerName={learnerName} />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="rounded-sm border border-border bg-surface p-6 md:p-10">
        <StepperHeader currentStep={currentStep} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && <StepLearner />}
          {currentStep === 1 && <StepGuardian />}
          {currentStep === 2 && <StepDocuments />}
          {currentStep === 3 && <StepReview onEditStep={setCurrentStep} />}

          {submitError && (
            <p className="mt-4 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

          <div className="mt-9 flex items-center justify-between border-t border-border pt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 rounded-sm px-5 py-2.5 text-sm font-semibold text-canopy disabled:opacity-0"
            >
              <ChevronLeft size={18} /> Back
            </button>

            {currentStep < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 rounded-sm bg-canopy px-6 py-2.5 text-sm font-semibold text-white hover:bg-canopy-dark"
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-sm bg-loam px-6 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Application'} <Send size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
