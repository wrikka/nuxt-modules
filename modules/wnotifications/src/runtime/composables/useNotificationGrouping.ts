import { computed } from 'vue';
import type { Notification, NotificationType } from '#notifications/types';
import { useNotifications } from './useNotifications';

export interface GroupingConfig {
  enabled: boolean;
  groupBy: 'type' | 'priority' | 'date' | 'source' | 'custom';
  customGroupKey?: string;
  maxGroupSize: number;
  showGroupCount: boolean;
  collapseThreshold: number;
}

export interface NotificationGroup {
  id: string;
  label: string;
  count: number;
  notifications: Notification[];
  latestNotification: Notification;
  isCollapsed: boolean;
  icon?: string;
  color?: string;
}

const defaultConfig: GroupingConfig = {
  enabled: true,
  groupBy: 'type',
  maxGroupSize: 10,
  showGroupCount: true,
  collapseThreshold: 3,
};

export const useNotificationGrouping = (config?: Partial<GroupingConfig>) => {
  const mergedConfig = { ...defaultConfig, ...config };

  const { notifications } = useNotifications();

  const groupLabels: Record<NotificationType, { label: string; icon: string; color: string; }> = {
    info: { label: 'Information', icon: 'i-heroicons-information-circle', color: 'blue' },
    success: { label: 'Success', icon: 'i-heroicons-check-circle', color: 'green' },
    warning: { label: 'Warnings', icon: 'i-heroicons-exclamation-triangle', color: 'yellow' },
    error: { label: 'Errors', icon: 'i-heroicons-x-circle', color: 'red' },
    system: { label: 'System', icon: 'i-heroicons-cog', color: 'gray' },
    message: { label: 'Messages', icon: 'i-heroicons-chat-bubble-left', color: 'purple' },
  };

  const priorityLabels: Record<string, { label: string; icon: string; color: string; }> = {
    urgent: { label: 'Urgent', icon: 'i-heroicons-fire', color: 'red' },
    high: { label: 'High Priority', icon: 'i-heroicons-arrow-up', color: 'orange' },
    normal: { label: 'Normal', icon: 'i-heroicons-minus', color: 'blue' },
    low: { label: 'Low Priority', icon: 'i-heroicons-arrow-down', color: 'gray' },
  };

  const groups = computed<NotificationGroup[]>(() => {
    if (!mergedConfig.enabled) {
      return [];
    }

    const groupMap = new Map<string, Notification[]>();

    for (const notification of notifications.value) {
      let groupKey: string;

      switch (mergedConfig.groupBy) {
        case 'type':
          groupKey = notification.type;
          break;
        case 'priority':
          groupKey = notification.priority;
          break;
        case 'date':
          groupKey = new Date(notification.createdAt).toDateString();
          break;
        case 'source':
          groupKey = notification.data?.source as string ?? 'unknown';
          break;
        case 'custom':
          groupKey = notification.data?.[mergedConfig.customGroupKey as string] as string ?? 'other';
          break;
        default:
          groupKey = notification.type;
      }

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }

      const groupNotifications = groupMap.get(groupKey)!;
      if (groupNotifications.length < mergedConfig.maxGroupSize) {
        groupNotifications.push(notification);
      }
    }

    const result: NotificationGroup[] = [];

    for (const [key, groupNotifications] of groupMap) {
      const sortedNotifications = groupNotifications.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      let labelInfo: { label: string; icon: string; color: string; };

      if (mergedConfig.groupBy === 'type') {
        labelInfo = groupLabels[key as NotificationType] ?? { label: key, icon: 'i-heroicons-bell', color: 'gray' };
      } else if (mergedConfig.groupBy === 'priority') {
        labelInfo = priorityLabels[key] ?? { label: key, icon: 'i-heroicons-bell', color: 'gray' };
      } else {
        labelInfo = { label: key, icon: 'i-heroicons-bell', color: 'gray' };
      }

      result.push({
        id: key,
        label: labelInfo.label,
        count: groupNotifications.length,
        notifications: sortedNotifications,
        latestNotification: sortedNotifications[0],
        isCollapsed: groupNotifications.length >= mergedConfig.collapseThreshold,
        icon: labelInfo.icon,
        color: labelInfo.color,
      });
    }

    return result.sort((a, b) => {
      const aTime = new Date(a.latestNotification.createdAt).getTime();
      const bTime = new Date(b.latestNotification.createdAt).getTime();
      return bTime - aTime;
    });
  });

  const groupedNotifications = computed(() => {
    if (!mergedConfig.enabled) {
      return notifications.value;
    }

    const result: Notification[] = [];

    for (const group of groups.value) {
      if (group.isCollapsed) {
        result.push({
          ...group.latestNotification,
          id: `group-${group.id}`,
          title: `${group.label} (${group.count})`,
          message: `${group.count} notifications`,
          data: {
            ...group.latestNotification.data,
            _isGroup: true,
            _groupCount: group.count,
            _groupNotifications: group.notifications,
          },
        });
      } else {
        result.push(...group.notifications);
      }
    }

    return result;
  });

  const ungroupedCount = computed(() => {
    if (!mergedConfig.enabled) {
      return notifications.value.length;
    }

    return groups.value.reduce((sum: number, group: NotificationGroup) => {
      if (group.isCollapsed) {
        return sum + 1;
      }
      return sum + group.notifications.length;
    }, 0);
  });

  const getGroupById = (id: string): NotificationGroup | undefined => {
    return groups.value.find((g: NotificationGroup) => g.id === id);
  };

  const getNotificationsByGroup = (groupId: string): Notification[] => {
    const group = getGroupById(groupId);
    return group?.notifications ?? [];
  };

  return {
    groups,
    groupedNotifications,
    ungroupedCount,
    getGroupById,
    getNotificationsByGroup,
  };
};
