import { prisma } from '../lib/prisma';

export class SettingsService {
  private async getOrCreate() {
    let settings = await prisma.systemSettings.findFirst();
    if (!settings) settings = await prisma.systemSettings.create({ data: {} });
    return settings;
  }

  async get() {
    const s = await this.getOrCreate();
    return {
      maintenance: { enabled: s.maintenanceEnabled, message: s.maintenanceMessage },
      security_lock: { enabled: s.securityLockEnabled, message: s.securityLockMessage },
      admin_notification_emails: s.adminNotificationEmails,
      admin_notification_phones: s.adminNotificationPhones,
    };
  }

  async update(
    key: 'maintenance' | 'securityLock' | 'adminNotificationEmails' | 'adminNotificationPhones',
    value: { enabled: boolean; message: string } | string,
  ) {
    const s = await this.getOrCreate();
    let data: any = {};

    if (key === 'maintenance' && typeof value === 'object') {
      data = { maintenanceEnabled: value.enabled, maintenanceMessage: value.message };
    } else if (key === 'securityLock' && typeof value === 'object') {
      data = { securityLockEnabled: value.enabled, securityLockMessage: value.message };
    } else if (key === 'adminNotificationEmails' && typeof value === 'string') {
      data = { adminNotificationEmails: value };
    } else if (key === 'adminNotificationPhones' && typeof value === 'string') {
      data = { adminNotificationPhones: value };
    }

    const updated = await prisma.systemSettings.update({ where: { id: s.id }, data });
    return {
      maintenance: { enabled: updated.maintenanceEnabled, message: updated.maintenanceMessage },
      security_lock: { enabled: updated.securityLockEnabled, message: updated.securityLockMessage },
      admin_notification_emails: updated.adminNotificationEmails,
      admin_notification_phones: updated.adminNotificationPhones,
    };
  }

  /** Returns parsed arrays of admin emails and phone numbers */
  async getAdminNotificationTargets(): Promise<{ emails: string[]; phones: string[] }> {
    const s = await this.getOrCreate();
    const parse = (raw: string) =>
      raw.split(/[\n,]+/).map((v) => v.trim()).filter(Boolean);
    return {
      emails: parse(s.adminNotificationEmails),
      phones: parse(s.adminNotificationPhones),
    };
  }
}

export const settingsService = new SettingsService();
