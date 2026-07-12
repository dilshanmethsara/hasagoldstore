/**
 * Vercel serverless entry point.
 * @vercel/node bundles this file + all its imports automatically using esbuild.
 * No separate tsc compilation step is needed.
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