import { prisma } from '../lib/prisma';
import { ApiError } from '../types';
import { TicketStatus } from '@prisma/client';

export class SupportService {
  async listMine(userId: string) {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return tickets;
  }

  async listAll(limit?: number, offset?: number) {
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

  async get(id: string) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        order: true,
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                profile: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new ApiError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    return ticket;
  }

  async create(userId: string, data: {
    subject: string;
    category: string;
    body: string;
    orderId?: string;
  }) {
    if (data.orderId) {
      const order = await prisma.order.findUnique({
        where: { id: data.orderId },
      });

      if (!order) {
        throw new ApiError('ORDER_NOT_FOUND', 'Order not found');
      }

      if (order.userId !== userId) {
        throw new ApiError('FORBIDDEN', 'You can only create tickets for your own orders');
      }
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        orderId: data.orderId,
        subject: data.subject,
        category: data.category,
        status: TicketStatus.open,
      },
    });

    // Add initial message
    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: userId,
        body: data.body,
      },
    });

    return ticket;
  }

  async reply(ticketId: string, senderId: string, data: { body: string }) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new ApiError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    if (ticket.userId !== senderId) {
      // TODO: Check if sender is admin
      throw new ApiError('FORBIDDEN', 'You can only reply to your own tickets');
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId,
        body: data.body,
      },
    });

    // Update ticket status if it was closed
    if (ticket.status === TicketStatus.closed) {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: TicketStatus.open },
      });
    }

    return message;
  }

  async close(ticketId: string, userId: string) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new ApiError('TICKET_NOT_FOUND', 'Ticket not found');
    }

    if (ticket.userId !== userId) {
      // TODO: Check if user is admin
      throw new ApiError('FORBIDDEN', 'You can only close your own tickets');
    }

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: TicketStatus.closed },
    });

    return updated;
  }
}

export const supportService = new SupportService();
