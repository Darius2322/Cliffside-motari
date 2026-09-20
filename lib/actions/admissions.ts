'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { generateUniqueReference } from '@/lib/reference-number';

export type SubmitAdmissionResult =
  | { success: true; referenceNumber: string }
  | { success: false; error: string };

async function uploadFiles(
  supabase: ReturnType<typeof createServiceClient>,
  referenceNumber: string,
  prefix: string,
  files: File[]
): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const path = `${referenceNumber}/${prefix}-${file.name}`;
    const { error } = await supabase.storage.from('admissions-private').upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      console.error('Upload failed', path, error);
      continue;
    }
    paths.push(path);
  }
  return paths;
}

export async function submitAdmission(formData: FormData): Promise<SubmitAdmissionResult> {
  const supabase = createServiceClient();
  const referenceNumber = await generateUniqueReference('admissions', 'CMA');

  // Student photo
  const studentPhoto = formData.get('studentPhoto') as File | null;
  let studentPhotoPath: string | null = null;
  if (studentPhoto && studentPhoto.size > 0) {
    const paths = await uploadFiles(supabase, referenceNumber, 'student-photo', [studentPhoto]);
    studentPhotoPath = paths[0] ?? null;
  }

  // Documents
  const transferDocs = formData.getAll('transferDocuments') as File[];
  const resultSlip = formData.get('resultSlip') as File | null;
  const otherDocs = formData.getAll('otherDocuments') as File[];

  const documentPaths = [
    ...(await uploadFiles(supabase, referenceNumber, 'transfer-doc', transferDocs)),
    ...(resultSlip && resultSlip.size > 0 ? await uploadFiles(supabase, referenceNumber, 'result-slip', [resultSlip]) : []),
    ...(await uploadFiles(supabase, referenceNumber, 'other-doc', otherDocs)),
  ];

  const isTransferring = formData.get('isTransferring') === 'Yes';
  const hasDisability = formData.get('hasDisability') === 'Yes';

  const { data: admission, error } = await supabase
    .from('admissions')
    .insert({
      reference_number: referenceNumber,
      first_name: formData.get('firstName'),
      middle_name: formData.get('middleName') || null,
      last_name: formData.get('lastName'),
      date_of_birth: formData.get('dateOfBirth'),
      gender: formData.get('gender'),
      previous_school: formData.get('previousSchool') || null,
      student_class: formData.get('studentClass'),
      stream: formData.get('stream') || null,
      student_photo_path: studentPhotoPath,
      is_transferring: isTransferring,
      transfer_school_name: isTransferring ? (formData.get('transferSchoolName') || null) : null,
      transfer_school_location: isTransferring ? (formData.get('transferSchoolLocation') || null) : null,
      transfer_reason: isTransferring ? (formData.get('transferReason') || null) : null,
      allergies: formData.get('allergies') || null,
      medical_conditions: formData.get('medicalConditions') || null,
      has_disability: hasDisability,
      disability_details: hasDisability ? (formData.get('disabilityDetails') || null) : null,
      other_medical_notes: formData.get('otherMedicalNotes') || null,
      document_paths: documentPaths,
    })
    .select('id')
    .single();

  if (error || !admission) {
    console.error('Admission insert failed', error);
    return { success: false, error: 'Something went wrong submitting your application. Please try again.' };
  }

  // Guardians
  const guardian1Raw = formData.get('guardian1') as string | null;
  const hasSecondGuardian = formData.get('hasSecondGuardian') === 'true';
  const guardian2Raw = formData.get('guardian2') as string | null;

  const guardianRows: any[] = [];
  if (guardian1Raw) {
    const g1 = JSON.parse(guardian1Raw);
    guardianRows.push({
      admission_id: admission.id,
      guardian_order: 1,
      full_name: g1.fullName,
      relationship: g1.relationship,
      primary_phone: g1.primaryPhone,
      secondary_phone: g1.secondaryPhone || null,
      email: g1.email || null,
      address: g1.address || null,
    });
  }
  if (hasSecondGuardian && guardian2Raw) {
    const g2 = JSON.parse(guardian2Raw);
    if (g2.fullName) {
      guardianRows.push({
        admission_id: admission.id,
        guardian_order: 2,
        full_name: g2.fullName,
        relationship: g2.relationship || null,
        primary_phone: g2.primaryPhone || null,
        secondary_phone: g2.secondaryPhone || null,
        email: g2.email || null,
        address: g2.address || null,
      });
    }
  }

  if (guardianRows.length > 0) {
    const { error: guardianError } = await supabase.from('admission_guardians').insert(guardianRows);
    if (guardianError) {
      console.error('Guardian insert failed', guardianError);
      // The admission itself was saved; guardians failing is logged but
      // doesn't block the applicant from getting a reference number.
    }
  }

  return { success: true, referenceNumber };
}

export type AdmissionStatusResult =
  | { found: true; status: string; submittedAt: string }
  | { found: false };

export async function checkAdmissionStatus(
  referenceNumber: string,
  dateOfBirth: string
): Promise<AdmissionStatusResult> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('admissions')
    .select('status, created_at')
    .eq('reference_number', referenceNumber)
    .eq('date_of_birth', dateOfBirth)
    .maybeSingle();

  if (!data) return { found: false };
  return { found: true, status: data.status, submittedAt: data.created_at };
}
