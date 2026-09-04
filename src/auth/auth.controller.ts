import { type Cookie, Elysia } from 'elysia';

import { AuthError } from '@errors/auth.error';
import { UserExistsError } from '@errors/user-exists.error';

import {
  ACCESS_COOKIE,
  ACCESS_TTL_SECONDS,
  REFRESH_COOKIE,
  REFRESH_TTL_SECONDS,
  hostCookieOptions,
  jwtAccess,
} from '@core/jwt';

import { ACCESS_USER_FIELDS, AuthService, type AccessUser } from '@auth/services/auth.service';
import { UserService } from '@user/services/user.service';

import { SignInDTO } from '@auth/auth.dto';
import { CreateUserDTO } from '@user/user.dto';
import { UserRole } from '@user/user.enum';
import { consumeRateLimit } from '@helpers/rate-limit.helper';

const userService = new UserService();
const authService = new AuthService();

const AuthController = new Elysia({ prefix: '/auth' })
  .use(jwtAccess)
  .post('/sign-up', async ({ jwtAccess, body, cookie, server, request }) => {
    await consumeRateLimit(server, request, 'signup', 10);

    if (await userService.findOne({ email: body.email }, ['id'])) {
      throw new UserExistsError();
    }

    const user = await userService.create(
      { ...body, role: UserRole.USER },
      [...ACCESS_USER_FIELDS]
    );

    return establishSession(jwtAccess.sign, user, cookie);
  }, {
    body: CreateUserDTO
  })
  .post('/sign-in', async ({ jwtAccess, body, cookie, server, request }) => {
    await consumeRateLimit(server, request, 'signin', 10);

    const user = await userService.findOne(
      { email: body.email },
      [...ACCESS_USER_FIELDS, 'password']
    );

    if (!user || !await userService.verifyPassword(body.password, user.password)) {
      throw new AuthError('Invalid credentials');
    }

    return establishSession(jwtAccess.sign, user, cookie);
  }, {
    body: SignInDTO
  })
  .post('/sign-out', async ({ cookie }) => {
    const refreshToken = cookie[REFRESH_COOKIE]?.value;
    if (refreshToken) await authService.revokeRefreshToken(String(refreshToken));

    writeAuthCookies(cookie);
    return true;
  })
  .post('/refresh-token', async ({ jwtAccess, cookie, server, request }) => {
    await consumeRateLimit(server, request, 'refresh', 30);

    const current = cookie[REFRESH_COOKIE]?.value;
    if (!current) throw new AuthError('Invalid refresh token');

    const { user, refreshToken } = await authService.rotateRefreshToken(String(current));
    writeAuthCookies(cookie, await jwtAccess.sign(user), refreshToken);

    return { user };
  });

async function establishSession(
  sign: (payload: AccessUser) => Promise<string>,
  user: AccessUser,
  cookie: Record<string, Cookie<unknown> | undefined>
) {
  const payload = authService.toAccessPayload(user);
  writeAuthCookies(cookie, await sign(payload), await authService.createRefreshToken(user.id));
  return { user: payload };
}

function writeAuthCookies(
  cookie: Record<string, Cookie<unknown> | undefined>,
  access = '',
  refresh = ''
) {
  cookie[ACCESS_COOKIE]?.set({
    ...hostCookieOptions,
    value: access,
    maxAge: access ? ACCESS_TTL_SECONDS : 0,
  });
  cookie[REFRESH_COOKIE]?.set({
    ...hostCookieOptions,
    value: refresh,
    maxAge: refresh ? REFRESH_TTL_SECONDS : 0,
  });
}

export default AuthController;
