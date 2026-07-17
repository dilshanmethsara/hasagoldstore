import { Router } from 'express';
import { promoService } from '../services/promoService';
import { ApiError } from '../types';

const router = Router();

// List promo codes
router.get('/', async (_req, res) => {
  try {
    const promos = await promoService.listActive();
    res.json(promos);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch promo codes' });
    }
  }
});

// Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const result = await promoService.validate(code, cartTotal);
    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to validate promo code' });
    }
  }
});

export { router as promoRoutes };
