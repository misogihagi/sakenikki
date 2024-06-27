import { z } from 'zod';
import createDB from './db';
import { procedure, router } from './trpc';
import { Sake, Wish, Diary } from './entities';
import { media } from './lib';

const inputs = {
  sake: Sake.omit({ id: true }),
  diary: Diary.omit({ id: true }),
  wish: Wish.omit({ id: true }),
};

function inputHelper<T extends keyof typeof inputs>(input:T) {
  return procedure.input(inputs[input]);
}

function makeHelper(dbPath:string) {
  return <T extends keyof ReturnType<typeof createDB>>(entity:T) => {
    const db = createDB(dbPath);
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
      create: inputHelper(entity).mutation(async (opts) => {
        const { input } = opts;
        // todo: refactor
        // eslint-disable-next-line
      const material = await db[entity].create(input as unknown as any);
        return material;
      }),
    };
  };
}

export const appRouter = ({ baseDir, dbPath }:{ baseDir:string, dbPath:string }) => {
  const helper = makeHelper(dbPath);
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

  return router({
    sakeList,
    sakeById,
    sakeCreate,
    diaryList,
    diaryById,
    diaryCreate,
    wishList,
    wishById,
    wishCreate,
    media: media(baseDir),
  });
};

export type AppRouter = ReturnType<typeof appRouter>;
