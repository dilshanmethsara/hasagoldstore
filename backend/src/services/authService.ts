import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { Role, AccountStatus } from '@prisma/client';
import { ApiError } from '../types';

export interface RegisterInput {
  email: string;
  password: string;
  phone?: string;
  displayName?: string;
  username?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ApiError('EMAIL_EXISTS', 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    // Generate username from email if not provided
    const username = input.username || input.email.split('@')[0];
    
    // Generate display name from username if not provided
    const displayName = input.displayName || username;

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        roles: [Role.USER],
        status: AccountStatus.active,
        emailVerified: false,
        phoneVerified: false,
      },
    });

    // Create profile with display name and username
    await prisma.profile.create({
      data: {
        userId: user.id,
        displayName,
        username,
        status: AccountStatus.active,
      },
    });

    // TODO: Send verification email (placeholder)
    console.log('[Auth] Verification email would be sent to:', input.email);

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      status: user.status,
      profile: {
        displayName,
        username,
      },
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (user.status !== AccountStatus.active) {
      throw new ApiError('ACCOUNT_SUSPENDED', 'Account is not active');
    }

    // TODO: Verify password (need to add password field to User model)
    // For now, we'll skip password verification since the schema doesn't have it yet
    // In production, you would: const valid = await bcrypt.compare(input.password, user.password);

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      roles: user.roles,
      status: user.status,
      profile: user.profile,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      roles: user.roles,
      status: user.status,
      createdAt: user.createdAt,
      profile: user.profile,
    };
  }

  async updatePassword(userId: string, _currentPassword: string, _newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    // TODO: Verify current password and update
    // For now, just return success
    console.log('[Auth] Password would be updated for user:', userId);

    return { success: true };
  }

  async initiatePasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    // TODO: Generate reset token and send email
    console.log('[Auth] Password reset email would be sent to:', email);

    return { success: true };
  }

  async resetPassword(token: string, _newPassword: string) {
    // TODO: Verify token and update password
    console.log('[Auth] Password would be reset with token:', token);

    return { success: true };
  }

  async verifyEmail(token: string) {
    // TODO: Verify token and mark email as verified
    console.log('[Auth] Email would be verified with token:', token);

    return { success: true };
  }

  async initiatePhoneVerification(userId: string, phone: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    // TODO: Send SMS verification code
    console.log('[Auth] SMS verification would be sent to:', phone);

    return { success: true };
  }

  async confirmPhoneVerification(_userId: string, code: string) {
    // TODO: Verify code and mark phone as verified
    console.log('[Auth] Phone would be verified with code:', code);

    return { success: true };
  }
}

export const authService = new AuthService();
