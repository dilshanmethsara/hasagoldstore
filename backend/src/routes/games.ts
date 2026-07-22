import { Router } from 'express';
import { gameService } from '../services/gameService';
import { shop2topupService } from '../services/shop2topupService';
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

// Validate player ID (shop2topup API)
router.post('/validate-player', async (req, res) => {
  try {
    const { gameId, playerId, serverId } = req.body;

    if (!gameId || !playerId) {
      return res.status(400).json({ 
        code: 'INVALID_INPUT', 
        message: 'gameId and playerId are required' 
      });
    }

    const game = await gameService.getById(gameId);
    
    if (!game.shop2topupProductId) {
      return res.status(400).json({ 
        code: 'GAME_NOT_CONFIGURED', 
        message: 'This game does not support player validation' 
      });
    }

    const requirements: Record<string, string> = {};
    if (serverId) {
      requirements.server = String(serverId);
    }

    const result = await shop2topupService.validatePlayer({
      sub_category_id: game.shop2topupProductId,
      player_id: String(playerId),
      requirements,
    });

    res.json({ success: true, player: result });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      const msg = error instanceof Error ? error.message : 'Player validation failed';
      res.status(400).json({ code: 'VALIDATION_FAILED', message: msg });
    }
  }
});

export { router as gameRoutes };
