import type { Metadata } from 'next';
import { site } from '@/lib/content';

export const metadata: Metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-serif text-3xl font-semibold text-canopy">Terms of Use</h1>
        <div className="space-y-6 text-mist">
          <p>
            This website is provided by Cliffside Motari Academy for the purpose of
            sharing information about the academy and enabling admissions,
            enquiries, complaints, and reviews to be submitted online.
          </p>
          <p>
            Content on this site — including text, photography, and the CMA logo —
            belongs to Cliffside Motari Academy and may not be reproduced without
            permission.
          </p>
          <p>
            Reviews submitted through this site must be genuine and reflect the
            submitter&apos;s real experience with the academy. CMA reserves the right
            to moderate, decline, or remove any submission at its discretion.
          </p>
          <p>
            Information submitted through admissions, contact, or complaints forms is
            handled according to our{' '}
            <a href="/privacy" className="text-canopy underline">Privacy Policy</a>.
          </p>
          <p>Questions about these terms can be directed to {site.email}.</p>
        </div>
      </div>
    </section>
  );
}
