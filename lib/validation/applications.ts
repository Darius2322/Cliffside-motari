import { z } from 'zod';

export const tenderApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

export type TenderApplicationValues = z.infer<typeof tenderApplicationSchema>;

export const vacancyApplicationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  coverNote: z.string().optional(),
});

export type VacancyApplicationValues = z.infer<typeof vacancyApplicationSchema>;
