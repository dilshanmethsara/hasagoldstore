/**
 * Vercel serverless entry point.
 * Calls the Express app directly — no serverless-http wrapper needed
 * because Vercel's Node.js runtime uses native http.IncomingMessage/ServerResponse.
 */
import { createApp } from '../src/index';
import type { Express } from 'express';

let cachedApp: Express | null = null;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  cachedApp(req, res);
}