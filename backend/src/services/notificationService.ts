import { prisma } from '../lib/prisma';
import { ApiError } from '../types';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  async list(userId: string) {
    const notifications = await prisma.appNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return notifications;
  }

  async create(userId: string, data: {
    type: NotificationType;
    title: string;
    body?: string;
    link?: string;
  }) {
    const notification = await prisma.appNotification.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        body: data.body,
        link: data.link,
      },
    });

    return notification;
  }

  async markRead(id: string, userId: string) {
    const notification = await prisma.appNotification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new ApiError('NOTIFICATION_NOT_FOUND', 'Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ApiError('FORBIDDEN', 'You can only mark your own notifications');
    }

    const updated = await prisma.appNotification.update({
      where: { id },
      data: { isRead: true },
    });

    return updated;
  }

  async markAllRead(userId: string) {
    await prisma.appNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  }

  async delete(id: string, userId: string) {
    const notification = await prisma.appNotification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new ApiError('NOTIFICATION_NOT_FOUND', 'Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ApiError('FORBIDDEN', 'You can only delete your own notifications');
    }

    await prisma.appNotification.delete({
      where: { id },
    });

    return { success: true };
  }
}

export const notificationService = new NotificationService();
