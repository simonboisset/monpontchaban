import { Plan } from '@chaban/db';

export type Feature = 'ADMIN' | 'NOTIFICATION_BASE' | 'NOTIFICATION_CUSTOM' | 'EMAIL';

export const featuresByPlans: Record<Plan, Feature[]> = {
  ADMIN: ['ADMIN', 'EMAIL', 'NOTIFICATION_BASE', 'NOTIFICATION_CUSTOM'],
  PREMIUM: ['EMAIL', 'NOTIFICATION_BASE', 'NOTIFICATION_CUSTOM'],
  USER: ['NOTIFICATION_BASE'],
};
