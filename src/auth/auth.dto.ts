import { t } from 'elysia';

export const SignInDTO = t.Object({
  email: t.String({
    format: "email",
    maxLength: 255,
  }),
  password: t.String({
    minLength: 6,
    maxLength: 20,
  }),
});
