import { Hono } from 'hono';

import { trpcServer } from '@hono/trpc-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { appRouter } from './router';

const app = new Hono();

app.use('/*', serveStatic({ root: '../client/dist' }));

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  }),
);

export default app;
