import { prisma } from '../lib/prisma';

export class AnnouncementService {
  async listActive() {
    const announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return announcements;
  }

  async listAll() {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return announcements;
  }

  async create(data: {
    title: string;
    body?: string;
    isActive?: boolean;
  }) {
    const announcement = await prisma.announcement.create({
      data,
    });

    return announcement;
  }

  async update(id: string, data: Partial<{
    title: string;
    body: string;
    isActive: boolean;
  }>) {
    const announcement = await prisma.announcement.update({
      where: { id },
      data,
    });

    return announcement;
  }

  async delete(id: string) {
    await prisma.announcement.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const announcementService = new AnnouncementService();
