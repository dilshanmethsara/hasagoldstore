import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../types';

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid input', {
          errors: error.errors,
        });
      }
      throw error;
    }
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError('VALIDATION_ERROR', 'Invalid query parameters', {
          errors: error.errors,
        });
      }
      throw error;
    }
  };
}
