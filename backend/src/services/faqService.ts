import { prisma } from '../lib/prisma';

export class FaqService {
  async list(category?: string) {
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return faqs;
  }

  async listAll() {
    const faqs = await prisma.faq.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return faqs;
  }

  async create(data: {
    question: string;
    answer: string;
    category?: string;
    sortOrder?: number;
  }) {
    const faq = await prisma.faq.create({
      data,
    });

    return faq;
  }

  async update(id: string, data: Partial<{
    question: string;
    answer: string;
    category: string;
    isActive: boolean;
    sortOrder: number;
  }>) {
    const faq = await prisma.faq.update({
      where: { id },
      data,
    });

    return faq;
  }

  async delete(id: string) {
    await prisma.faq.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const faqService = new FaqService();
