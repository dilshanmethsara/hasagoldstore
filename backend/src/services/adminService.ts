import { prisma } from '../lib/prisma';
import { ApiError } from '../types';
import { AccountStatus } from '@prisma/client';

export class AdminService {
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalRevenue, orderCount, userCount, gameCount, pendingOrders, todayRevenue, openTickets] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalLkr: true },
        where: { status: { in: ['completed', 'delivered'] } },
      }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.game.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.aggregate({
        _sum: { totalLkr: true },
        where: { 
          status: { in: ['completed', 'delivered'] },
          createdAt: { gte: today, lt: tomorrow }
        },
      }),
      prisma.supportTicket.count({ where: { status: { in: ['open', 'pending'] } } }),
    ]);

    return {
      revenue: Number(totalRevenue._sum.totalLkr || 0),
      todayRev: Number(todayRevenue._sum.totalLkr || 0),
      orderCount,
      userCount,
      gameCount,
      pendingOrders,
      openTickets,
    };
  }

  async listUsers(limit?: number, offset?: number) {
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count();

    return { users, total };
  }

  async listOrders(limit?: number, offset?: number) {
    const orders = await prisma.order.findMany({
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
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.order.count();

    // Flatten game/package names so frontend can read game_name / package_label
    const flatOrders = orders.map((o) => ({
      ...o,
      game_name: o.game?.name ?? null,
      package_label: o.package?.label ?? null,
    }));

    return { orders: flatOrders, total };
  }

  async listGames() {
    const games = await prisma.game.findMany({
      include: {
        packages: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return games;
  }

  async listPackages() {
    const packages = await prisma.package.findMany({
      include: {
        game: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    return packages;
  }

  async listTickets(limit?: number, offset?: number) {
    const tickets = await prisma.supportTicket.findMany({
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.supportTicket.count();

    return { tickets, total };
  }

  async upsertGame(data: {
    id?: string;
    name: string;
    slug: string;
    tagline?: string;
    publisher?: string;
    imageUrl?: string;
    cardImage?: string;
    heroImage?: string;
    isFeatured?: boolean;
    sortOrder?: number;
    isLive?: boolean;
    shop2topupProductId?: number | null;
    // snake_case from frontend
    is_live?: boolean;
    is_featured?: boolean;
    card_image?: string;
    hero_image?: string;
    sort_order?: number;
    popularity?: number;
    shop2topup_product_id?: number | null;
  }) {
    // Map snake_case to camelCase, excluding snake_case keys entirely
    const mappedData = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      tagline: data.tagline,
      publisher: data.publisher,
      imageUrl: data.imageUrl,
      cardImage: data.card_image ?? data.cardImage,
      heroImage: data.hero_image ?? data.heroImage,
      isFeatured: data.is_featured ?? data.isFeatured,
      sortOrder: data.sort_order ?? data.sortOrder,
      isLive: data.is_live ?? data.isLive,
      shop2topupProductId: data.shop2topup_product_id ?? data.shop2topupProductId,
    };

    if (mappedData.id) {
      return await prisma.game.update({
        where: { id: mappedData.id },
        data: mappedData,
      });
    }

    return await prisma.game.create({
      data: mappedData,
    });
  }

  async deleteGame(id: string) {
    return await prisma.game.delete({
      where: { id },
    });
  }

  async toggleGameLive(id: string, isLive: boolean) {
    return await prisma.game.update({
      where: { id },
      data: { isLive },
    });
  }

  async upsertPackage(data: {
    id?: string;
    gameId: string;
    label: string;
    amount: number;
    bonus?: number;
    priceLkr: number;
    badge?: string;
    isActive?: boolean;
    sortOrder?: number;
    // snake_case from frontend
    game_id?: string;
    price_lkr?: number;
    is_active?: boolean;
    sort_order?: number;
  }) {
    const mapped = {
      ...data,
      gameId: data.game_id ?? data.gameId,
      priceLkr: data.price_lkr ?? data.priceLkr,
      isActive: data.is_active ?? data.isActive,
      sortOrder: data.sort_order ?? data.sortOrder,
    };
    // Remove snake_case keys
    delete (mapped as any).game_id;
    delete (mapped as any).price_lkr;
    delete (mapped as any).is_active;
    delete (mapped as any).sort_order;

    if (mapped.id) {
      return await prisma.package.update({
        where: { id: mapped.id },
        data: mapped,
      });
    }

    return await prisma.package.create({
      data: mapped,
    });
  }

  async deletePackage(id: string) {
    return await prisma.package.delete({
      where: { id },
    });
  }

  async togglePackage(id: string, isActive: boolean) {
    return await prisma.package.update({
      where: { id },
      data: { isActive },
    });
  }

  async setUserStatus(userId: string, status: AccountStatus, reason?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    await prisma.profile.update({
      where: { userId },
      data: { status, statusReason: reason, statusUpdatedAt: new Date() },
    });

    return updated;
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }

  async userOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        game: true,
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }
}

export const adminService = new AdminService();
