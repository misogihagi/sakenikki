import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

import {
  eq, type InferSelectModel,
} from 'drizzle-orm';
import { sakeList, diaryList, wishList } from './schema';
import type { DB, Pool } from '../types';
import type { SakeType, DiaryType, WishType } from '../../entities';

const schema = {
  sake: sakeList,
  diary: diaryList,
  wish: wishList,
};

type EntityType = {
  sake: SakeType,
  diary: DiaryType,
  wish: WishType,
};
  type SchemaType = {
    sake: InferSelectModel<typeof sakeList>,
    diary: InferSelectModel<typeof diaryList>,
    wish: InferSelectModel<typeof wishList>,
  };

const sqlite = new Database('./sqlite.db');
const db: BetterSQLite3Database = drizzle(sqlite);

const dateService = {
  objectToRelation:
  <T extends keyof EntityType>(models:Omit<EntityType[T], 'id'>[], record:keyof Omit<EntityType[T], 'id'>) => (
    models.map((model) => (
      {
        ...model,
        [record]: Math.floor((model[record] as Date).getTime() / 1000),
      } as unknown as Omit<SchemaType[T], 'id'>
    ))
  ),
  relationToObject:
  <T extends keyof SchemaType>(models:SchemaType[T][], record:keyof SchemaType[T]) => (
    models.map((model) => (
      {
        ...model,
        [record]: new Date((model[record] as number) * 1000),
      } as unknown as EntityType[T]
    ))
  ),
};

const adopter:DB = {
  sake: {
    findMany: async () => db.select().from(schema.sake),
    findById: async (id: string) => (
      (
        await db.select().from(schema.sake).where(eq(schema.sake.id, id))
      )?.[0]
    ),
    create: async (data:Omit<Pool['sake'][number], 'id'>) => (await db.insert(schema.sake).values(data).returning())?.[0],
  },
  diary: {
    findMany: async () => dateService.relationToObject<'diary'>(
      (await db.select().from(schema.diary)),
      'createdAt',
    ),
    findById: async (id: string) => dateService.relationToObject<'diary'>(
      await db.select().from(schema.diary).where(eq(schema.diary.id, id)),
      'createdAt',
    )?.[0],
    create: async (data:Omit<Pool['diary'][number], 'id'>) => (
      dateService.relationToObject<'diary'>(
        (
          await db.insert(schema.diary).values(
            dateService.objectToRelation<'diary'>([data], 'createdAt'),
          ).returning()
        ),
        'createdAt',
      )?.[0]
    ),
  },
  wish: {
    findMany: async () => dateService.relationToObject<'wish'>(
      await db.select().from(schema.wish),
      'createdAt',
    ),
    findById: async (id: string) => dateService.relationToObject<'wish'>(
      await db.select().from(schema.wish).where(eq(schema.wish.id, id)),
      'createdAt',
    )?.[0],
    create: async (data:Omit<Pool['wish'][number], 'id'>) => (
      dateService.relationToObject<'wish'>(
        (
          await db.insert(schema.wish).values(
            dateService.objectToRelation<'wish'>([data], 'createdAt'),
          ).returning()
        ),
        'createdAt',
      )?.[0]
    ),
  },
};
export default adopter;
