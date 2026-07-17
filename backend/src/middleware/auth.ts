import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
import { verifyToken, JWTPayload } from '../lib/jwt';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError('UNAUTHORIZED', 'Authentication required');
  }

  const payload = verifyToken(token);

  if (!payload) {
    throw new ApiError('UNAUTHORIZED', 'Invalid or expired token');
  }

  req.user = payload;
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError('UNAUTHORIZED', 'Authentication required');
    }

    const hasRole = roles.some(role => req.user!.roles.includes(role));
    if (!hasRole) {
      throw new ApiError('FORBIDDEN', 'Insufficient permissions');
    }

    next();
  };
}
