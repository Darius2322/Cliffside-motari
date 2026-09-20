'use client';

import { Controller, useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { classOptions } from '@/lib/validation/admission';
import { Field, inputClass } from './FormField';
import StudentPhotoField from './StudentPhotoField';

export default function StepLearner() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  const firstName = watch('firstName') || '';
  const lastName = watch('lastName') || '';

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Learner</h2>
      <p className="mb-6 text-sm text-mist">Basic details about the student applying.</p>

      <div className="mb-6">
        <Controller
          name="studentPhoto"
          control={control}
          render={({ field }) => (
            <StudentPhotoField
              value={field.value ?? null}
              onChange={field.onChange}
              firstName={firstName}
              lastName={lastName}
            />
          )}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" required error={errors.firstName?.message as string}>
          <input {...register('firstName')} className={inputClass} />
        </Field>

        <Field label="Middle Name" error={errors.middleName?.message as string}>
          <input {...register('middleName')} className={inputClass} />
        </Field>

        <Field label="Last Name" required error={errors.lastName?.message as string}>
          <input {...register('lastName')} className={inputClass} />
        </Field>

        <Field label="Gender" required error={errors.gender?.message as string}>
          <select {...register('gender')} className={inputClass}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </Field>

        <Field label="Date of Birth" required error={errors.dateOfBirth?.message as string}>
          <input type="date" {...register('dateOfBirth')} className={inputClass} />
        </Field>

        <Field label="Previous / Current School" error={errors.previousSchool?.message as string}>
          <input {...register('previousSchool')} className={inputClass} placeholder="If applicable" />
        </Field>

        <Field label="Class Applying For" required error={errors.studentClass?.message as string}>
          <select {...register('studentClass')} className={inputClass}>
            <option value="">Select</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Stream" error={errors.stream?.message as string}>
          <input {...register('stream')} className={inputClass} placeholder="Optional — leave blank if unknown" />
        </Field>
      </div>
    </div>
  );
}
