import { Router } from 'express';
import { userService } from '../services/userService';
import { ApiError } from '../types';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get current user profile
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const profile = await userService.getProfile(userId);
    res.json(profile);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch profile' });
    }
  }
});

// Get current user profile details
router.get('/me/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const profile = await userService.getProfile(userId);
    res.json(profile);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch profile' });
    }
  }
});

// Update current user profile
router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { displayName, username, avatarUrl, phone, country } = req.body;
    const profile = await userService.updateProfile(userId, {
      displayName,
      username,
      avatarUrl,
      phone,
      country,
    });
    res.json(profile);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update profile' });
    }
  }
});

// Update current user profile details
router.patch('/me/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { displayName, username, avatarUrl, phone, country } = req.body;
    const profile = await userService.updateProfile(userId, {
      displayName,
      username,
      avatarUrl,
      phone,
      country,
    });
    res.json(profile);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update profile' });
    }
  }
});

export { router as userRoutes };
