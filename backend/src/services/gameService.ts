import { prisma } from '../lib/prisma';
import { ApiError } from '../types';

export class GameService {
  async list(options?: { featured?: boolean; search?: string }) {
    const where: any = {
      isLive: true,
    };

    if (options?.featured) {
      where.isFeatured = true;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { publisher: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { popularity: 'desc' }],
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return games;
  }

  async bySlug(slug: string) {
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!game) {
      throw new ApiError('GAME_NOT_FOUND', 'Game not found');
    }

    return game;
  }

  async getById(id: string) {
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!game) {
      throw new ApiError('GAME_NOT_FOUND', 'Game not found');
    }

    return game;
  }

  async create(data: {
    slug: string;
    name: string;
    tagline?: string;
    publisher?: string;
    imageUrl?: string;
    cardImage?: string;
    heroImage?: string;
    isFeatured?: boolean;
    sortOrder?: number;
  }) {
    return await prisma.game.create({
      data,
    });
  }

  async update(id: string, data: Partial<{
    slug: string;
    name: string;
    tagline: string;
    publisher: string;
    imageUrl: string;
    cardImage: string;
    heroImage: string;
    isFeatured: boolean;
    sortOrder: number;
    isLive: boolean;
  }>) {
    return await prisma.game.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.game.delete({
      where: { id },
    });
  }

  async toggleLive(id: string, isLive: boolean) {
    return await prisma.game.update({
      where: { id },
      data: { isLive },
    });
  }
}

export const gameService = new GameService();
