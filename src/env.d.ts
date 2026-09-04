declare module "bun" {
  interface Env {
    NODE_ENV?: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_DB_NAME: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: number;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: number;
    CORS_ORIGIN?: string;
    REDIS_URL: string;
  }
}
