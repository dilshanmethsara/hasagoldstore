import './lib/env';
import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalRateLimit } from './middleware/rateLimit';
import { responseTransform } from './middleware/responseTransform';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { gameRoutes } from './routes/games';
import { packageRoutes } from './routes/packages';
import { orderRoutes } from './routes/orders';
import { reviewRoutes } from './routes/reviews';
import { notificationRoutes } from './routes/notifications';
import { favoriteRoutes } from './routes/favorites';
import { supportRoutes } from './routes/support';
import { adminRoutes } from './routes/admin';
import { faqRoutes } from './routes/faq';
import { blogRoutes } from './routes/blog';
import { announcementRoutes } from './routes/announcements';
import { promoRoutes } from './routes/promo';
import { walletRoutes } from './routes/wallet';
import { settingsService } from './services/settingsService';

export async function createApp(): Promise<Express> {
  const app = express();

  // Middleware
  app.use(helmet());
  
  const corsOrigin = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.replace(/\/$/, '') 
    : 'http://localhost:3000';

  const corsOrigins = corsOrigin.split(',').map(s => s.trim());

  app.use(cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (server-to-server, curl, etc)
      if (!origin || corsOrigins.includes(origin)) return cb(null, true);
      return cb(null, corsOrigins[0]);
    },
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(generalRateLimit);
  app.use(responseTransform);

  // Serve uploaded files
  app.use('/uploads', express.static('public/uploads'));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Public settings endpoint
  app.get('/settings', async (_req, res) => {
    try {
      const settings = await settingsService.get();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // Routes
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/games', gameRoutes);
  app.use('/packages', packageRoutes);
  app.use('/orders', orderRoutes);
  app.use('/reviews', reviewRoutes);
  app.use('/notifications', notificationRoutes);
  app.use('/favorites', favoriteRoutes);
  app.use('/support', supportRoutes);
  app.use('/admin', adminRoutes);
  app.use('/faqs', faqRoutes);
  app.use('/blog', blogRoutes);
  app.use('/announcements', announcementRoutes);
  app.use('/promo-codes', promoRoutes);
  app.use('/wallet', walletRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}


