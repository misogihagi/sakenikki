import { z } from 'zod';

export const Sake = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  imageURL: z.string()
    .transform((s) => s ?? ''),
});

export const Wish = z.object({
  id: z.string(),
  sakeId: z.string(),
  createdAt: z.date(),
});

export const Diary = z.object({
  id: z.string(),
  sakeId: z.string().nullish(),
  createdAt: z.date(),
  impression: z.string(),
  price: z.number().nullish(),
  location: z.string().nullish(),
});

export type SakeType = z.infer<typeof Sake>;
export type DiaryType = z.infer<typeof Diary>;
export type WishType = z.infer<typeof Wish>;
