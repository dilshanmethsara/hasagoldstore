import { prisma } from '../lib/prisma';
import { ApiError } from '../types';
import { AccountStatus, Role } from '@prisma/client';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    if (!user.profile || !user.profile.displayName || !user.profile.username) {
      // Auto-create or repair profile if it is missing or has empty fields
      let username = user.profile?.username || user.email.split('@')[0];
      let displayName = user.profile?.displayName || username;

      if (!user.profile) {
        // Ensure username uniqueness in the database
        const existing = await prisma.profile.findUnique({
          where: { username },
        });
        if (existing) {
          username = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;
          displayName = username;
        }

        const newProfile = await prisma.profile.create({
          data: {
            userId: user.id,
            displayName,
            username,
            status: user.status,
          },
        });
        return newProfile;
      } else {
        // Repair existing profile with missing fields
        const updatedProfile = await prisma.profile.update({
          where: { userId: user.id },
          data: {
            displayName: user.profile.displayName || displayName,
            username: user.profile.username || username,
          },
        });
        return updatedProfile;
      }
    }

    return user.profile;
  }

  async updateProfile(userId: string, data: {
    displayName?: string;
    username?: string;
    avatarUrl?: string;
    phone?: string;
    country?: string;
  }) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ApiError('PROFILE_NOT_FOUND', 'Profile not found');
    }

    // Check username uniqueness if provided
    if (data.username) {
      const existing = await prisma.profile.findUnique({
        where: { username: data.username },
      });

      if (existing && existing.userId !== userId) {
        throw new ApiError('USERNAME_TAKEN', 'Username already taken');
      }
    }

    const updated = await prisma.profile.update({
      where: { userId },
      data,
    });

    return updated;
  }

  async updateEmail(userId: string, email: string) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing && existing.id !== userId) {
      throw new ApiError('EMAIL_EXISTS', 'Email already registered');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { email, emailVerified: false },
    });

    // TODO: Send verification email
    console.log('[User] Verification email would be sent to:', email);

    return updated;
  }

  async updatePhone(userId: string, phone: string) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { phone, phoneVerified: false },
    });

    // TODO: Send verification SMS
    console.log('[User] Verification SMS would be sent to:', phone);

    return updated;
  }

  async listAll(limit?: number, offset?: number) {
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count();

    return { users, total };
  }

  async setStatus(userId: string, status: AccountStatus, reason?: string) {
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

    // Update profile status as well
    await prisma.profile.update({
      where: { userId },
      data: { status, statusReason: reason, statusUpdatedAt: new Date() },
    });

    return updated;
  }

  async setRole(userId: string, roles: Role[]) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { roles },
    });

    return updated;
  }

  async delete(userId: string) {
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
}

export const userService = new UserService();
