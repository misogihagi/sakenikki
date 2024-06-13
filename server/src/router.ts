import { z } from 'zod';
import db from './db';
import { procedure, router } from './trpc';
import { Sake, Wish, Diary } from './entities';

const inputs = {
  sake: procedure.input(Sake.omit({ id: true })),
  diary: procedure.input(Diary.omit({ id: true })),
  wish: procedure.input(Wish.omit({ id: true })),
};

function helper(entity:keyof typeof db) {
  return {
    list: procedure
      .query(async () => {
        const materials = await db[entity].findMany();
        return materials;
      }),
    byId: procedure
      .input((req) => {
        if (typeof req !== 'object') throw new Error('invalid request');
        const { json } = req as Record<string, unknown>;
        return z.string().parse(json);
      })
      .query(async (opts) => {
        const { input } = opts;
        const material = await db[entity].findById(input);
        return material;
      }),
    create: inputs[entity].mutation(async (opts) => {
      const { input } = opts;
      const material = await db[entity].create(input);
      return material;
    }),
  };
}

const {
  list: sakeList,
  byId: sakeById,
  create: sakeCreate,
} = helper('sake');
const {
  list: diaryList,
  byId: diaryById,
  create: diaryCreate,
} = helper('diary');
const {
  list: wishList,
  byId: wishById,
  create: wishCreate,
} = helper('wish');

export const appRouter = router({
  sakeList,
  sakeById,
  sakeCreate,
  diaryList,
  diaryById,
  diaryCreate,
  wishList,
  wishById,
  wishCreate,
});

export type AppRouter = typeof appRouter;
