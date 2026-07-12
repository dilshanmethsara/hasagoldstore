/**
 * Vercel serverless entry point for the Express backend.
 * Uses serverless-http to properly wrap Express for serverless environments.
 * This ensures Express middleware completes before returning the response.
 */

import serverless from 'serverless-http';
import type { Express } from 'express';
import { createApp } from '../src/index';

let cachedHandler: ReturnType<typeof serverless> | null = null;

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    const app: Express = await createApp();
    cachedHandler = serverless(app);
  }
  return cachedHandler(req, res);
}