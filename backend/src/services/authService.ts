import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { Role, AccountStatus } from '@prisma/client';
import { ApiError } from '../types';
import { sendOTPEmail, sendWelcomeEmail } from '../lib/email';
import { normalizePhoneNumber, whatsappService } from '../utils/whatsapp';
import { smsService } from './smsService';

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

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
        status: AccountStatus.pending,
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

    // Generate and store OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.emailVerificationToken.create({
      data: {
        email: input.email,
        token: otp,
        expiresAt,
      },
    });

    // Send OTP email
    await sendOTPEmail(input.email, otp);

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      status: user.status,
      emailVerified: user.emailVerified,
      profile: {
        displayName,
        username,
      },
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    if (user.status !== AccountStatus.active && user.status !== AccountStatus.pending) {
      throw new ApiError('ACCOUNT_SUSPENDED', 'Account is not active');
    }

    // Verify password
    if (!user.password) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const validPassword = await bcrypt.compare(input.password, user.password);
    if (!validPassword) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate new OTP and send email
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.emailVerificationToken.deleteMany({
        where: { email: user.email },
      });
      await prisma.emailVerificationToken.create({
        data: {
          email: user.email,
          token: otp,
          expiresAt,
        },
      });

      await sendOTPEmail(user.email, otp);

      throw new ApiError('EMAIL_NOT_VERIFIED', 'Please verify your email first', { email: user.email });
    }

    const { userService } = require('./userService');
    const profile = await userService.getProfile(user.id);

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      roles: user.roles,
      status: user.status,
      profile,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    const { userService } = require('./userService');
    const profile = await userService.getProfile(user.id);

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      roles: user.roles,
      status: user.status,
      createdAt: user.createdAt,
      profile,
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
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      throw new ApiError('INVALID_TOKEN', 'Invalid or expired verification code');
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      throw new ApiError('TOKEN_EXPIRED', 'Verification code has expired');
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: {
        emailVerified: true,
        status: AccountStatus.active,
      },
    });

    // Get user to send welcome email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
      include: { profile: true },
    });

    // Delete used token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Send welcome email
    if (user?.profile?.displayName) {
      await sendWelcomeEmail(user.email, user.profile.displayName);
    }

    return { success: true };
  }

  async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    if (user.emailVerified) {
      throw new ApiError('ALREADY_VERIFIED', 'Email is already verified');
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.emailVerificationToken.deleteMany({
        where: { email },
      });
      await prisma.emailVerificationToken.create({
        data: {
          email,
          token: otp,
          expiresAt,
        },
      });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return { success: true };
  }

  async initiatePhoneVerification(userId: string, phone: string, method: 'sms' | 'whatsapp') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError('USER_NOT_FOUND', 'User not found');
    }

    const normalizedPhone = normalizePhoneNumber(phone);

    // Cooldown: check for existing non-expired token (max 1 OTP per 60s)
    const recent = await prisma.phoneVerificationToken.findFirst({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recent) {
      const waitSeconds = Math.ceil((recent.createdAt.getTime() + 60_000 - Date.now()) / 1000);
      throw new ApiError('OTP_COOLDOWN', `Please wait ${waitSeconds} seconds before requesting a new code.`);
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.phoneVerificationToken.deleteMany({
      where: {
        OR: [
          { userId },
          { phone: normalizedPhone },
        ],
      },
    });

    await prisma.phoneVerificationToken.create({
      data: {
        userId,
        phone: normalizedPhone,
        token: otp,
        expiresAt,
      },
    });

    if (method === 'whatsapp') {
      await whatsappService.sendMessage({
        to: normalizedPhone,
        message: `Your HASA GOLD STORE verification code is ${otp}. Valid for 10 minutes.`,
      });
    } else { // Default to SMS
      await smsService.sendSms(normalizedPhone, `Your HASA GOLD STORE verification code is ${otp}. Valid for 10 minutes.`);
    }

    return { success: true };
  }

  async confirmPhoneVerification(userId: string, code: string) {
    const normalizedCode = code.trim();
    const record = await prisma.phoneVerificationToken.findFirst({
      where: {
        token: normalizedCode,
        userId,
      },
    });

    if (!record) {
      throw new ApiError('INVALID_CODE', 'Invalid verification code');
    }

    if (record.expiresAt < new Date()) {
      await prisma.phoneVerificationToken.delete({
        where: { id: record.id },
      });
      throw new ApiError('TOKEN_EXPIRED', 'Verification code has expired');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        phone: record.phone,
        phoneVerified: true,
      },
    });

    await prisma.phoneVerificationToken.delete({
      where: { id: record.id },
    });

    return { success: true };
  }
}

export const authService = new AuthService();
