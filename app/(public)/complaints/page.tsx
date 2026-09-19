'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';
import {
  complaintSchema,
  complaintCategories,
  type ComplaintFormValues,
} from '@/lib/validation/complaint';
import { submitComplaint } from '@/lib/actions/complaints';

export default function ComplaintsPage() {
  const [reference, setReference] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormValues>({ resolver: zodResolver(complaintSchema) });

  const onSubmit = async (values: ComplaintFormValues) => {
    setError('');
    const result = await submitComplaint(values);
    if (result.success) {
      setReference(result.referenceNumber);
      reset();
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">FEEDBACK</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Complaints &amp; Feedback
          </h1>
          <p className="max-w-xl text-mist">
            Your complaint is handled privately and only accessible to authorized
            administrators.
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-lg">
          {reference ? (
            <div className="rounded-sm border border-border bg-surface p-8 text-center">
              <h2 className="mb-2 font-serif text-xl text-canopy">Complaint Received</h2>
              <p className="mb-6 text-sm text-mist">
                Keep this reference number to follow up on your complaint.
              </p>
              <div className="mx-auto flex max-w-xs items-center justify-between rounded-sm border border-border bg-paper px-5 py-4">
                <span className="font-serif text-lg text-canopy">{reference}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(reference);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-loam"
                >
                  <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-sm border border-border bg-surface p-8">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-mist">
                  Category <span className="text-loam">*</span>
                </label>
                <select {...register('category')} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm">
                  <option value="">Select</option>
                  {complaintCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-700">{errors.category.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-mist">
                  Full Name <span className="text-loam">*</span>
                </label>
                <input {...register('fullName')} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
                {errors.fullName && <p className="mt-1 text-xs text-red-700">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-mist">Email</label>
                <input type="email" {...register('email')} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
                {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-mist">Phone</label>
                <input {...register('phone')} className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-mist">
                  Description <span className="text-loam">*</span>
                </label>
                <textarea rows={5} {...register('description')} className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm" />
                {errors.description && <p className="mt-1 text-xs text-red-700">{errors.description.message}</p>}
              </div>

              {error && <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="justify-self-start rounded-sm bg-loam px-6 py-3 font-semibold text-white hover:bg-loam-dark disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting…' : 'Submit Complaint'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
