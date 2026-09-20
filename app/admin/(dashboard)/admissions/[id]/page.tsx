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

function initialsOf(first: string, last: string) {
  return ((first?.[0] ?? '') + (last?.[0] ?? '')).toUpperCase() || '?';
}

export default async function AdmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admission = await getAdmission(id);
  if (!admission) notFound();

  const photoUrl = admission.student_photo_path
    ? await getSignedUrl('admissions-private', admission.student_photo_path)
    : null;

  const documentUrls = await Promise.all(
    (admission.document_paths ?? []).map(async (path) => ({
      path,
      url: await getSignedUrl('admissions-private', path),
    }))
  );

  const guardians = [...(admission.admission_guardians ?? [])].sort((a, b) => a.guardian_order - b.guardian_order);

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-paper">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Student" className="h-full w-full object-cover" />
            ) : (
              <span className="font-serif text-lg font-semibold text-canopy">
                {initialsOf(admission.first_name, admission.last_name)}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold tracking-wide text-loam">{admission.reference_number}</p>
            <h1 className="font-serif text-2xl font-semibold text-canopy">
              {[admission.first_name, admission.middle_name, admission.last_name].filter(Boolean).join(' ')}
            </h1>
          </div>
        </div>
        <AdmissionStatusControl id={admission.id} status={admission.status} />
      </div>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <h3 className="mb-3 font-serif text-base text-canopy">Learner</h3>
        <Row label="Gender" value={admission.gender} />
        <Row label="Date of Birth" value={admission.date_of_birth} />
        <Row label="Previous / Current School" value={admission.previous_school} />
        <Row label="Class" value={admission.student_class} />
        <Row label="Stream" value={admission.stream} />
      </div>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <h3 className="mb-3 font-serif text-base text-canopy">Transfer</h3>
        <Row label="Transferring?" value={admission.is_transferring ? 'Yes' : 'No'} />
        {admission.is_transferring && (
          <>
            <Row label="Previous School" value={admission.transfer_school_name} />
            <Row label="Location" value={admission.transfer_school_location} />
            <Row label="Reason" value={admission.transfer_reason} />
          </>
        )}
      </div>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <h3 className="mb-3 font-serif text-base text-canopy">Medical</h3>
        <Row label="Allergies" value={admission.allergies} />
        <Row label="Medical Conditions" value={admission.medical_conditions} />
        <Row label="Disability / Additional Support" value={admission.has_disability ? 'Yes' : 'No'} />
        {admission.has_disability && <Row label="Details" value={admission.disability_details} />}
        <Row label="Other Notes" value={admission.other_medical_notes} />
      </div>

      <div className="mb-6 rounded-sm border border-border bg-surface p-5">
        <h3 className="mb-3 font-serif text-base text-canopy">Guardian{guardians.length > 1 ? 's' : ''}</h3>
        {guardians.length === 0 ? (
          <p className="text-sm text-mist">No guardian information on file.</p>
        ) : (
          guardians.map((g) => (
            <div key={g.guardian_order} className="mb-4 last:mb-0">
              <p className="mb-1 text-xs font-bold tracking-wide text-loam">GUARDIAN {g.guardian_order}</p>
              <Row label="Name" value={g.full_name} />
              <Row label="Relationship" value={g.relationship} />
              <Row label="Primary Phone" value={g.primary_phone} />
              <Row label="Second Phone" value={g.secondary_phone} />
              <Row label="Email" value={g.email} />
              <Row label="Address" value={g.address} />
            </div>
          ))
        )}
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
          Links are signed and expire after 10 minutes — refresh the page to regenerate them.
        </p>
      </div>
    </div>
  );
}
