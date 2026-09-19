import type { Metadata } from 'next';
import { site } from '@/lib/content';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-serif text-3xl font-semibold text-canopy">Privacy Policy</h1>
        <div className="space-y-6 text-mist">
          <p>
            Cliffside Motari Academy collects information submitted through this
            website — including admissions applications, contact messages,
            complaints, and reviews — solely to operate and improve our services to
            current and prospective learners and their families.
          </p>
          <p>
            <strong className="text-canopy">Information we collect:</strong> names,
            contact details, dates of birth, guardian information, and any documents
            or photos you choose to upload as part of an application, complaint, or
            review.
          </p>
          <p>
            <strong className="text-canopy">How we use it:</strong> to process
            admissions applications, respond to enquiries and complaints, moderate
            and publish reviews, and communicate with applicants and guardians about
            their submissions.
          </p>
          <p>
            <strong className="text-canopy">Storage &amp; security:</strong>
            information is stored in a secured database with access restricted to
            authorized school administrators. Sensitive documents (photos, uploaded
            files) are stored in private storage, never publicly accessible.
          </p>
          <p>
            <strong className="text-canopy">Access:</strong> only authorized CMA
            administrators can access submitted personal information. We do not sell
            or share your information with third parties.
          </p>
          <p>
            <strong className="text-canopy">Your rights:</strong> you may contact us
            at any time to ask what information we hold about you or to request its
            correction or deletion.
          </p>
          <p>
            <strong className="text-canopy">Contact:</strong> {site.email} or{' '}
            {site.phone}.
          </p>
        </div>
      </div>
    </section>
  );
}
