import { Router } from 'express';
import { reviewService } from '../services/reviewService';
import { ApiError } from '../types';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// List approved reviews
router.get('/', async (req, res) => {
  try {
    const { gameId } = req.query;
    const reviews = gameId 
      ? await reviewService.listForGame(gameId as string)
      : await reviewService.listApproved();
    res.json(reviews);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch reviews' });
    }
  }
});

// Create review
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { gameId, orderId, rating, title, body } = req.body;
    const review = await reviewService.create(userId, {
      gameId,
      orderId,
      rating,
      title,
      body,
    });
    res.json(review);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to create review' });
    }
  }
});

export { router as reviewRoutes };
