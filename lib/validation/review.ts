import { z } from 'zod';

export const reviewSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Please tell us your relationship to CMA'),
  rating: z.coerce.number().min(1).max(5),
  reviewText: z.string().min(10, 'Please write a bit more'),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
