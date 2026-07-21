import { Router } from 'express';
import { adminService } from '../services/adminService';
import { settingsService } from '../services/settingsService';
import { ApiError } from '../types';
import { AccountStatus, Role } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Upload game images (admin only)
router.post('/games/upload', requireAuth, requireRole(Role.ADMIN), upload.fields([
  { name: 'card_image', maxCount: 1 },
  { name: 'hero_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result: { card_image?: string; hero_image?: string } = {};

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (files.card_image?.[0]) {
      result.card_image = `${baseUrl}/uploads/${files.card_image[0].filename}`;
    }
    if (files.hero_image?.[0]) {
      result.hero_image = `${baseUrl}/uploads/${files.hero_image[0].filename}`;
    }

    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to upload images' });
    }
  }
});

// Get dashboard stats (admin only)
router.get('/stats', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), async (_req, res) => {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch stats' });
    }
  }
});

// List all users (admin only)
router.get('/users', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const result = await adminService.listUsers(
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );
    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch users' });
    }
  }
});

// Update user status (admin only)
router.patch('/users/:id/status', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const user = await adminService.setUserStatus(id as string, status as AccountStatus, reason);
    res.json(user);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update user status' });
    }
  }
});

// List all orders (admin only)
router.get('/orders', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const result = await adminService.listOrders(
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );
    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch orders' });
    }
  }
});

// List all games (admin only)
router.get('/games', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), async (_req, res) => {
  try {
    const games = await adminService.listGames();
    res.json(games);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch games' });
    }
  }
});

// Create game (admin only)
router.post('/games', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const game = await adminService.upsertGame(req.body);
    res.status(201).json(game);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to create game' });
    }
  }
});

// List all packages (admin only)
router.get('/packages', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), async (_req, res) => {
  try {
    const packages = await adminService.listPackages();
    res.json(packages);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch packages' });
    }
  }
});

// Create package (admin only)
router.post('/packages', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const pkg = await adminService.upsertPackage(req.body);
    res.status(201).json(pkg);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to create package' });
    }
  }
});

// List all tickets (admin only)
router.get('/tickets', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const result = await adminService.listTickets(
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );
    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch tickets' });
    }
  }
});

// Get settings (admin only)
router.get('/settings', requireAuth, requireRole(Role.ADMIN), async (_req, res) => {
  try {
    const settings = await settingsService.get();
    res.json(settings);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch settings' });
    }
  }
});

// Update settings (admin only)
router.patch('/settings', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const { key, value } = req.body;
    const settings = await settingsService.update(key, value);
    res.json(settings);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update settings' });
    }
  }
});

export { router as adminRoutes };
