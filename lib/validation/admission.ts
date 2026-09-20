import { z } from 'zod';

// Field set per the expanded admissions brief: Learner (no student
// contact fields, stream optional), Transfer, Medical, Guardian(s)
// (1 required, 1 optional), Documents (all optional unless the school
// says otherwise later).

export const classOptions = [
  'KINDERGARTEN',
  'PP1',
  'PP2',
  'GRADE 1',
  'GRADE 2',
  'GRADE 3',
  'GRADE 4',
  'GRADE 5',
  'GRADE 6',
  'GRADE 7',
  'GRADE 8',
  'GRADE 9',
] as const;

// ---------- Learner ----------
export const learnerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female'], { errorMap: () => ({ message: 'Please select a gender' }) }),
  previousSchool: z.string().optional(),
  studentClass: z.enum(classOptions, { errorMap: () => ({ message: 'Please select a class' }) }),
  stream: z.string().optional(),
  studentPhoto: z.any().optional(),
});

// ---------- Transfer ----------
export const transferSchema = z.object({
  isTransferring: z.enum(['Yes', 'No'], { errorMap: () => ({ message: 'Please select an option' }) }),
  transferSchoolName: z.string().optional(),
  transferSchoolLocation: z.string().optional(),
  transferReason: z.string().optional(),
});

// ---------- Medical ----------
export const medicalSchema = z.object({
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  hasDisability: z.enum(['Yes', 'No']).default('No'),
  disabilityDetails: z.string().optional(),
  otherMedicalNotes: z.string().optional(),
});

// ---------- Guardian ----------
export const guardianFieldsSchema = z.object({
  fullName: z.string().min(1, 'Guardian name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  primaryPhone: z.string().min(1, 'A primary phone number is required'),
  secondaryPhone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  address: z.string().optional(),
});

export const guardiansSchema = z.object({
  guardian1: guardianFieldsSchema,
  hasSecondGuardian: z.boolean().default(false),
  guardian2: z.object({
    fullName: z.string().optional(),
    relationship: z.string().optional(),
    primaryPhone: z.string().optional(),
    secondaryPhone: z.string().optional(),
    email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
    address: z.string().optional(),
  }).optional(),
});

// ---------- Documents ----------
export const documentsSchema = z.object({
  transferDocuments: z.any().optional(),
  resultSlip: z.any().optional(),
  otherDocuments: z.any().optional(),
});

// ---------- Combined ----------
export const admissionSchema = learnerSchema
  .merge(transferSchema)
  .merge(medicalSchema)
  .merge(guardiansSchema)
  .merge(documentsSchema);

export type AdmissionFormValues = z.infer<typeof admissionSchema>;

export const stepFields: Record<number, (keyof AdmissionFormValues)[]> = {
  0: ['firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender', 'previousSchool', 'studentClass', 'stream', 'studentPhoto'],
  1: ['isTransferring', 'transferSchoolName', 'transferSchoolLocation', 'transferReason'],
  2: ['allergies', 'medicalConditions', 'hasDisability', 'disabilityDetails', 'otherMedicalNotes'],
  3: ['guardian1', 'hasSecondGuardian', 'guardian2'],
  4: ['transferDocuments', 'resultSlip', 'otherDocuments'],
  5: [],
};
