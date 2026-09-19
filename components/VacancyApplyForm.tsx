'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vacancyApplicationSchema, type VacancyApplicationValues } from '@/lib/validation/applications';
import { submitVacancyApplication } from '@/lib/actions/applications';

export default function VacancyApplyForm({ vacancyId }: { vacancyId: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VacancyApplicationValues>({ resolver: zodResolver(vacancyApplicationSchema) });

  const onSubmit = async (values: VacancyApplicationValues) => {
    const result = await submitVacancyApplication(vacancyId, values);
    if (result.success) setSent(true);
  };

  if (sent) {
    return <p className="mt-4 text-sm font-semibold text-canopy">Application received — thank you.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-block rounded-sm bg-loam px-5 py-2 text-sm font-semibold text-white hover:bg-loam-dark"
      >
        Apply Now
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 rounded-sm border border-border bg-paper p-4">
      <div>
        <input
          {...register('fullName')}
          placeholder="Full name"
          className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm"
        />
        {errors.fullName && <p className="mt-1 text-xs text-red-700">{errors.fullName.message}</p>}
      </div>
      <div>
        <input
          type="email"
          {...register('email')}
          placeholder="Email"
          className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm"
        />
        {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
      </div>
      <input
        {...register('phone')}
        placeholder="Phone (optional)"
        className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm"
      />
      <textarea
        {...register('coverNote')}
        rows={3}
        placeholder="Brief cover note (optional)"
        className="w-full resize-y rounded-sm border border-border bg-surface px-3 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="justify-self-start rounded-sm bg-loam px-5 py-2 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Application'}
      </button>
      <p className="text-xs italic text-mist">
        CV upload isn&apos;t wired up yet — mention in your cover note that
        you&apos;ll follow up with your CV by email if needed.
      </p>
    </form>
  );
}
