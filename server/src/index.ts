import { Hono } from 'hono';

import { trpcServer } from '@hono/trpc-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { appRouter } from './router';

function makeApp({ baseDir, dbPath }:{ baseDir:string, dbPath:string }) {
  const app = new Hono();

  app.use('/*', serveStatic({ root: '../client/dist' }));

  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter({ baseDir, dbPath }),
    }),
  );
  return app;
}

export default makeApp;
