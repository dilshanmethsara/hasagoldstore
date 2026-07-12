/**
 * Vercel serverless entry point for the Express backend.
 * Imports the tsc-compiled output from dist/src/index.js
 */

import serverless from 'serverless-http';
import type { Express } from 'express';
// Import from the tsc-compiled dist output so Vercel can resolve it at runtime
import { createApp } from '../dist/src/index';

let cachedHandler: ReturnType<typeof serverless> | null = null;

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    const app: Express = await createApp();
    cachedHandler = serverless(app);
  }
  return cachedHandler(req, res);
}