import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as schema from './schema';
import data from '../fake/data.json';

export async function main(dbPath:string = './sqlite.db') {
  const sqlite = new Database(dbPath);
  const db: BetterSQLite3Database = drizzle(sqlite);

  migrate(db, { migrationsFolder: `${__dirname}/drizzle` });

  await db.insert(schema.sakeList).values(data.sakeList);
  await db.insert(schema.diaryList).values(data.diaryList);
  await db.insert(schema.wishList).values(data.wishList);
}

if (require.main === module) {
  main();
}

export default main;
