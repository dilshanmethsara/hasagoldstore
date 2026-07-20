import { Router } from 'express';
import { walletService } from '../services/walletService';
import { ApiError } from '../types';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get wallet summary
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const summary = await walletService.summary(userId);
    res.json(summary);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch wallet' });
    }
  }
});

// Top up wallet
router.post('/top-up', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { amountLkr, paymentMethod } = req.body;
    const transaction = await walletService.topUp(userId, { amountLkr, paymentMethod });
    res.json(transaction);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to top up wallet' });
    }
  }
});

export { router as walletRoutes };
