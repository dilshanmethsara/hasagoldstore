/**
 * Vercel serverless entry point for the Express backend.
 *
 * Exports the Express app directly for Vercel's serverless functions.
 * Vercel will call this as a serverless function handler.
 */

import { createApp } from '../src/index';

const appPromise = createApp();

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}