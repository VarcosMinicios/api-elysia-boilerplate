import type { SqlEntityManager, QBFilterQuery, Field } from '@mikro-orm/mysql';
import type {
  FilterQuery,
  EntityKey,
  EntityName,
  EntityData,
} from '@mikro-orm/core';
import type { CreateEntityData, UpdateEntityData } from '@core/entity.types';

import { RequestContext } from '@mikro-orm/core';
import { serializeEntity } from '@core/entity-serializer.helper';
import { toMySQLDateTime } from '@helpers/date.helper';

export abstract class BaseRepository<T extends { id: number }> {
  constructor(protected readonly entityName: EntityName) { }

  protected get em(): SqlEntityManager {
    return RequestContext.getEntityManager() as SqlEntityManager;
  }

  async list<K extends EntityKey<T>>(
    where: FilterQuery<T> = {} as FilterQuery<T>,
    options?: {
      select?: K[];
      limit?: number;
      offset?: number;
      orderBy?: Record<string, 'ASC' | 'DESC'>;
    }
  ): Promise<{ data: Pick<T, K>[]; total: number }> {
    const qb = this.em.qb(this.entityName);
    const countQb = this.em.qb(this.entityName);

    const filter = where as QBFilterQuery<T>;
    qb.where(filter);
    countQb.where(filter);

    if (options?.select && options.select.length > 0) {
      qb.select(options.select);
    } else {
      qb.select('*');
    }

    if (options?.orderBy) {
      qb.orderBy(options.orderBy);
    }

    if (options?.limit !== undefined) {
      qb.limit(options.limit);
    }
    if (options?.offset !== undefined) {
      qb.offset(options.offset);
    }

    countQb.count('id' as Field<T>, true);

    const [results, countResult] = await Promise.all([
      qb.execute('all'),
      countQb.execute('get')
    ]);

    const total = countResult ? Number(Object.values(countResult)[0]) : 0;

    return {
      data: results as Pick<T, K>[],
      total
    };
  }

  async findOne<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    select?: K[]
  ): Promise<Pick<T, K> | null> {
    const qb = this.em.qb(this.entityName);

    if (select && select.length > 0) {
      qb.select(select);
    } else {
      qb.select('*');
    }

    qb.where(where as QBFilterQuery<T>);
    qb.limit(1);

    const result = await qb.execute('get');

    return result ? (result as Pick<T, K>) : null;
  }

  async find<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    select?: K[]
  ): Promise<Pick<T, K>[]> {
    const qb = this.em.qb(this.entityName);

    if (select && select.length > 0) {
      qb.select(select);
    } else {
      qb.select('*');
    }

    qb.where(where as QBFilterQuery<T>);

    const results = await qb.execute('all');
    return results as Pick<T, K>[];
  }

  protected serialize<T extends object>(entity: T): T {
    return serializeEntity(entity);
  }

  private normalizeDateTimeFields(data: Record<string, unknown>): Record<string, unknown> {
    const meta = this.em.getMetadata().get(this.entityName);
    const normalized = { ...data };

    for (const [key, property] of Object.entries(meta.properties)) {
      if (property.type !== 'datetime') continue;

      const value = normalized[key];
      if (typeof value === 'string') {
        normalized[key] = toMySQLDateTime(value);
      }
    }

    return normalized;
  }

  private applyCreateTimestamps(data: CreateEntityData<T>): EntityData<T> {
    const meta = this.em.getMetadata().get(this.entityName);
    const now = new Date();
    const insertData = this.normalizeDateTimeFields({ ...data } as Record<string, unknown>);

    if (meta.properties.created_at && insertData.created_at === undefined) {
      insertData.created_at = now;
    }

    if (meta.properties.updated_at && insertData.updated_at === undefined) {
      insertData.updated_at = now;
    }

    return insertData as EntityData<T>;
  }

  private applyUpdateTimestamp(data: UpdateEntityData<T>): EntityData<T> {
    const meta = this.em.getMetadata().get(this.entityName);
    const updateData = this.normalizeDateTimeFields({ ...data } as Record<string, unknown>);

    if (meta.properties.updated_at) {
      updateData.updated_at = new Date();
    }

    return updateData as EntityData<T>;
  }

  async create<K extends EntityKey<T>>(
    data: CreateEntityData<T>,
    select?: K[]
  ): Promise<Pick<T, K>> {
    const insertId = await this.em.insert(this.entityName, this.applyCreateTimestamps(data));

    const createdItems = await this.find({ id: insertId } as FilterQuery<T>, select);

    if (!createdItems || createdItems.length === 0) {
      throw new Error('Falha ao criar o registro no banco de dados.');
    }

    return createdItems[0];
  }

  async update<K extends EntityKey<T>>(
    where: FilterQuery<T>,
    data: UpdateEntityData<T>,
    select?: K[]
  ): Promise<Pick<T, K>[]> {
    await this.em.nativeUpdate(this.entityName, where, this.applyUpdateTimestamp(data));
    return this.find(where, select);
  }

  async delete(where: FilterQuery<T>): Promise<boolean> {
    const deletedCount = await this.em.nativeDelete(this.entityName, where);
    return deletedCount > 0;
  }
}
