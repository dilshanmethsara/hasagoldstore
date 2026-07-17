import { prisma } from '../lib/prisma';
import { ApiError } from '../types';

export class FavoriteService {
  async list(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        game: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites;
  }

  async add(userId: string, gameId: string) {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new ApiError('GAME_NOT_FOUND', 'Game not found');
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (existing) {
      throw new ApiError('ALREADY_FAVORITED', 'Game already in favorites');
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        gameId,
      },
    });

    return favorite;
  }

  async remove(userId: string, gameId: string) {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    if (!existing) {
      throw new ApiError('NOT_FAVORITED', 'Game not in favorites');
    }

    await prisma.favorite.delete({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    return { success: true };
  }

  async isFavorite(userId: string, gameId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });

    return !!favorite;
  }
}

export const favoriteService = new FavoriteService();
