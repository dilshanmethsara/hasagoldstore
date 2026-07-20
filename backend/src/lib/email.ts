import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use configured sender email (works for both dev and prod with verified domain)
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function generateOTPEmail(code: string, email: string): EmailTemplate {
  const subject = `Your verification code: ${code}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 28px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">HASA<span style="color: #fbbf24;">GOLD</span></span>
        </div>
        
        <!-- Title -->
        <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: center; letter-spacing: -0.3px;">
          Verify your email address
        </h1>
        
        <!-- Description -->
        <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
          Welcome to HASA GOLD STORE! Enter the 6-digit code below to verify your email and activate your account.
        </p>
        
        <!-- OTP Code -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 12px; padding: 24px 40px; box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);">
            <span style="font-size: 36px; font-weight: 800; color: #1a1a1a; letter-spacing: 8px; font-family: 'SF Mono', 'Fira Code', monospace;">
              ${code}
            </span>
          </div>
        </div>
        
        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        
        <!-- Expiry info -->
        <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5; color: #6b7280; text-align: center;">
          This code expires in <strong style="color: #374151;">10 minutes</strong>.
        </p>
        
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280; text-align: center;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        
        <!-- Footer -->
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af;">
            © 2025 HASA GOLD STORE. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            Colombo, Sri Lanka
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
  
  const text = `
Welcome to HASA GOLD STORE!

Your verification code is: ${code}

This code expires in 10 minutes.

If you didn't create an account, you can safely ignore this email.

---
© 2025 HASA GOLD STORE. All rights reserved.
Colombo, Sri Lanka
  `.trim();

  return { subject, html, text };
}

export function generateWelcomeEmail(displayName: string): EmailTemplate {
  const subject = `Welcome to HASA GOLD STORE! 🎮`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HASA GOLD STORE</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 28px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;">HASA<span style="color: #fbbf24;">GOLD</span></span>
        </div>
        
        <!-- Title -->
        <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: center; letter-spacing: -0.3px;">
          Welcome, ${displayName}! 🎉
        </h1>
        
        <!-- Description -->
        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
          Your account is now verified and ready to use. Start exploring the best gaming top-ups in Sri Lanka.
        </p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://hasagold.store/dashboard" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1a1a1a; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);">
            Go to Dashboard →
          </a>
        </div>
        
        <!-- Features -->
        <div style="margin-top: 32px; padding: 24px; background-color: #fafafa; border-radius: 12px;">
          <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #1a1a1a; text-align: center;">
            What you can do now
          </h2>
          <ul style="margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <li style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
              <span style="width: 20px; height: 20px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #1a1a1a; font-size: 12px;">✓</span>
              Top up games instantly
            </li>
            <li style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
              <span style="width: 20px; height: 20px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #1a1a1a; font-size: 12px;">✓</span>
              Earn loyalty rewards
            </li>
            <li style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
              <span style="width: 20px; height: 20px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #1a1a1a; font-size: 12px;">✓</span>
              Track orders in real-time
            </li>
            <li style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4b5563;">
              <span style="width: 20px; height: 20px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #1a1a1a; font-size: 12px;">✓</span>
              24/7 customer support
            </li>
          </ul>
        </div>
        
        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        
        <!-- Footer -->
        <div style="text-align: center;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af;">
            © 2025 HASA GOLD STORE. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            Colombo, Sri Lanka
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
  
  const text = `
Welcome to HASA GOLD STORE, ${displayName}!

Your account is now verified and ready to use. Start exploring the best gaming top-ups in Sri Lanka.

Visit your dashboard: https://hasagold.store/dashboard

What you can do now:
✓ Top up games instantly
✓ Earn loyalty rewards
✓ Track orders in real-time
✓ 24/7 customer support

---
© 2025 HASA GOLD STORE. All rights reserved.
Colombo, Sri Lanka
  `.trim();

  return { subject, html, text };
}

export async function sendEmail(to: string, template: EmailTemplate): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key_here') {
      console.warn('[Email] RESEND_API_KEY not configured, skipping email send');
      console.log('[Email] Would send to:', to, 'Subject:', template.subject);
      return { success: true };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (result.error) {
      console.error('[Email] Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('[Email] Sent successfully:', result.data?.id);
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendOTPEmail(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  const template = generateOTPEmail(code, email);
  const result = await sendEmail(email, template);
  
  // Dev fallback: log OTP to console if email fails
  if (!result.success && process.env.NODE_ENV === 'development') {
    console.log('\n═══════════════════════════════════════');
    console.log(`📧 DEV MODE - OTP for ${email}: ${code}`);
    console.log('═══════════════════════════════════════\n');
    return { success: true };
  }
  
  return result;
}

export async function sendWelcomeEmail(email: string, displayName: string): Promise<{ success: boolean; error?: string }> {
  const template = generateWelcomeEmail(displayName);
  return sendEmail(email, template);
}
