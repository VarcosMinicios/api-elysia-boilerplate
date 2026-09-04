import { t } from 'elysia';
import { UserRole } from '@user/user.enum';

export const CreateUserDTO = t.Object({
  name: t.String(),
  stripe_customer_id: t.Optional(t.String()),
  email: t.String(),
  role: t.Enum(UserRole),
  password: t.String()
});

export const UpdateUserDTO = t.Partial(CreateUserDTO);
