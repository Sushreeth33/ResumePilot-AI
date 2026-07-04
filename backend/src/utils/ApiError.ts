export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errorCode = 'INTERNAL_SERVER_ERROR',
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
