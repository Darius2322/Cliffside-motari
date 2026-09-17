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
import StepperHeader from './StepperHeader';
import StepLearner from './StepLearner';
import StepGuardian from './StepGuardian';
import StepDocuments from './StepDocuments';
import StepReview from './StepReview';
import StepConfirmation from './StepConfirmation';

const TOTAL_STEPS = 4; // Learner, Guardian, Documents, Review (Confirmation replaces the form on submit)

function generateReferenceNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `CMA-${year}-${random}`;
}

export default function AdmissionStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

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

  const onSubmit = () => {
    // TODO: replace with a server action that writes the application (and
    // uploaded files) to Supabase once the backend exists, and returns a
    // server-issued reference number instead of this client-side one.
    setReferenceNumber(generateReferenceNumber());
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
                className="flex items-center gap-1.5 rounded-sm bg-loam px-6 py-2.5 text-sm font-semibold text-white hover:bg-loam-dark"
              >
                Submit Application <Send size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
