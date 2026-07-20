
export class SmsService {
  async sendSms(to: string, message: string): Promise<void> {
    console.log(`[SMS Service] Sending SMS to ${to}: "${message}"`);
    // In a real application, integrate with an SMS provider like Twilio, MessageBird, etc.
    // For now, this is a mock implementation.
  }
}

export const smsService = new SmsService();
