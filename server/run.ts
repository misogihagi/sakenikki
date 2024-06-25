import { serve } from '@hono/node-server';
import * as fs from 'fs';
import path from 'path';
import makeApp from './src';
import migrate from './src/db/sqlite/migrate';

const DEFAULT_OUTPUT_DIR = './data';

function prepare(outputDir:string) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
}
function main(outputDir = DEFAULT_OUTPUT_DIR) {
  prepare(outputDir);
  const dbPath = path.join(outputDir, 'sqlite.db');
  if (!fs.existsSync(dbPath)) migrate(dbPath);
  serve(makeApp(outputDir));
}
main();
