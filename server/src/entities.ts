import { z } from 'zod';

export const Sake = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageURL: z.string().nullish()
    .transform((s) => s ?? ''),
});

export const Wish = z.object({
  id: z.string(),
  sakeId: z.string(),
  createdAt: z.date(),
});

export const Diary = z.object({
  id: z.string(),
  sakeId: z.string(),
  createdAt: z.date(),
  impression: z.string(),
  price: z.number(),
  location: z.string(),
});
