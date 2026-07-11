import { Router } from 'express';
import { gameService } from '../services/gameService';
import { ApiError } from '../types';

const router = Router();

// List packages for a game
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await gameService.getById(gameId);
    res.json(game.packages);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(404).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch packages' });
    }
  }
});

export { router as packageRoutes };
