/**
 * WhatsApp API placeholder
 * This will be implemented later with actual WhatsApp API integration
 */

export interface WhatsAppMessage {
  to: string;
  message: string;
}

export class WhatsAppService {
  async sendMessage(options: WhatsAppMessage): Promise<void> {
    // TODO: Implement WhatsApp API integration
    console.log('[WhatsApp Service] Placeholder - Message would be sent:', {
      to: options.to,
      message: options.message,
    });
  }

  async sendOrderNotification(phone: string, orderNumber: string, status: string): Promise<void> {
    // TODO: Implement order notification via WhatsApp
    console.log('[WhatsApp Service] Placeholder - Order notification would be sent:', {
      phone,
      orderNumber,
      status,
    });
  }
}

export const whatsappService = new WhatsAppService();
