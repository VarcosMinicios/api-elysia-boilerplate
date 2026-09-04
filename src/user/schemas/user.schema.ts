import { EntitySchema } from '@mikro-orm/core';
import { UserRole } from '@user/user.enum';

export const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
  properties: {
    id: { type: 'integer', primary: true },
    role: { type: 'tinyint', default: UserRole.USER },
    name: { type: 'string' },
    email: { type: 'string', unique: true },
    password: { type: 'string' },
    avatar: { type: 'string', nullable: true },
    created_at: { type: 'datetime', onCreate: () => new Date() },
    updated_at: { type: 'datetime', onCreate: () => new Date(), onUpdate: () => new Date() },
  },
});
