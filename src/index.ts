import { Elysia } from "elysia";
import { RequestContext } from "@mikro-orm/core";

import { db } from "@database/index";

import cors from "@elysiajs/cors";
import globalExceptionHandler from "@core/global-exception.handler";

const app = new Elysia()
  .use(cors())
  .onRequest(() => {
    RequestContext.enter(db.em.fork());
  })
  .onAfterHandle(() => {
    RequestContext.getEntityManager()?.clear();
  })
  .onError(() => {
    RequestContext.getEntityManager()?.clear();
  })
  .use(globalExceptionHandler)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
