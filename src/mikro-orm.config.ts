import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/mysql';

import { UserSchema } from '@src/user/schemas/user.schema';
import { RefreshSessionSchema } from '@src/auth/schemas/refresh-session.schema';

export default defineConfig({
  dbName: process.env.MYSQL_DB_NAME || 'api',
  user: process.env.MYSQL_USER || 'dev',
  password: process.env.MYSQL_PASSWORD || 'dev',
  port: Number(process.env.MYSQL_PORT || 3306),
  host: process.env.MYSQL_HOST || 'localhost',
  entities: [UserSchema, RefreshSessionSchema],
  migrations: {
    path: './src/database/migrations',
    transactional: true
  },
  extensions: [Migrator],
  debug: process.env.NODE_ENV !== "production"
});
