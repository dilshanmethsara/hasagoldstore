/**
 * Email service placeholder for Namecheap SMTP
 * This will be implemented later with actual SMTP integration
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export class EmailService {
  async send(options: EmailOptions): Promise<void> {
    // TODO: Implement Namecheap SMTP integration
    console.log('[Email Service] Placeholder - Email would be sent:', {
      to: options.to,
      subject: options.subject,
    });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    // TODO: Implement password reset email
    console.log('[Email Service] Placeholder - Password reset email would be sent:', {
      email,
      token,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // TODO: Implement email verification
    console.log('[Email Service] Placeholder - Verification email would be sent:', {
      email,
      token,
    });
  }
}

export const emailService = new EmailService();
