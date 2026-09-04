import { HttpError } from '@errors/http.error';

export class UserExistsError extends HttpError {
  override name = 'USER_EXISTS_ERROR';

  constructor() {
    super('User already exists', 409);
  }
}
