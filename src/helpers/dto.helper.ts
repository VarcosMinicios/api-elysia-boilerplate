import { t } from "elysia";

export const GetResourceByIdDTO = t.Object({
  id: t.Number()
});

export const ListResourceQueryDTO = t.Object({
  search: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ default: 10, minimum: 1 })),
  offset: t.Optional(t.Numeric({ default: 0, minimum: 0 })),
  orderBy: t.Optional(t.String()),
  order: t.Union([
    t.Literal('ASC'),
    t.Literal('DESC')
  ], { default: 'ASC' }),
});
