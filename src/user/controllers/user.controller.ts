import type { User } from "@user/user.interface";
import type { FilterQuery } from "@mikro-orm/core";

import { Elysia } from "elysia";

import { CreateUserDTO, UpdateUserDTO } from "@user/user.dto";
import { UserService } from "@user/services/user.service";
import { NotFoundError } from "@errors/not-found.error";
import { GetResourceByIdDTO, ListResourceQueryDTO } from "@helpers/dto.helper";

const userService = new UserService();

const UserController = new Elysia({ prefix: "/user" })
  .get("/", ({ query }) => {
    let queryFilters: FilterQuery<User> = {};
    if (query.search) {
      queryFilters = {
        $or: [
          { name: { $like: `%${query.search}%` } },
          { email: { $like: `%${query.search}%` } }
        ],
      };
    }

    return userService.list(queryFilters, {
      limit: query.limit,
      offset: query.offset,
      orderBy: {
        [query.orderBy ?? 'id']: query.order,
      },
    });
  }, {
    query: ListResourceQueryDTO,
  })
  .get("/:id", async ({ params }) => {
    const result = await userService.findOne({ id: params.id });

    if (!result) throw new NotFoundError();

    return result;
  }, {
    params: GetResourceByIdDTO,
  })
  .post("/", ({ body }) => {
    return userService.create(body);
  }, {
    body: CreateUserDTO
  })
  .patch("/:id", ({ body, params }) => {
    return userService.update({ id: params.id }, body);
  }, {
    body: UpdateUserDTO,
    params: GetResourceByIdDTO,
  })
  .delete("/:id", ({ params }) => {
    return userService.delete({ id: params.id });
  }, {
    params: GetResourceByIdDTO,
  });

export default UserController;
