import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import crypto from 'crypto';

export const sakeList = sqliteTable('sake', {
  id: text('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').unique().notNull(),
  description: text('description'),
  imageURL: text('imageURL').notNull(),
});

export const diaryList = sqliteTable('diary', {
  id: text('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sakeId: text('sake_id').references(() => sakeList.id),
  createdAt: integer('created_at').notNull(),
  impression: text('impression').notNull(),
  price: integer('price'),
  location: text('location'),
});

export const wishList = sqliteTable('wish', {
  id: text('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sakeId: text('sake_id').references(() => sakeList.id),
  createdAt: integer('created_at').notNull(),
});
