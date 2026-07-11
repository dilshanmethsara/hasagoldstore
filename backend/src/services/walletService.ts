import { prisma } from '../lib/prisma';
import { ApiError } from '../types';
import { WalletTxnType } from '@prisma/client';

export class WalletService {
  async summary(userId: string) {
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const balance = transactions.length > 0 
      ? Number(transactions[0].balanceAfter)
      : 0;

    return {
      balance,
      transactions,
    };
  }

  async topUp(userId: string, data: { amountLkr: number; paymentMethod: string }) {
    // TODO: Integrate payment gateway
    console.log('[Wallet] Payment would be processed:', data);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    // Get current balance
    const currentTxn = await prisma.walletTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const currentBalance = currentTxn ? Number(currentTxn.balanceAfter) : 0;
    const newBalance = currentBalance + data.amountLkr;

    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        type: WalletTxnType.credit,
        amountLkr: data.amountLkr,
        balanceAfter: newBalance,
        description: `Wallet top-up via ${data.paymentMethod}`,
      },
    });

    // Create notification
    await prisma.appNotification.create({
      data: {
        userId,
        type: 'wallet',
        title: 'Wallet topped up',
        body: `Your wallet has been topped up with ${data.amountLkr} LKR`,
      },
    });

    return transaction;
  }

  async debit(userId: string, amount: number, description: string, orderId?: string) {
    const currentTxn = await prisma.walletTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const currentBalance = currentTxn ? Number(currentTxn.balanceAfter) : 0;

    if (currentBalance < amount) {
      throw new ApiError('INSUFFICIENT_BALANCE', 'Insufficient wallet balance');
    }

    const newBalance = currentBalance - amount;

    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        type: WalletTxnType.debit,
        amountLkr: amount,
        balanceAfter: newBalance,
        description,
        orderId,
      },
    });

    return transaction;
  }

  async credit(userId: string, amount: number, description: string, orderId?: string) {
    const currentTxn = await prisma.walletTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const currentBalance = currentTxn ? Number(currentTxn.balanceAfter) : 0;
    const newBalance = currentBalance + amount;

    const transaction = await prisma.walletTransaction.create({
      data: {
        userId,
        type: WalletTxnType.credit,
        amountLkr: amount,
        balanceAfter: newBalance,
        description,
        orderId,
      },
    });

    return transaction;
  }
}

export const walletService = new WalletService();
