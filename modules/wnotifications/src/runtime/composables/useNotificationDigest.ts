import { computed, onScopeDispose, ref, watch } from 'vue';
import type { Notification, NotificationType } from '#notifications/types';
import { useNotifications } from './useNotifications';

export interface DigestConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'hourly';
  time?: string;
  dayOfWeek?: number;
  maxItems: number;
  includeRead: boolean;
  groupByType: boolean;
  sendEvenIfEmpty: boolean;
}

export interface Digest {
  id: string;
  createdAt: Date;
  notifications: Notification[];
  summary: DigestSummary;
  status: 'pending' | 'sent' | 'viewed';
}

export interface DigestSummary {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<string, number>;
  topNotifications: Notification[];
}

const defaultConfig: DigestConfig = {
  enabled: true,
  frequency: 'daily',
  time: '09:00',
  maxItems: 20,
  includeRead: false,
  groupByType: true,
  sendEvenIfEmpty: false,
};

const digests = ref<Digest[]>([]);
let digestTimer: ReturnType<typeof setTimeout> | null = null;

export const useNotificationDigest = (config?: Partial<DigestConfig>) => {
  const mergedConfig = { ...defaultConfig, ...config };

  const { notifications } = useNotifications();

  const generateId = () => {
    return `digest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  };

  const generateSummary = (items: Notification[]): DigestSummary => {
    const byType: Record<NotificationType, number> = {
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
      system: 0,
      message: 0,
    };

    const byPriority: Record<string, number> = {
      urgent: 0,
      high: 0,
      normal: 0,
      low: 0,
    };

    for (const notification of items) {
      byType[notification.type]++;
      byPriority[notification.priority]++;
    }

    const topNotifications = items
      .filter((n: Notification) => n.priority === 'urgent' || n.priority === 'high')
      .slice(0, 5);

    return {
      total: items.length,
      unread: items.filter((n: Notification) => !n.read).length,
      byType,
      byPriority,
      topNotifications,
    };
  };

  const createDigest = (): Digest | null => {
    let items = notifications.value;

    if (!mergedConfig.includeRead) {
      items = items.filter((n: Notification) => !n.read);
    }

    // Filter by time period
    const now = new Date();
    let since: Date;

    switch (mergedConfig.frequency) {
      case 'hourly':
        since = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'daily':
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    items = items.filter((n: Notification) => new Date(n.createdAt) >= since);

    if (items.length === 0 && !mergedConfig.sendEvenIfEmpty) {
      return null;
    }

    const digest: Digest = {
      id: generateId(),
      createdAt: new Date(),
      notifications: items.slice(0, mergedConfig.maxItems),
      summary: generateSummary(items),
      status: 'pending',
    };

    digests.value.push(digest);
    return digest;
  };

  const getNextDigestTime = (): Date => {
    const now = new Date();
    const [hours, minutes] = (mergedConfig.time ?? '09:00').split(':').map(Number);

    let next = new Date(now);
    next.setHours(hours, minutes, 0, 0);

    switch (mergedConfig.frequency) {
      case 'hourly':
        // Next hour
        if (next <= now) {
          next.setHours(next.getHours() + 1);
        }
        break;
      case 'daily':
        // Next day at specified time
        if (next <= now) {
          next.setDate(next.getDate() + 1);
        }
        break;
      case 'weekly':
        // Next specified day of week at specified time
        const targetDay = mergedConfig.dayOfWeek ?? 1;
        const currentDay = now.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7;
        next.setDate(next.getDate() + (daysUntilTarget === 0 && next <= now ? 7 : daysUntilTarget));
        break;
    }

    return next;
  };

  const scheduleNextDigest = () => {
    if (!mergedConfig.enabled || !import.meta.client) {
      return;
    }

    if (digestTimer) {
      clearTimeout(digestTimer);
    }

    const nextTime = getNextDigestTime();
    const delay = nextTime.getTime() - Date.now();

    digestTimer = setTimeout(() => {
      const digest = createDigest();
      if (digest) {
        // Emit event or trigger notification
        console.log('[Notifications] Digest created:', digest.id);
      }
      scheduleNextDigest();
    }, delay);
  };

  const sendDigest = async (digestId: string): Promise<boolean> => {
    const digest = digests.value.find(d => d.id === digestId);
    if (!digest || digest.status !== 'pending') {
      return false;
    }

    // In a real implementation, this would send via email/push
    digest.status = 'sent';
    return true;
  };

  const markDigestViewed = (digestId: string): boolean => {
    const digest = digests.value.find(d => d.id === digestId);
    if (!digest) {
      return false;
    }

    digest.status = 'viewed';
    return true;
  };

  const getDigest = (id: string): Digest | undefined => {
    return digests.value.find(d => d.id === id);
  };

  const getAllDigests = computed(() => digests.value);

  const getPendingDigests = computed(() => {
    return digests.value.filter(d => d.status === 'pending');
  });

  const getLatestDigest = computed(() => {
    if (digests.value.length === 0) {
      return null;
    }
    return digests.value[digests.value.length - 1];
  });

  const formatDigest = (digest: Digest): string => {
    const lines: string[] = [];

    lines.push(`📊 Notification Digest - ${digest.createdAt.toLocaleDateString()}`);
    lines.push('');
    lines.push(`Total: ${digest.summary.total} notifications (${digest.summary.unread} unread)`);
    lines.push('');

    if (mergedConfig.groupByType) {
      lines.push('By Type:');
      for (const [type, count] of Object.entries(digest.summary.byType)) {
        if (count > 0) {
          lines.push(`  ${type}: ${count}`);
        }
      }
      lines.push('');
    }

    if (digest.summary.topNotifications.length > 0) {
      lines.push('Priority Notifications:');
      for (const notification of digest.summary.topNotifications) {
        lines.push(`  • ${notification.title}: ${notification.message}`);
      }
    }

    return lines.join('\n');
  };

  const clearDigests = () => {
    digests.value = [];
  };

  // Auto-schedule when enabled
  watch(
    () => mergedConfig.enabled,
    enabled => {
      if (enabled) {
        scheduleNextDigest();
      } else if (digestTimer) {
        clearTimeout(digestTimer);
        digestTimer = null;
      }
    },
    { immediate: true },
  );

  // Cleanup on scope dispose
  onScopeDispose(() => {
    if (digestTimer) {
      clearTimeout(digestTimer);
      digestTimer = null;
    }
  });

  return {
    digests: getAllDigests,
    pendingDigests: getPendingDigests,
    latestDigest: getLatestDigest,
    createDigest,
    sendDigest,
    markDigestViewed,
    getDigest,
    formatDigest,
    clearDigests,
    getNextDigestTime,
  };
};
