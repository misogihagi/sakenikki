import type { DB, Resource, Pool } from '../types';
import type { DiaryType, WishType } from '../../entities';
import fakeData from './data.json';

const { sakeList } = fakeData;

const diaryList:DiaryType[] = fakeData.diaryList.map(
  (d) => ({ ...d, createdAt: new Date(d.createdAt) }),
);

const wishList:WishType[] = fakeData.wishList.map(
  (w) => ({ ...w, createdAt: new Date(w.createdAt) }),
);

const pool:Pool = {
  sake: sakeList,
  diary: diaryList,
  wish: wishList,
};

function helper<T extends keyof Pool>(entity:T):Resource<T> {
  return {
    findMany: async () => pool[entity],
    findById: async (id: string) => pool[entity].find(
      (material) => material.id === id,
    ) ?? null,
    create: async (data:Omit<Pool[typeof entity][number], 'id'>) => {
      const material = {
        ...data,
        id: String(pool[entity].length + 1),
      } as Pool[typeof entity][number];
      // todo: refactor
      // eslint-disable-next-line
      pool[entity].push(material as unknown as any);
      return material;
    },
  };
}

export const db:DB = {
  sake: helper('sake'),
  diary: helper('diary'),
  wish: helper('wish'),
};

export default db;
