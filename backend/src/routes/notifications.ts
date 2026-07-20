import { Router } from 'express';
import { notificationService } from '../services/notificationService';
import { ApiError } from '../types';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// List notifications
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const notifications = await notificationService.list(userId);
    res.json(notifications);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch notifications' });
    }
  }
});

// Mark notification as read
router.patch('/:id/read', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const notification = await notificationService.markRead(id as string, userId);
    res.json(notification);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to mark notification as read' });
    }
  }
});

// Mark all notifications as read
router.patch('/read-all', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    await notificationService.markAllRead(userId);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to mark all notifications as read' });
    }
  }
});

export { router as notificationRoutes };
