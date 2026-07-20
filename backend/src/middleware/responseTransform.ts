/**
 * Express middleware that transforms all JSON response bodies from
 * camelCase (Prisma model fields) to snake_case (frontend API contract).
 *
 * This wraps res.json to recursively convert property names before
 * serialization.
 *
 * IMPORTANT: The transform first serializes to plain JSON (which triggers
 * Prisma Decimal.toJSON() returning strings), then converts keys. This
 * ensures Decimal values are properly stringified before key conversion.
 */

import type { Request, Response, NextFunction } from 'express';

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function transformValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(transformValue);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      result[camelToSnake(key)] = transformValue(obj[key]);
    }
    return result;
  }
  return value;
}

export function responseTransform(_req: Request, res: Response, next: NextFunction): void {
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown): Response {
    // First pass: serialize to JSON and back to trigger all native
    // toJSON() methods (e.g. Prisma Decimal → string, Date → ISO string)
    const plain = JSON.parse(JSON.stringify(body));
    // Second pass: transform camelCase keys to snake_case
    const transformed = transformValue(plain);
    return originalJson(transformed);
  } as typeof res.json;

  next();
}