import { HttpError } from '@errors/http.error';

export class AuthError extends HttpError {
  override name = 'AUTH_ERROR';

  constructor(message: string, status = 401) {
    super(message, status);
  }
}
