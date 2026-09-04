import { MikroORM } from '@mikro-orm/mysql';

import config from '@src/mikro-orm.config';

export async function initORM(): Promise<MikroORM> {
  console.log("MikroORM - Inicializando...");
  return MikroORM.init(config);
}

export const db = await initORM();
