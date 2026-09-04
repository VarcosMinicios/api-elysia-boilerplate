import { HttpError } from '@errors/http.error';

export class ForbiddenError extends HttpError {
  override name = 'FORBIDDEN_ERROR';

  constructor(message: string) {
    super(message, 403);
  }
}
