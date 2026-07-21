import { Router } from 'express';
import { adminService } from '../services/adminService';
import { paymentMethodService } from '../services/paymentMethodService';
import { settingsService } from '../services/settingsService';
import { ApiError } from '../types';
import { AccountStatus, Role } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';
import { upload } from '../lib/cloudinary';

const router = Router();

// Upload game images (admin only)
router.post('/games/upload', requireAuth, requireRole(Role.ADMIN), upload.fields([
  { name: 'card_image', maxCount: 1 },
  { name: 'hero_image', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result: { card_image?: string; hero_image?: string } = {};

    if (files.card_image?.[0]) {
      result.card_image = (files.card_image[0] as any).path;
    }
    if (files.hero_image?.[0]) {
      result.hero_image = (files.hero_image[0] as any).path;
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

// Update game (admin only)
router.patch('/games/:id', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const game = await adminService.toggleGameLive(req.params.id as string, req.body.isLive ?? true);
    res.json(game);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update game' });
    }
  }
});

// Delete game (admin only)
router.delete('/games/:id', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    await adminService.deleteGame(req.params.id as string);
    res.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to delete game' });
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

// Update package (admin only)
router.patch('/packages/:id', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const pkg = await adminService.togglePackage(req.params.id as string, req.body.isActive ?? true);
    res.json(pkg);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update package' });
    }
  }
});

// Delete package (admin only)
router.delete('/packages/:id', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    await adminService.deletePackage(req.params.id as string);
    res.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to delete package' });
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

// ── Payment Methods (admin only) ──────────────────────────────────────────

router.get('/payment-methods', requireAuth, requireRole(Role.ADMIN), async (_req, res) => {
  try {
    const methods = await paymentMethodService.list();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch payment methods' });
  }
});

router.post('/payment-methods', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const body = {} as any;
    for (const [k, v] of Object.entries(req.body)) {
      body[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v;
    }
    const method = await paymentMethodService.create(body);
    res.status(201).json(method);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    res.status(400).json({ code: 'VALIDATION_ERROR', message: (error as Error).message });
  }
});

router.patch('/payment-methods/:id', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    // Map snake_case keys from frontend to camelCase for Prisma
    const body = {} as any;
    for (const [k, v] of Object.entries(req.body)) {
      body[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v;
    }
    const method = await paymentMethodService.update(req.params.id, body);
    res.json(method);
  } catch (error) {
    res.status(400).json({ code: 'VALIDATION_ERROR', message: (error as Error).message });
  }
});

router.delete('/payment-methods/:id', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    await paymentMethodService.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ code: 'VALIDATION_ERROR', message: (error as Error).message });
  }
});

router.patch('/payment-methods/:id/toggle', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
  try {
    const { isActive } = req.body;
    const method = await paymentMethodService.toggleActive(req.params.id, isActive);
    res.json(method);
  } catch (error) {
    res.status(400).json({ code: 'VALIDATION_ERROR', message: (error as Error).message });
  }
});

export { router as adminRoutes };
