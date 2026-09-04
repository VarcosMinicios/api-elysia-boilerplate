import type { CreateEntityData, UpdateEntityData } from "@core/entity.types";
import type { FilterQuery, EntityKey } from "@mikro-orm/core";
import type { User } from "@user/user.interface";

import { BaseService } from "@core/base.service";
import { UserRepository } from "@user/repositories/user.repository";

export class UserService extends BaseService<User> {
  constructor() {
    super(new UserRepository());
  }

  hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password);
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return Bun.password.verify(password, hash);
  }

  override async create<K extends EntityKey<User>>(
    data: CreateEntityData<User>,
    select?: K[]
  ): Promise<Pick<User, K>> {
    const password = await this.hashPassword(data.password as string);

    return super.create({ ...data, password }, select);
  }

  override async update<K extends EntityKey<User>>(
    where: FilterQuery<User>,
    data: UpdateEntityData<User>,
    select?: K[]
  ): Promise<Pick<User, K>[]> {
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    return super.update(where, data, select);
  }
}
