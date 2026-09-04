import type {
  FilterQuery,
  RequiredEntityData,
  EntityKey,
} from '@mikro-orm/core';

import type { BaseRepository } from '@core/base.repository';
import type { CreateEntityData, UpdateEntityData } from '@core/entity.types';

export type UserScopedEntity = { id: number; user_id: number };

export abstract class UserScopedBaseService<T extends UserScopedEntity> {
  constructor(protected readonly repository: BaseRepository<T>) { }

  protected scopeWhere(where: FilterQuery<T>, userId: number): FilterQuery<T> {
    return {
      $and: [where, { user_id: userId }],
    } as FilterQuery<T>;
  }

  protected scopeData(data: CreateEntityData<T>, userId: number): RequiredEntityData<T> {
    return Object.assign({}, data, { user_id: userId }) as RequiredEntityData<T>;
  }

  async list<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    userId: number,
    options?: {
      select?: K[];
      limit?: number;
      offset?: number;
      orderBy?: Record<string, 'ASC' | 'DESC'>;
    }
  ): Promise<{ data: Pick<T, K>[]; total: number }> {
    return this.repository.list(this.scopeWhere(where, userId), options);
  }

  async find<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    userId: number,
    select?: K[]
  ): Promise<Pick<T, K>[]> {
    return this.repository.find(this.scopeWhere(where, userId), select);
  }

  async findOne<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    userId: number,
    select?: K[]
  ): Promise<Pick<T, K> | null> {
    return this.repository.findOne(this.scopeWhere(where, userId), select);
  }

  async findById<K extends EntityKey<T>>(
    id: number,
    userId: number,
    select?: K[]
  ): Promise<Pick<T, K> | null> {
    return this.repository.findOne(this.scopeWhere({ id } as FilterQuery<T>, userId), select);
  }

  async create<K extends EntityKey<T>>(
    data: CreateEntityData<T>,
    userId: number,
    select?: K[]
  ): Promise<Pick<T, K>> {
    return this.repository.create(this.scopeData(data, userId), select);
  }

  async update<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    data: UpdateEntityData<T>,
    userId: number,
    select?: K[]
  ): Promise<Pick<T, K>[]> {
    const { user_id: _, ...safeData } = data as UpdateEntityData<T> & { user_id?: number };
    return this.repository.update(
      this.scopeWhere(where, userId),
      safeData as unknown as UpdateEntityData<T>,
      select
    );
  }

  async delete(where: FilterQuery<T>, userId: number): Promise<boolean> {
    return this.repository.delete(this.scopeWhere(where, userId));
  }
}
