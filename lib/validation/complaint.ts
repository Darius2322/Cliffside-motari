import { z } from 'zod';

export const complaintCategories = [
  'Academics',
  'Administration',
  'Facilities',
  'Staff',
  'Student Welfare',
  'Transport',
  'Other',
] as const;

export const complaintSchema = z.object({
  category: z.enum(complaintCategories, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  description: z.string().min(10, 'Please describe the issue in a bit more detail'),
});

export type ComplaintFormValues = z.infer<typeof complaintSchema>;
