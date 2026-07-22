import { prisma } from '../lib/prisma';
import { ApiError, CreateOrderInput } from '../types';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  async create(input: CreateOrderInput, userId?: string) {
    const game = await prisma.game.findUnique({
      where: { id: input.gameId },
    });

    if (!game) {
      throw new ApiError('GAME_NOT_FOUND', 'Game not found');
    }

    const pkg = await prisma.package.findUnique({
      where: { id: input.packageId },
    });

    if (!pkg) {
      throw new ApiError('PACKAGE_NOT_FOUND', 'Package not found');
    }

    if (pkg.gameId !== input.gameId) {
      throw new ApiError('INVALID_PACKAGE', 'Package does not belong to this game');
    }

    const quantity = input.quantity || 1;
    const subtotal = pkg.priceLkr;
    let discount = 0;

    // Apply promo code if provided
    if (input.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: input.promoCode },
      });

      if (promo && promo.isActive) {
        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
          throw new ApiError('PROMO_EXPIRED', 'Promo code has expired');
        }

        if (Number(subtotal) < Number(promo.minSpendLkr)) {
          throw new ApiError('PROMO_MIN_SPEND', `Minimum spend of ${promo.minSpendLkr} required`);
        }

        if (promo.kind === 'percent') {
          discount = (Number(subtotal) * Number(promo.value)) / 100;
        } else {
          discount = Number(promo.value);
        }

        // Update redemption count
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { redemptionsCount: { increment: 1 } },
        });
      }
    }

    const total = Number(subtotal) - discount;

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        gameId: input.gameId,
        packageId: input.packageId,
        playerId: input.playerId,
        playerName: input.playerName,
        quantity,
        subtotalLkr: subtotal,
        discountLkr: discount,
        totalLkr: total,
        paymentMethod: input.paymentMethod,
        receiptUrl: input.receiptUrl,
        paymentDetails: input.paymentDetails ?? undefined,
        status: OrderStatus.pending,
        promoCode: input.promoCode,
      },
      include: {
        game: true,
        package: true,
      },
    });

    // Create initial timeline entry
    await prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        label: 'Order placed',
        status: OrderStatus.pending,
      },
    });

    return this.flattenOrder(order);
  }

  private flattenOrder(order: any) {
    return {
      ...order,
      gameName: order.game?.name ?? null,
      packageLabel: order.package?.label ?? null,
      game: undefined,
      package: undefined,
    };
  }

  async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        game: true,
        package: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        timeline: {
          orderBy: { at: 'asc' },
        },
      },
    });

    if (!order) {
      throw new ApiError('ORDER_NOT_FOUND', 'Order not found');
    }

    return this.flattenOrder(order);
  }

  async getByNumber(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        game: true,
        package: true,
        timeline: {
          orderBy: { at: 'asc' },
        },
      },
    });

    if (!order) {
      throw new ApiError('ORDER_NOT_FOUND', 'Order not found');
    }

    return this.flattenOrder(order);
  }

  async listForUser(userId: string, limit?: number) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        game: true,
        package: true,
      },
    });

    return orders.map((o) => this.flattenOrder(o));
  }

  async listAll(limit?: number, offset?: number) {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        game: true,
        package: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    const total = await prisma.order.count();

    return { orders: orders.map((o) => this.flattenOrder(o)), total };
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new ApiError('ORDER_NOT_FOUND', 'Order not found');
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        game: true,
        package: true,
      },
    });

    // Add timeline entry
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        label: `Status changed to ${status}`,
        status,
      },
    });

    return this.flattenOrder(updated);
  }
}

export const orderService = new OrderService();
