'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { contactSchema, type ContactFormValues } from '@/lib/validation/contact';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    // TODO: wire to a server action that writes to Supabase (or sends an
    // email) once the backend exists. Kept client-only for now so the form
    // is fully functional and validated in the meantime.
    console.log('Contact form submission', values);
    await new Promise((r) => setTimeout(r, 400));
    setStatus('sent');
    reset();
  };

  if (status === 'sent') {
    return (
      <div className="max-w-lg rounded-sm border border-border bg-surface p-6 text-canopy">
        Thanks — your message has been received. We&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-lg gap-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-mist">
          Full Name
        </label>
        <input
          id="name"
          {...register('name')}
          className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
        />
        {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-mist">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
        />
        {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-mist">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-sm"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-700">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="justify-self-start rounded-sm bg-loam px-6 py-3 font-semibold text-white hover:bg-loam-dark disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
