import { z } from 'zod';
import type { Base64String } from './types';

export type UnionToIntersection<U> =
  /* eslint @typescript-eslint/no-explicit-any: "off"  */
  (U extends any ? (k: U) => void : never) extends
  ((k: infer I) => void) ? I : never;

export const base64StringSchema = z.custom<Base64String>((value: unknown) => {
  if (typeof value !== 'string') {
    return false;
  }
  const base64Str = value.slice(0, 4) === 'data' ? value.split(',')[1] : value;
  try {
    atob(base64Str);
    return true;
  } catch (error) {
    return false;
  }
});
