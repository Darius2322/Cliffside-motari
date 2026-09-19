import { notFound } from 'next/navigation';
import { getAdmission } from '@/lib/actions/admin-admissions';
import { getSignedUrl } from '@/lib/actions/storage';
import AdmissionStatusControl from '@/components/admin/AdmissionStatusControl';

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2.5 text-sm last:border-b-0">
      <span className="text-mist">{label}</span>
      <span className="text-right font-medium text-ink">{value || '—'}</span>
    </div>
  );
}

export default async function AdmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admission = await getAdmission(id);
  if (!admission) notFound();

  const documentUrls = await Promise.all(
    (admission.document_paths ?? []).map(async (path) => ({
      path,
      url: await getSignedUrl('admissions-private', path),
    }))
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wide text-loam">{admission.reference_number}</p>
          <h1 className="font-serif text-2xl font-semibold text-canopy">
            {[admission.first_name, admission.last_name].filter(Boolean).join(' ')}
          </h1>
        </div>
        <AdmissionStatusControl id={admission.id} status={admission.status} />
      </div>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <h3 className="mb-3 font-serif text-base text-canopy">Learner Details</h3>
        <Row label="Class" value={admission.student_class} />
        <Row label="Stream" value={admission.stream} />
        <Row label="Gender" value={admission.gender} />
        <Row label="Date of Birth" value={admission.date_of_birth} />
        <Row label="Mobile Number" value={admission.mobile_number} />
        <Row label="Email" value={admission.email} />
      </div>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <h3 className="mb-3 font-serif text-base text-canopy">Guardian Details</h3>
        <Row label="If Guardian Is" value={admission.guardian_is} />
        <Row label="Name" value={admission.guardian_name} />
        <Row label="Relation" value={admission.guardian_relation} />
        <Row label="Email" value={admission.guardian_email} />
        <Row label="Phone" value={admission.guardian_phone} />
        <Row label="Occupation" value={admission.guardian_occupation} />
        <Row label="Address" value={admission.guardian_address} />
      </div>

      <div className="rounded-sm border border-border bg-surface p-5">
        <h3 className="mb-3 font-serif text-base text-canopy">Documents</h3>
        {documentUrls.length === 0 ? (
          <p className="text-sm text-mist">No documents uploaded.</p>
        ) : (
          <ul className="space-y-2">
            {documentUrls.map((doc) => (
              <li key={doc.path}>
                {doc.url ? (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-canopy underline">
                    {doc.path.split('/').pop()}
                  </a>
                ) : (
                  <span className="text-sm text-mist">{doc.path} (link unavailable)</span>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs italic text-mist">
          Links are signed and expire after 10 minutes — refresh the page to
          regenerate them.
        </p>
      </div>
    </div>
  );
}
