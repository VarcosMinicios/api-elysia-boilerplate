import type { FilterQuery, EntityKey } from '@mikro-orm/core';
import type { BaseRepository } from '@core/base.repository';
import type { CreateEntityData, UpdateEntityData } from '@core/entity.types';

export abstract class BaseService<T extends { id: number }> {
  constructor(protected readonly repository: BaseRepository<T>) { }

  async list<K extends EntityKey<T>>(
    where: FilterQuery<T> = {} as FilterQuery<T>,
    options?: {
      select?: K[];
      limit?: number;
      offset?: number;
      orderBy?: Record<string, 'ASC' | 'DESC'>;
    }
  ): Promise<{ data: Pick<T, K>[]; total: number }> {
    return this.repository.list(where, options);
  }

  async find<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    select?: K[]
  ): Promise<Pick<T, K>[]> {
    return this.repository.find(where, select);
  }

  async findOne<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    select?: K[]
  ): Promise<Pick<T, K> | null> {
    return this.repository.findOne(where, select);
  }

  async findById<K extends EntityKey<T>>(
    id: number,
    select?: K[]
  ): Promise<Pick<T, K> | null> {
    return this.repository.findOne({ id } as FilterQuery<T>, select);
  }

  async create<K extends EntityKey<T>>(
    data: CreateEntityData<T>,
    select?: K[]
  ): Promise<Pick<T, K>> {
    return this.repository.create(data, select);
  }

  async update<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    data: UpdateEntityData<T>,
    select?: K[]
  ): Promise<Pick<T, K>[]> {
    return this.repository.update(where, data, select);
  }

  async delete(where: FilterQuery<T>): Promise<boolean> {
    return this.repository.delete(where);
  }
}