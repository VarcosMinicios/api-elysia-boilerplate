import { HttpError } from '@errors/http.error';

export class NotFoundError extends HttpError {
  override name = 'NOT_FOUND_ERROR';

  constructor() {
    super('Resource not found', 404);
  }
}
