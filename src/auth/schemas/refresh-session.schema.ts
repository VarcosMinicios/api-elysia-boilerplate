import type { User } from '@user/user.interface';

import { type EntityName, EntitySchema } from '@mikro-orm/core';

export const RefreshSessionSchema = new EntitySchema({
  name: 'RefreshSession',
  tableName: 'refresh_sessions',
  properties: {
    id: { type: 'integer', primary: true },
    user_id: {
      kind: 'm:1',
      entity: () => 'User' as unknown as EntityName<User>,
      fieldName: 'user_id',
      mapToPk: true,
      deleteRule: 'cascade',
    },
    token_hash: { type: 'string', length: 64, unique: true },
    family_id: { type: 'string', length: 36, index: true },
    expires_at: { type: 'datetime' },
    revoked_at: { type: 'datetime', nullable: true },
    created_at: { type: 'datetime', onCreate: () => new Date() },
    updated_at: { type: 'datetime', onCreate: () => new Date(), onUpdate: () => new Date() },
  }
});
