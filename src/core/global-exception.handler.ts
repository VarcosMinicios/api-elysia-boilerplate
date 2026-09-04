import { Elysia } from 'elysia';

import { AuthError } from '@errors/auth.error';
import { ForbiddenError } from '@errors/forbidden.error';
import { HttpError } from '@errors/http.error';
import { NotFoundError } from '@errors/not-found.error';
import { UserExistsError } from '@errors/user-exists.error';

export default (app: Elysia) => app
  .error({
    'NOT_FOUND': NotFoundError,
    'AUTH_ERROR': AuthError,
    'USER_EXISTS_ERROR': UserExistsError,
    'FORBIDDEN_ERROR': ForbiddenError,
  })
  .onError(({ error, set }) => {
    console.error(`[Error] Message: ${error}`);

    if (error instanceof HttpError) {
      set.status = error.status;

      return {
        error: error.message,
      };
    }
  });
