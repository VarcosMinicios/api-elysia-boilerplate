declare module "bun" {
  interface Env {
    NODE_ENV?: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_DB_NAME: string;
  }
}
