import { Router } from 'express';
import { authRateLimit } from '../middleware/rateLimit';
import { authService } from '../services/authService';
import { ApiError } from '../types';
import { generateToken, verifyToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// Session endpoint
router.get('/session', async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.json({});
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.json({});
    }

    // Fetch full user data including profile
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { profile: true },
    });

    if (!user) {
      return res.json({});
    }

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        roles: user.roles,
        status: user.status,
        profile: user.profile,
      }
    });
  } catch (error) {
    return res.json({});
  }
});

// CSRF token endpoint (not needed for JWT, return empty for compatibility)
router.get('/csrf', (_req, res) => {
  res.json({ csrfToken: '' });
});

// Credentials login
router.post('/callback/credentials', authRateLimit, async (req, res) => {
  try {
    console.log('[Login] Request body:', req.body);
    const { email, password } = req.body;
    const user = await authService.login({ email, password });
    
    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
      status: user.status,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log('[Login] Success for:', email);
    res.json({ user });
  } catch (error) {
    console.error('[Login] Error:', error);
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Login failed' });
    }
  }
});

// Register
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const user = await authService.register({ email, password, phone });
    
    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
      status: user.status,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ user });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Registration failed' });
    }
  }
});

// Sign out
router.post('/signout', (_req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

// Forgot password
router.post('/forgot-password', authRateLimit, async (req, res) => {
  try {
    const { email } = req.body;
    await authService.initiatePasswordReset(email);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Password reset failed' });
    }
  }
});

// Reset password
router.post('/reset-password', authRateLimit, async (req, res) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Password reset failed' });
    }
  }
});

// Change password (authenticated)
router.post('/change-password', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    await authService.updatePassword(userId, currentPassword, newPassword);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Password change failed' });
    }
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    await authService.verifyEmail(token);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Email verification failed' });
    }
  }
});

// Start phone verification
router.post('/verify-phone/start', authRateLimit, requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { phone } = req.body;
    await authService.initiatePhoneVerification(userId, phone);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Phone verification failed' });
    }
  }
});

// Confirm phone verification
router.post('/verify-phone/confirm', authRateLimit, requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { code } = req.body;
    await authService.confirmPhoneVerification(userId, code);
    res.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Phone verification failed' });
    }
  }
});

// Google OAuth (placeholder)
router.get('/signin/google', (_req, res) => {
  // TODO: Implement Google OAuth with Auth.js
  res.redirect('/');
});

export { router as authRoutes };
