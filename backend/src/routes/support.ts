import { Router } from 'express';
import { supportService } from '../services/supportService';
import { ApiError } from '../types';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// List my tickets
router.get('/tickets', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const tickets = await supportService.listMine(userId);
    res.json(tickets);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch tickets' });
    }
  }
});

// Create ticket
router.post('/tickets', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { subject, category, body, orderId } = req.body;
    const ticket = await supportService.create(userId, {
      subject,
      category,
      body,
      orderId,
    });
    res.json(ticket);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to create ticket' });
    }
  }
});

// Get ticket details
router.get('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await supportService.get(id);
    res.json(ticket);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(404).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch ticket' });
    }
  }
});

// Reply to ticket
router.post('/tickets/:id/messages', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { body } = req.body;
    const message = await supportService.reply(id as string, userId, { body });
    res.json(message);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to reply to ticket' });
    }
  }
});

export { router as supportRoutes };
