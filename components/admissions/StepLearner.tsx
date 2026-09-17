'use client';

import { useFormContext } from 'react-hook-form';
import type { AdmissionFormValues } from '@/lib/validation/admission';
import { classOptions } from '@/lib/validation/admission';
import { Field, inputClass } from './FormField';

export default function StepLearner() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>();

  return (
    <div>
      <h2 className="mb-1 font-serif text-xl text-canopy">Learner Details</h2>
      <p className="mb-6 text-sm text-mist">Basic details about the student applying.</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Class" required error={errors.studentClass?.message as string}>
          <select {...register('studentClass')} className={inputClass}>
            <option value="">Select</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Stream" required error={errors.stream?.message as string}>
          <input {...register('stream')} className={inputClass} placeholder="e.g. East" />
        </Field>

        <Field label="First Name" required error={errors.firstName?.message as string}>
          <input {...register('firstName')} className={inputClass} />
        </Field>

        <Field label="Last Name" error={errors.lastName?.message as string}>
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

        <Field label="Mobile Number" error={errors.mobileNumber?.message as string}>
          <input {...register('mobileNumber')} className={inputClass} />
        </Field>

        <Field label="Email" required error={errors.email?.message as string}>
          <input type="email" {...register('email')} className={inputClass} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Student Photo" error={errors.studentPhoto?.message as string}>
            <input
              type="file"
              accept="image/*"
              {...register('studentPhoto')}
              className={`${inputClass} cursor-pointer`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
