import { wrap } from '@mikro-orm/core';

import { toDateTimeString } from '@helpers/date.helper';

export function serializeDatesToPrimitives<T>(value: T): T {
  if (value instanceof Date) {
    return toDateTimeString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeDatesToPrimitives(item)) as T;
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        serializeDatesToPrimitives(entry),
      ]),
    ) as T;
  }

  return value;
}

export function serializeEntity<T extends object>(entity: T): T {
  return serializeDatesToPrimitives(wrap(entity).toObject() as T);
}
