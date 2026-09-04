const MYSQL_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export function toDateTimeString(value: string | Date): string {
  return toMySQLDateTime(value);
}

export function toMySQLDateTime(value: string | Date): string {
  if (typeof value === 'string' && MYSQL_DATETIME_PATTERN.test(value)) {
    return value;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid datetime value: ${String(value)}`);
  }

  const pad = (part: number) => String(part).padStart(2, '0');

  return [
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`,
  ].join(' ');
}
