import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import superjson from 'superjson';
import type { AppRouter } from '../../server/src/router';

export const tRPClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});
