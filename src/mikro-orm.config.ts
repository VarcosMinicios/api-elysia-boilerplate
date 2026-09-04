import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/mysql';

export default defineConfig({
  dbName: process.env.MYSQL_DB_NAME || 'api',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  port: Number(process.env.MYSQL_PORT || 3306),
  host: process.env.MYSQL_HOST || 'localhost',
  entities: [],
  migrations: {
    path: './src/database/migrations',
    transactional: true
  },
  extensions: [Migrator],
  debug: process.env.NODE_ENV !== "production"
});
