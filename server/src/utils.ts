export type UnionToIntersection<U> =
  /* eslint @typescript-eslint/no-explicit-any: "off"  */
  (U extends any ? (k: U) => void : never) extends
  ((k: infer I) => void) ? I : never;
