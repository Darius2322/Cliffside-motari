import Link from 'next/link';
import type { Metadata } from 'next';
import AdmissionStepper from '@/components/admissions/AdmissionStepper';

export const metadata: Metadata = { title: 'Admissions' };

export default function AdmissionsPage() {
  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-xs font-bold tracking-[0.16em] text-loam">ADMISSIONS</div>
          <h1 className="mb-3 font-serif text-3xl font-semibold text-canopy md:text-4xl">
            Apply for Admission
          </h1>
          <p className="max-w-xl text-mist">
            Complete the steps below to apply. Already applied?{' '}
            <Link href="/admissions/status" className="border-b border-loam text-canopy">
              Check your application status
            </Link>
            .
          </p>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <AdmissionStepper />
        </div>
      </section>
    </>
  );
}
