import type { Elysia } from 'elysia';

import { ACCESS_COOKIE, jwtAccess } from '@core/jwt';
import { AuthError } from '@errors/auth.error';

export const isAuthenticated = (app: Elysia) =>
  app
    .use(jwtAccess)
    .derive(async ({ jwtAccess, cookie }) => {
      const token = cookie[ACCESS_COOKIE]?.value;
      if (!token) throw new AuthError('JWT token is missing');

      const payload = await jwtAccess.verify(String(token));
      if (!payload) throw new AuthError('Invalid JWT token');

      return { user: payload };
    });
