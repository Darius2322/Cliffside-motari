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
import StepTransfer from './StepTransfer';
import StepMedical from './StepMedical';
import StepGuardians from './StepGuardians';
import StepDocuments from './StepDocuments';
import StepReview from './StepReview';
import StepConfirmation from './StepConfirmation';

const TOTAL_STEPS = 6; // Learner, Transfer, Medical, Guardian, Documents, Review

function toFormData(values: AdmissionFormValues): FormData {
  const fd = new FormData();

  const scalarFields: (keyof AdmissionFormValues)[] = [
    'firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender',
    'previousSchool', 'studentClass', 'stream',
    'isTransferring', 'transferSchoolName', 'transferSchoolLocation', 'transferReason',
    'allergies', 'medicalConditions', 'hasDisability', 'disabilityDetails', 'otherMedicalNotes',
  ];
  scalarFields.forEach((key) => {
    const val = values[key];
    if (val !== undefined && val !== null) fd.append(key as string, String(val));
  });

  fd.append('hasSecondGuardian', String(!!values.hasSecondGuardian));
  fd.append('guardian1', JSON.stringify(values.guardian1));
  if (values.hasSecondGuardian) {
    fd.append('guardian2', JSON.stringify(values.guardian2 ?? {}));
  }

  if (values.studentPhoto instanceof File) {
    fd.append('studentPhoto', values.studentPhoto);
  }

  const fileListFields: (keyof AdmissionFormValues)[] = ['transferDocuments', 'resultSlip', 'otherDocuments'];
  fileListFields.forEach((key) => {
    const val = values[key] as FileList | undefined;
    if (val && val.length > 0) {
      Array.from(val).forEach((file) => fd.append(key as string, file));
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
    defaultValues: { hasDisability: 'No', hasSecondGuardian: false },
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
          {currentStep === 1 && <StepTransfer />}
          {currentStep === 2 && <StepMedical />}
          {currentStep === 3 && <StepGuardians />}
          {currentStep === 4 && <StepDocuments />}
          {currentStep === 5 && <StepReview onEditStep={setCurrentStep} />}

          {submitError && (
            <p className="mt-4 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
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
