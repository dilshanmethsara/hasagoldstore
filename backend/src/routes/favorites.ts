import { Router } from 'express';
import { favoriteService } from '../services/favoriteService';
import { ApiError } from '../types';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// List favorites
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const favorites = await favoriteService.list(userId);
    res.json(favorites);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch favorites' });
    }
  }
});

// Add to favorites
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { gameId } = req.body;
    const favorite = await favoriteService.add(userId, gameId);
    res.json(favorite);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to add to favorites' });
    }
  }
});

// Remove from favorites
router.delete('/:gameId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { gameId } = req.params;
    await favoriteService.remove(userId, gameId as string);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to remove from favorites' });
    }
  }
});

export { router as favoriteRoutes };
