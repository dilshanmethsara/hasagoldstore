import { Router } from 'express';
import { gameService } from '../services/gameService';
import { ApiError } from '../types';

const router = Router();

// List games
router.get('/', async (req, res) => {
  try {
    const { featured, search } = req.query;
    const games = await gameService.list({
      featured: featured === 'true',
      search: search as string,
    });
    res.json(games);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch games' });
    }
  }
});

// Get game by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await gameService.bySlug(slug);
    res.json(game);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(404).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch game' });
    }
  }
});

// Get packages for a game (by game id)
router.get('/:gameId/packages', async (req, res) => {
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

export { router as gameRoutes };
