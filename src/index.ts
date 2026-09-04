import { Elysia } from "elysia";
import { RequestContext } from "@mikro-orm/core";

import { db } from "@database/index";

import cors from "@elysiajs/cors";
import globalExceptionHandler from "@core/global-exception.handler";

import UserController from "@user/controllers/user.controller";
import AuthController from "@auth/auth.controller";

const app = new Elysia()
  .use(cors({
    origin: Bun.env.NODE_ENV === 'production' ? Bun.env.CORS_ORIGIN : true,
    credentials: true,
  }))
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
  .use(AuthController)
  .use(UserController)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
