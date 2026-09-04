import type { RequiredEntityData } from '@mikro-orm/core';

export type AutoTimestampFields = 'created_at' | 'updated_at';

export type CreateEntityData<T> = Omit<RequiredEntityData<T>, AutoTimestampFields>;

export type UpdateEntityData<T> = Partial<Omit<T, AutoTimestampFields>>;
