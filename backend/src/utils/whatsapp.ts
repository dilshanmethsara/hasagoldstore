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

  async sendOrderPlaced(params: {
    phone: string;
    orderNumber: string;
    gameName: string;
    packageLabel: string;
    playerId: string;
    playerName?: string;
    totalLkr: string;
    paymentMethod: string;
  }): Promise<void> {
    const { phone, orderNumber, gameName, packageLabel, playerId, playerName, totalLkr, paymentMethod } = params;
    const paymentLabel = paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const message = [
      `╔══════════════════════╗`,
      `   🏪 *HASA GOLD STORE*`,
      `╚══════════════════════╝`,
      ``,
      `✅ *Order Placed Successfully!*`,
      `Your order has been received and is being reviewed.`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📋 *Order Details*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🔖 Order #:  *${orderNumber}*`,
      `🎮 Game:     *${gameName}*`,
      `📦 Package:  *${packageLabel}*`,
      `🆔 Player ID: *${playerId}*`,
      ...(playerName ? [`👤 Player:   *${playerName}*`] : []),
      `💳 Payment:  *${paymentLabel}*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `💰 *Total Paid: LKR ${totalLkr}*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `⏳ Status: *Pending Review*`,
      ``,
      `We will notify you once your order`,
      `is processed. Thank you! 🙏`,
      ``,
      `🌐 hasagold.store`,
      `📩 support@hasagold.store`,
    ].join('\n');

    await this.sendMessage({ to: phone, message });
  }

  async sendOrderStatusUpdate(params: {
    phone: string;
    orderNumber: string;
    gameName: string;
    packageLabel: string;
    playerId: string;
    playerName?: string;
    totalLkr: string;
    status: string;
  }): Promise<void> {
    const { phone, orderNumber, gameName, packageLabel, playerId, playerName, totalLkr, status } = params;

    const STATUS_META: Record<string, { icon: string; label: string; note: string }> = {
      pending:    { icon: '⏳', label: 'Pending',    note: 'Your order is queued for processing.' },
      processing: { icon: '⚙️',  label: 'Processing', note: 'Our team is actively working on your order!' },
      completed:  { icon: '🎉', label: 'Completed',  note: 'Your top-up has been delivered. Enjoy the game! 🎮' },
      cancelled:  { icon: '❌', label: 'Cancelled',  note: 'Your order was cancelled. Contact support if this is unexpected.' },
      refunded:   { icon: '↩️', label: 'Refunded',   note: 'Your refund has been initiated. It may take a few days to reflect.' },
    };

    const meta = STATUS_META[status] ?? { icon: '📋', label: status, note: 'Your order status has been updated.' };

    const message = [
      `╔══════════════════════╗`,
      `   🏪 *HASA GOLD STORE*`,
      `╚══════════════════════╝`,
      ``,
      `${meta.icon} *Order Status Update*`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📋 *Order Details*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🔖 Order #:  *${orderNumber}*`,
      `🎮 Game:     *${gameName}*`,
      `📦 Package:  *${packageLabel}*`,
      `🆔 Player ID: *${playerId}*`,
      ...(playerName ? [`👤 Player:   *${playerName}*`] : []),
      `💰 Total:    *LKR ${totalLkr}*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `${meta.icon} Status: *${meta.label}*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `${meta.note}`,
      ``,
      `🌐 Track order: hasagold.store/dashboard/orders`,
      `📩 support@hasagold.store`,
    ].join('\n');

    await this.sendMessage({ to: phone, message });
  }
}

export const whatsappService = new WhatsAppService();
