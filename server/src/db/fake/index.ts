import { z } from 'zod';
import { Sake, Wish, Diary } from '../../entities';
import type { UnionToIntersection } from '../../utils';
import fakeData from './data.json';

type SakeType = z.infer<typeof Sake>;
type DiaryType = z.infer<typeof Diary>;
type WishType = z.infer<typeof Wish>;

const { sakeList } = fakeData;

const diaryList:DiaryType[] = fakeData.diaryList.map(
  (d) => ({ ...d, createdAt: new Date(d.createdAt) }),
);

const wishList:WishType[] = fakeData.wishList.map(
  (w) => ({ ...w, createdAt: new Date(w.createdAt) }),
);

const pool = {
  sake: sakeList,
  diary: diaryList,
  wish: wishList,
};
type PoolTypes = {
  sake:SakeType,
  diary:DiaryType,
  wish:WishType,
};

function helper(entity:keyof typeof pool) {
  return {
    findMany: () => pool[entity],
    findById: async (id: string) => pool[entity].find(
      (material) => material.id === id,
    ),
    create: async (data:Omit<PoolTypes[typeof entity], 'id'>) => {
      const material = {
        id: String(pool[entity].length + 1),
        ...data,
      } as UnionToIntersection<PoolTypes[typeof entity]>;
      pool[entity].push(material);
      return material;
    },
  };
}

export const db = {
  sake: helper('sake'),
  diary: helper('diary'),
  wish: helper('wish'),
};
export default db;
