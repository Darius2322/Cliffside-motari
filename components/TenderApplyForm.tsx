'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenderApplicationSchema, type TenderApplicationValues } from '@/lib/validation/applications';
import { submitTenderApplication } from '@/lib/actions/applications';

export default function TenderApplyForm({ tenderId }: { tenderId: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TenderApplicationValues>({ resolver: zodResolver(tenderApplicationSchema) });

  const onSubmit = async (values: TenderApplicationValues) => {
    const result = await submitTenderApplication(tenderId, values);
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
        className="mt-4 inline-block rounded-sm border border-canopy px-5 py-2 text-sm font-semibold text-canopy hover:bg-canopy hover:text-white"
      >
        Apply / Submit Bid
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 rounded-sm border border-border bg-paper p-4">
      <div>
        <input
          {...register('companyName')}
          placeholder="Company name"
          className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm"
        />
        {errors.companyName && <p className="mt-1 text-xs text-red-700">{errors.companyName.message}</p>}
      </div>
      <div>
        <input
          {...register('contactName')}
          placeholder="Contact name"
          className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm"
        />
        {errors.contactName && <p className="mt-1 text-xs text-red-700">{errors.contactName.message}</p>}
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
      <button
        type="submit"
        disabled={isSubmitting}
        className="justify-self-start rounded-sm bg-loam px-5 py-2 text-sm font-semibold text-white hover:bg-loam-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
      <p className="text-xs italic text-mist">
        Document upload isn&apos;t wired up yet — for now, include a reference to
        your submitted documents in a follow-up email if needed.
      </p>
    </form>
  );
}
