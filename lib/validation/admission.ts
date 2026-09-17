import { z } from 'zod';

// Field set copied from the live system at
// cliffsidemotariacademy.com/online_admission (Basic Details / Guardian
// Details / Upload Documents). Required fields there (marked *) map to
// required here; everything else is optional, matching the real form.

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

export const guardianIsOptions = ['Father', 'Mother', 'Other'] as const;

export const basicDetailsSchema = z.object({
  studentClass: z.enum(classOptions, { errorMap: () => ({ message: 'Please select a class' }) }),
  stream: z.string().min(1, 'Please select a stream'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  gender: z.enum(['Male', 'Female'], { errorMap: () => ({ message: 'Please select a gender' }) }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  mobileNumber: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  // File inputs are validated for presence only in the browser; real
  // MIME/size validation belongs server-side once storage exists.
  studentPhoto: z.any().optional(),
});

export const guardianDetailsSchema = z.object({
  guardianIs: z.enum(guardianIsOptions, {
    errorMap: () => ({ message: 'Please specify the relationship' }),
  }),
  guardianName: z.string().min(1, "Guardian name is required"),
  guardianRelation: z.string().min(1, 'Guardian relation is required'),
  guardianEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  guardianPhoto: z.any().optional(),
  guardianPhone: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianAddress: z.string().optional(),
});

export const documentsSchema = z.object({
  documents: z.any().optional(),
});

export const admissionSchema = basicDetailsSchema
  .merge(guardianDetailsSchema)
  .merge(documentsSchema);

export type AdmissionFormValues = z.infer<typeof admissionSchema>;

export const stepFields: Record<number, (keyof AdmissionFormValues)[]> = {
  0: ['studentClass', 'stream', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'mobileNumber', 'email', 'studentPhoto'],
  1: ['guardianIs', 'guardianName', 'guardianRelation', 'guardianEmail', 'guardianPhoto', 'guardianPhone', 'guardianOccupation', 'guardianAddress'],
  2: ['documents'],
  3: [],
};
