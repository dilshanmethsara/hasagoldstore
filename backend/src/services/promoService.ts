import { prisma } from '../lib/prisma';
import { ApiError } from '../types';
import { PromoKind } from '@prisma/client';

export class PromoService {
  async listActive() {
    const promos = await prisma.promoCode.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return promos;
  }

  async listAll() {
    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return promos;
  }

  async validate(code: string, cartTotal: number) {
    const promo = await prisma.promoCode.findUnique({
      where: { code },
    });

    if (!promo) {
      return { valid: false, discountLkr: 0, message: 'Invalid promo code' };
    }

    if (!promo.isActive) {
      return { valid: false, discountLkr: 0, message: 'Promo code is inactive' };
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return { valid: false, discountLkr: 0, message: 'Promo code has expired' };
    }

    if (cartTotal < Number(promo.minSpendLkr)) {
      return {
        valid: false,
        discountLkr: 0,
        message: `Minimum spend of ${promo.minSpendLkr} required`,
      };
    }

    let discount = 0;
    if (promo.kind === PromoKind.percent) {
      discount = (cartTotal * Number(promo.value)) / 100;
    } else {
      discount = Number(promo.value);
    }

    return {
      valid: true,
      discountLkr: discount,
      message: `Promo code applied: ${discount} LKR discount`,
    };
  }

  async create(data: {
    code: string;
    description?: string;
    kind: PromoKind;
    value: number;
    minSpendLkr?: number;
    expiresAt?: Date;
  }) {
    const existing = await prisma.promoCode.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new ApiError('PROMO_EXISTS', 'Promo code already exists');
    }

    const promo = await prisma.promoCode.create({
      data,
    });

    return promo;
  }

  async update(id: string, data: Partial<{
    description: string;
    kind: PromoKind;
    value: number;
    minSpendLkr: number;
    isActive: boolean;
    expiresAt: Date;
  }>) {
    const promo = await prisma.promoCode.update({
      where: { id },
      data,
    });

    return promo;
  }

  async delete(id: string) {
    await prisma.promoCode.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const promoService = new PromoService();
