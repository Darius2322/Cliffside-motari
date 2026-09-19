'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { generateUniqueReference } from '@/lib/reference-number';

export type SubmitAdmissionResult =
  | { success: true; referenceNumber: string }
  | { success: false; error: string };

async function uploadIfPresent(
  supabase: ReturnType<typeof createServiceClient>,
  bucket: string,
  path: string,
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error('Upload failed', path, error);
    return null;
  }
  return path;
}

export async function submitAdmission(formData: FormData): Promise<SubmitAdmissionResult> {
  const supabase = createServiceClient();

  const referenceNumber = await generateUniqueReference('admissions', 'CMA');

  const studentPhoto = formData.get('studentPhoto') as File | null;
  const guardianPhoto = formData.get('guardianPhoto') as File | null;
  const documents = formData.getAll('documents') as File[];

  const studentPhotoPath = await uploadIfPresent(
    supabase,
    'admissions-private',
    `${referenceNumber}/student-photo-${studentPhoto?.name ?? ''}`,
    studentPhoto
  );
  const guardianPhotoPath = await uploadIfPresent(
    supabase,
    'admissions-private',
    `${referenceNumber}/guardian-photo-${guardianPhoto?.name ?? ''}`,
    guardianPhoto
  );

  const documentPaths: string[] = [];
  for (const doc of documents) {
    if (doc && doc.size > 0) {
      const path = await uploadIfPresent(
        supabase,
        'admissions-private',
        `${referenceNumber}/document-${doc.name}`,
        doc
      );
      if (path) documentPaths.push(path);
    }
  }

  const { error } = await supabase.from('admissions').insert({
    reference_number: referenceNumber,
    student_class: formData.get('studentClass'),
    stream: formData.get('stream'),
    first_name: formData.get('firstName'),
    last_name: formData.get('lastName') || null,
    gender: formData.get('gender'),
    date_of_birth: formData.get('dateOfBirth'),
    mobile_number: formData.get('mobileNumber') || null,
    email: formData.get('email'),
    student_photo_path: studentPhotoPath,
    guardian_is: formData.get('guardianIs'),
    guardian_name: formData.get('guardianName'),
    guardian_relation: formData.get('guardianRelation'),
    guardian_email: formData.get('guardianEmail') || null,
    guardian_photo_path: guardianPhotoPath,
    guardian_phone: formData.get('guardianPhone') || null,
    guardian_occupation: formData.get('guardianOccupation') || null,
    guardian_address: formData.get('guardianAddress') || null,
    document_paths: documentPaths,
  });

  if (error) {
    console.error('Admission insert failed', error);
    return { success: false, error: 'Something went wrong submitting your application. Please try again.' };
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
