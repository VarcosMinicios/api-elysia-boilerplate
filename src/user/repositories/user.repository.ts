import type { User } from "@user/user.interface";

import { BaseRepository } from "@core/base.repository";
import { UserSchema } from "@user/schemas/user.schema";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(UserSchema);
  }
}
