import { onScopeDispose, ref } from 'vue';
import type { Notification, NotificationPriority, NotificationType } from '#notifications/types';
import { useNotifications } from './useNotifications';

export interface ScheduledNotification {
  id: string;
  scheduledAt: Date;
  notification: Omit<Notification, 'id' | 'read' | 'createdAt'>;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  createdAt: Date;
  recurrence?: RecurrenceConfig;
}

export interface RecurrenceConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  maxOccurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export interface ScheduleConfig {
  enabled: boolean;
  maxScheduled: number;
  persistScheduled: boolean;
  timezone?: string;
}

const defaultConfig: ScheduleConfig = {
  enabled: true,
  maxScheduled: 100,
  persistScheduled: true,
};

const scheduledNotifications = ref<ScheduledNotification[]>([]);
const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const useScheduledNotifications = (config?: Partial<ScheduleConfig>) => {
  const mergedConfig = { ...defaultConfig, ...config };

  const { add } = useNotifications();

  const generateId = () => {
    return `scheduled_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  };

  const schedule = (
    scheduledAt: Date,
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>,
    recurrence?: RecurrenceConfig,
  ): ScheduledNotification | null => {
    if (!mergedConfig.enabled) {
      return null;
    }

    if (scheduledNotifications.value.length >= mergedConfig.maxScheduled) {
      return null;
    }

    const scheduled: ScheduledNotification = {
      id: generateId(),
      scheduledAt,
      notification,
      status: 'pending',
      createdAt: new Date(),
      recurrence,
    };

    scheduledNotifications.value.push(scheduled);
    setTimer(scheduled);

    if (mergedConfig.persistScheduled && import.meta.client) {
      persistScheduled();
    }

    return scheduled;
  };

  const setTimer = (scheduled: ScheduledNotification) => {
    if (scheduled.status !== 'pending') {
      return;
    }

    const now = new Date();
    const targetTime = new Date(scheduled.scheduledAt).getTime() - now.getTime();

    if (targetTime <= 0) {
      executeScheduled(scheduled);
      return;
    }

    const timer = setTimeout(() => {
      executeScheduled(scheduled);
    }, targetTime);

    timers.set(scheduled.id, timer);
  };

  const executeScheduled = (scheduled: ScheduledNotification) => {
    if (scheduled.status !== 'pending') {
      return;
    }

    try {
      add(scheduled.notification);

      if (scheduled.recurrence?.enabled) {
        const nextScheduled = calculateNextOccurrence(scheduled);
        if (nextScheduled) {
          schedule(nextScheduled.scheduledAt, nextScheduled.notification, nextScheduled.recurrence);
        }
      }

      scheduled.status = 'sent';
    } catch {
      scheduled.status = 'failed';
    }

    timers.delete(scheduled.id);

    if (mergedConfig.persistScheduled && import.meta.client) {
      persistScheduled();
    }
  };

  const calculateNextOccurrence = (scheduled: ScheduledNotification): ScheduledNotification | null => {
    if (!scheduled.recurrence) {
      return null;
    }

    const { frequency, interval, endDate, maxOccurrences, daysOfWeek, dayOfMonth } = scheduled.recurrence;

    const nextDate = new Date(scheduled.scheduledAt);

    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + interval);
        break;
      case 'weekly':
        if (daysOfWeek && daysOfWeek.length > 0) {
          const currentDay = nextDate.getDay();
          const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
          const nextDay = sortedDays.find(d => d > currentDay) ?? sortedDays[0];
          const daysToAdd = nextDay > currentDay
            ? nextDay - currentDay
            : 7 - currentDay + nextDay;
          nextDate.setDate(nextDate.getDate() + daysToAdd);
        } else {
          nextDate.setDate(nextDate.getDate() + 7 * interval);
        }
        break;
      case 'monthly':
        if (dayOfMonth) {
          nextDate.setMonth(nextDate.getMonth() + interval);
          nextDate.setDate(dayOfMonth);
        } else {
          nextDate.setMonth(nextDate.getMonth() + interval);
        }
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + interval);
        break;
    }

    if (endDate && nextDate > endDate) {
      return null;
    }

    const occurrences = scheduledNotifications.value.filter(
      s => s.notification.title === scheduled.notification.title && s.status === 'sent',
    ).length;

    if (maxOccurrences && occurrences >= maxOccurrences) {
      return null;
    }

    return {
      ...scheduled,
      id: generateId(),
      scheduledAt: nextDate,
      status: 'pending',
      createdAt: new Date(),
    };
  };

  const cancel = (id: string): boolean => {
    const index = scheduledNotifications.value.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }

    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }

    scheduledNotifications.value[index].status = 'cancelled';

    if (mergedConfig.persistScheduled && import.meta.client) {
      persistScheduled();
    }

    return true;
  };

  const update = (
    id: string,
    updates: Partial<Pick<ScheduledNotification, 'scheduledAt' | 'notification' | 'recurrence'>>,
  ): boolean => {
    const scheduled = scheduledNotifications.value.find(s => s.id === id);
    if (!scheduled || scheduled.status !== 'pending') {
      return false;
    }

    if (updates.scheduledAt) {
      scheduled.scheduledAt = updates.scheduledAt;

      const timer = timers.get(id);
      if (timer) {
        clearTimeout(timer);
        timers.delete(id);
      }
      setTimer(scheduled);
    }

    if (updates.notification) {
      scheduled.notification = { ...scheduled.notification, ...updates.notification };
    }

    if (updates.recurrence !== undefined) {
      scheduled.recurrence = updates.recurrence;
    }

    if (mergedConfig.persistScheduled && import.meta.client) {
      persistScheduled();
    }

    return true;
  };

  const persistScheduled = () => {
    try {
      const data = scheduledNotifications.value.filter(s => s.status === 'pending');
      localStorage.setItem('scheduled-notifications', JSON.stringify(data));
    } catch {
      // Storage not available
    }
  };

  const loadPersisted = () => {
    if (!mergedConfig.persistScheduled || !import.meta.client) {
      return;
    }

    try {
      const stored = localStorage.getItem('scheduled-notifications');
      if (stored) {
        const parsed = JSON.parse(stored) as ScheduledNotification[];
        for (const scheduled of parsed) {
          scheduled.scheduledAt = new Date(scheduled.scheduledAt);
          scheduled.createdAt = new Date(scheduled.createdAt);
          if (new Date(scheduled.scheduledAt) > new Date()) {
            scheduledNotifications.value.push(scheduled);
            setTimer(scheduled);
          }
        }
      }
    } catch {
      // Storage not available
    }
  };

  const getScheduled = (id: string): ScheduledNotification | undefined => {
    return scheduledNotifications.value.find(s => s.id === id);
  };

  const getAllScheduled = (): ScheduledNotification[] => {
    return scheduledNotifications.value;
  };

  const getPending = (): ScheduledNotification[] => {
    return scheduledNotifications.value.filter(s => s.status === 'pending');
  };

  const quickSchedule = (
    title: string,
    message: string,
    scheduledAt: Date,
    options?: {
      type?: NotificationType;
      priority?: NotificationPriority;
      url?: string;
      recurrence?: RecurrenceConfig;
    },
  ) => {
    return schedule(scheduledAt, {
      title,
      message,
      type: options?.type ?? 'info',
      priority: options?.priority ?? 'normal',
      channel: 'in-app',
      url: options?.url,
    }, options?.recurrence);
  };

  // Load persisted on init
  if (import.meta.client) {
    loadPersisted();
  }

  // Cleanup on scope dispose
  onScopeDispose(() => {
    for (const timer of timers.values()) {
      clearTimeout(timer);
    }
    timers.clear();
  });

  return {
    scheduledNotifications,
    schedule,
    cancel,
    update,
    getScheduled,
    getAllScheduled,
    getPending,
    quickSchedule,
  };
};
