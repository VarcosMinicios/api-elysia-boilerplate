import { Elysia } from 'elysia';

import { NotFoundError } from '@errors/not-found.error';

export default (app: Elysia) => app
  .error({
    'NOT_FOUND': NotFoundError
  })
  .onError(({ error, set }) => {
    console.error(`[Error] Message: ${error}`);

    if (error instanceof NotFoundError) {
      set.status = error.status;

      return {
        error: error.message,
      };
    }
  });
