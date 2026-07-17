import { prisma } from '../lib/prisma';
import { ApiError } from '../types';

export class ReviewService {
  async listApproved() {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        game: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews;
  }

  async listForGame(gameId: string) {
    const reviews = await prisma.review.findMany({
      where: { gameId, isApproved: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews;
  }

  async create(userId: string, data: {
    gameId?: string;
    orderId?: string;
    rating: number;
    title?: string;
    body: string;
  }) {
    if (!data.gameId && !data.orderId) {
      throw new ApiError('INVALID_INPUT', 'Either gameId or orderId is required');
    }

    // If orderId provided, get gameId from order
    if (data.orderId && !data.gameId) {
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
      });

      if (!order) {
        throw new ApiError('ORDER_NOT_FOUND', 'Order not found');
      }

      data.gameId = order.gameId;
    }

    const review = await prisma.review.create({
      data: {
        userId,
        gameId: data.gameId,
        orderId: data.orderId,
        rating: data.rating,
        title: data.title,
        body: data.body,
        isApproved: false,
      },
    });

    return review;
  }

  async update(id: string, userId: string, data: {
    rating?: number;
    title?: string;
    body?: string;
  }) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new ApiError('REVIEW_NOT_FOUND', 'Review not found');
    }

    if (review.userId !== userId) {
      throw new ApiError('FORBIDDEN', 'You can only edit your own reviews');
    }

    const updated = await prisma.review.update({
      where: { id },
      data,
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new ApiError('REVIEW_NOT_FOUND', 'Review not found');
    }

    if (review.userId !== userId) {
      throw new ApiError('FORBIDDEN', 'You can only delete your own reviews');
    }

    await prisma.review.delete({
      where: { id },
    });

    return { success: true };
  }

  async approve(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new ApiError('REVIEW_NOT_FOUND', 'Review not found');
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });

    return updated;
  }

  async reject(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new ApiError('REVIEW_NOT_FOUND', 'Review not found');
    }

    await prisma.review.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const reviewService = new ReviewService();
