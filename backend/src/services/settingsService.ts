import { prisma } from '../lib/prisma';

export class SettingsService {
  async get() {
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {},
      });
    }

    return {
      maintenance: {
        enabled: settings.maintenanceEnabled,
        message: settings.maintenanceMessage,
      },
      securityLock: {
        enabled: settings.securityLockEnabled,
        message: settings.securityLockMessage,
      },
    };
  }

  async update(key: 'maintenance' | 'securityLock', value: { enabled: boolean; message: string }) {
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {},
      });
    }

    if (key === 'maintenance') {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          maintenanceEnabled: value.enabled,
          maintenanceMessage: value.message,
        },
      });
    } else if (key === 'securityLock') {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          securityLockEnabled: value.enabled,
          securityLockMessage: value.message,
        },
      });
    }

    return {
      maintenance: {
        enabled: settings.maintenanceEnabled,
        message: settings.maintenanceMessage,
      },
      securityLock: {
        enabled: settings.securityLockEnabled,
        message: settings.securityLockMessage,
      },
    };
  }
}

export const settingsService = new SettingsService();
