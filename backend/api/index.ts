/**
 * Vercel serverless entry point for the Express backend.
 * 
 * Vercel's @vercel/node runtime handles TypeScript natively.
 * This file re-exports the Express app as a serverless function.
 */

import type { Express } from 'express';
import { createApp } from '../src/index';

let app: Express | undefined;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createApp();
  }
  app(req, res);
}