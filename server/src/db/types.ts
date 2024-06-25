import type { SakeType, WishType, DiaryType } from '../entities';

export type Pool = {
  sake: SakeType[],
  diary: DiaryType[],
  wish: WishType[],
};

export type Resource<T extends keyof Pool> = {
  findMany: () => Promise<Pool[T]>,
  findById: (id: string) => Promise<Pool[T][number] | null>,
  create: (data:Omit<Pool[T][number], 'id'>) => Promise<Pool[T][number] | null>
};

export type DB = {
  sake: Resource<'sake'>,
  diary: Resource<'diary'>,
  wish: Resource<'wish'>,
};
