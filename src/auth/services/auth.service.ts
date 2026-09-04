import { createHmac, randomBytes } from 'node:crypto';

import type { User } from '@user/user.interface';

import { AuthError } from '@errors/auth.error';
import { RefreshSessionRepository } from '@auth/repositories/refresh-session.repository';
import { UserService } from '@user/services/user.service';
import { toMySQLDateTime } from '@helpers/date.helper';
import { REFRESH_TTL_SECONDS } from '@core/jwt';

export const ACCESS_USER_FIELDS = ['id', 'role', 'name', 'email'] as const;
export type AccessUser = Pick<User, (typeof ACCESS_USER_FIELDS)[number]>;

export class AuthService {
  constructor(
    private readonly sessions = new RefreshSessionRepository(),
    private readonly users = new UserService()
  ) {}

  toAccessPayload(user: AccessUser): AccessUser {
    const { id, role, name, email } = user;
    return { id, role, name, email };
  }

  async createRefreshToken(userId: number, familyId: string = crypto.randomUUID()) {
    const refreshToken = randomBytes(32).toString('base64url');

    await this.sessions.create({
      user_id: userId,
      token_hash: this.hashRefreshToken(refreshToken),
      family_id: familyId,
      expires_at: toMySQLDateTime(new Date(Date.now() + REFRESH_TTL_SECONDS * 1000)),
      revoked_at: null,
    });

    return refreshToken;
  }

  async rotateRefreshToken(rawToken: string) {
    const session = await this.findOneByToken(rawToken);

    if (!session) throw new AuthError('Invalid refresh token');

    if (session.revoked_at) {
      await this.sessions.revoke({ family_id: session.family_id, revoked_at: null });
      throw new AuthError('Invalid refresh token');
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      await this.sessions.revoke({ id: session.id });
      throw new AuthError('Invalid refresh token');
    }

    const user = await this.users.findById(session.user_id, [...ACCESS_USER_FIELDS]);

    if (!user) {
      await this.sessions.revoke({ family_id: session.family_id, revoked_at: null });
      throw new AuthError('Invalid refresh token');
    }

    const refreshToken = await this.createRefreshToken(session.user_id, session.family_id);
    await this.sessions.revoke({ id: session.id });

    return {
      user: this.toAccessPayload(user),
      refreshToken,
    };
  }

  async revokeRefreshToken(rawToken: string) {
    const session = await this.findOneByToken(rawToken);
    if (!session || session.revoked_at) return;

    await this.sessions.revoke({ id: session.id });
  }

  private findOneByToken(rawToken: string) {
    return this.sessions.findOne({ token_hash: this.hashRefreshToken(rawToken) });
  }

  private hashRefreshToken(token: string) {
    return createHmac('sha256', Bun.env.JWT_REFRESH_SECRET).update(token).digest('hex');
  }
}
