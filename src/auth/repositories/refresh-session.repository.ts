import type { FilterQuery } from '@mikro-orm/core';
import type { RefreshSession } from '@auth/refresh-session.interface';

import { BaseRepository } from '@core/base.repository';
import { RefreshSessionSchema } from '@auth/schemas/refresh-session.schema';
import { toMySQLDateTime } from '@helpers/date.helper';

export class RefreshSessionRepository extends BaseRepository<RefreshSession> {
  constructor() {
    super(RefreshSessionSchema);
  }

  revoke(where: FilterQuery<RefreshSession>) {
    return this.update(where, { revoked_at: toMySQLDateTime(new Date()) });
  }
}
