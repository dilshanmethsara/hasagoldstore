import { Router } from 'express';
import { announcementService } from '../services/announcementService';
import { ApiError } from '../types';

const router = Router();

// List announcements
router.get('/', async (_req, res) => {
  try {
    const announcements = await announcementService.listActive();
    res.json(announcements);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch announcements' });
    }
  }
});

export { router as announcementRoutes };
