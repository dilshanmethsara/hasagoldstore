import { URL } from 'url';

export interface WhatsAppMessage {
  to: string;
  message: string;
}

export function normalizePhoneNumber(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return trimmed;

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return trimmed;

  const withoutLeadingZero = digits.replace(/^00/, '');
  if (withoutLeadingZero.startsWith('94')) return withoutLeadingZero;
  if (withoutLeadingZero.startsWith('0')) return `94${withoutLeadingZero.slice(1)}`;
  if (withoutLeadingZero.length === 9) return `94${withoutLeadingZero}`;
  return withoutLeadingZero;
}

export class WhatsAppService {
  private readonly baseUrl = (process.env.WHATSAPP_API_URL || 'http://18.141.127.188').replace(/\/$/, '');
  private readonly botId = process.env.WHATSAPP_BOT_ID || process.env.WHATSAPP_BOT || 'game_store';
  private readonly apiKey = process.env.WHATSAPP_API_KEY;

  private buildHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
    };
  }

  async sendMessage(options: WhatsAppMessage): Promise<void> {
    const normalizedTo = normalizePhoneNumber(options.to);
    const url = new URL('/message', this.baseUrl);

    if (!this.apiKey || this.apiKey.includes('your-api-key') || this.apiKey.includes('placeholder')) {
      console.log('[WhatsApp Service] Missing/placeholder credentials - message would be sent:', {
        to: normalizedTo,
        message: options.message,
      });
      return;
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          botId: this.botId,
          apiKey: this.apiKey,
          number: normalizedTo,
          message: options.message,
        }),
      });

      const responseBody = await response.json().catch(() => null) as { error?: string; id?: string } | null;

      if (!response.ok) {
        throw new Error(responseBody?.error || `WhatsApp API returned ${response.status}`);
      }

      console.log('[WhatsApp Service] Sent WhatsApp OTP successfully', {
        to: normalizedTo,
        id: responseBody?.id,
      });
    } catch (error) {
      console.warn('[WhatsApp Service] Falling back to log-only mode:', error);
      console.log('[WhatsApp Service] Message would be sent:', {
        to: normalizedTo,
        message: options.message,
      });
    }
  }

  async sendOrderNotification(phone: string, orderNumber: string, status: string): Promise<void> {
    await this.sendMessage({
      to: phone,
      message: `HASA GOLD STORE update: Order ${orderNumber} is now ${status}.`,
    });
  }
}

export const whatsappService = new WhatsAppService();
