import { prisma } from "../lib/prisma";

export const paymentMethodService = {
  list: async () => {
    return await prisma.paymentMethod.findMany({ orderBy: { sortOrder: "asc" } });
  },

  listActive: async () => {
    return await prisma.paymentMethod.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  },

  getBySlug: async (slug: string) => {
    return await prisma.paymentMethod.findUnique({ where: { slug } });
  },

  create: async (data: {
    slug: string;
    label: string;
    description?: string;
    iconUrl?: string;
    instructions?: string;
    minAmount?: number;
    maxAmount?: number;
    feePercent?: number;
    feeFixed?: number;
    sortOrder?: number;
    isActive?: boolean;
    extraFields?: any;
  }) => {
    return await prisma.paymentMethod.create({ data });
  },

  update: async (
    id: string,
    data: Partial<{
      slug: string;
      label: string;
      description: string;
      iconUrl: string;
      instructions: string;
      minAmount: number;
      maxAmount: number;
      feePercent: number;
      feeFixed: number;
      sortOrder: number;
      isActive: boolean;
      extraFields: any;
    }>,
  ) => {
    return await prisma.paymentMethod.update({ where: { id }, data });
  },

  delete: async (id: string) => {
    const orders = await prisma.order.count({ where: { paymentMethodId: id } });
    if (orders > 0) {
      throw new Error(`Cannot delete payment method used by ${orders} orders`);
    }
    return await prisma.paymentMethod.delete({ where: { id } });
  },

  toggleActive: async (id: string, isActive: boolean) => {
    return await prisma.paymentMethod.update({ where: { id }, data: { isActive } });
  },
};
