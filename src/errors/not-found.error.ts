export class NotFoundError extends Error {
  status = 404;

  override name = 'NOT_FOUND_ERROR';

  constructor() {
    super('Resource not found');
  }
}
