import { Router } from 'express';
import { orderService } from '../services/orderService';
import { ApiError, CreateOrderInput } from '../types';
import { OrderStatus } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { upload } from '../lib/cloudinary';

const router = Router();

// Create order
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const input: CreateOrderInput = req.body;
    const order = await orderService.create(input, userId);
    res.json(order);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to create order' });
    }
  }
});

// List orders (user's orders)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { limit } = req.query;
    const orders = await orderService.listForUser(userId, limit ? Number(limit) : undefined);
    res.json(orders);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch orders' });
    }
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getById(id);
    res.json(order);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(404).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch order' });
    }
  }
});

// Track order by number
router.get('/track/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const order = await orderService.getByNumber(number);
    res.json(order);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(404).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to track order' });
    }
  }
});

// Update order status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateStatus(id, status as OrderStatus);
    res.json(order);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update order status' });
    }
  }
});

// Upload payment receipt
router.post('/upload-receipt', requireAuth, upload.single('receipt'), async (req: AuthRequest, res) => {
  try {
    const file = req.file as any;
    if (!file?.path) {
      res.status(400).json({ code: 'NO_FILE', message: 'No receipt uploaded' });
      return;
    }
    res.json({ url: file.path });
  } catch (error) {
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to upload receipt' });
  }
});

export { router as orderRoutes };
