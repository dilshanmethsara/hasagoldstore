import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err);

  if ('code' in err && 'message' in err) {
    // ApiError
    const apiError = err as ApiError;
    res.status(apiError.code === 'NOT_FOUND' ? 404 : apiError.code === 'UNAUTHORIZED' ? 401 : apiError.code === 'FORBIDDEN' ? 403 : 500).json({
      code: apiError.code,
      message: apiError.message,
      details: apiError.details,
    });
    return;
  }

  // Generic error
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
}
