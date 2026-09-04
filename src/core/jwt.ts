import { Elysia, t } from 'elysia';

import jwt from '@elysiajs/jwt';

import { UserRole } from '@user/user.enum';

export const ACCESS_COOKIE = '__Host-accessToken';
export const REFRESH_COOKIE = '__Host-refreshToken';
export const ACCESS_TTL_SECONDS = Number(Bun.env.JWT_ACCESS_EXPIRES_IN);
export const REFRESH_TTL_SECONDS = Number(Bun.env.JWT_REFRESH_EXPIRES_IN);

export const hostCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
};

export const jwtAccess = new Elysia({
  name: 'jwtAccess',
}).use(
  jwt({
    name: 'jwtAccess',
    schema: t.Object({
      id: t.Number(),
      name: t.String(),
      email: t.String(),
      role: t.Enum(UserRole),
      stripe_customer_id: t.Optional(t.Nullable(t.String())),
    }),
    secret: Bun.env.JWT_ACCESS_SECRET,
    exp: `${ACCESS_TTL_SECONDS}s`,
  })
);
