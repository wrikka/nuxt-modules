import { computed, ref } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import type { Notification, NotificationPreferences, NotificationsConfig } from '#notifications/types';

export const useNotifications = () => {
  const config = useRuntimeConfig();
  const notificationsConfig = config.public.notifications as NotificationsConfig;

  const notifications = ref<Notification[]>([]);
  const preferences = ref<NotificationPreferences>({
    enabled: true,
    channels: {
      inApp: true,
      email: false,
      push: false,
    },
    types: {},
  });

  const unreadCount = computed(() => notifications.value.filter((n: Notification) => !n.read).length);
  const isDebugEnabled = computed(() => notificationsConfig.debug);

  const add = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      read: false,
      createdAt: new Date(),
      channel: notification.channel ?? 'in-app',
      priority: notification.priority ?? 'normal',
    };

    notifications.value.unshift(newNotification);

    if (notificationsConfig.persistence === 'localStorage' && import.meta.client) {
      try {
        const stored = JSON.parse(localStorage.getItem('notifications') ?? '[]');
        stored.unshift(newNotification);
        localStorage.setItem('notifications', JSON.stringify(stored.slice(0, 100)));
      } catch {
        // Storage not available
      }
    }

    if (isDebugEnabled.value) {
      console.log('[Notifications] Added:', newNotification);
    }

    return newNotification;
  };

  const remove = (id: string) => {
    const index = notifications.value.findIndex((n: Notification) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }

    if (notificationsConfig.persistence === 'localStorage' && import.meta.client) {
      try {
        const stored = JSON.parse(localStorage.getItem('notifications') ?? '[]');
        const filtered = stored.filter((n: Notification) => n.id !== id);
        localStorage.setItem('notifications', JSON.stringify(filtered));
      } catch {
        // Storage not available
      }
    }
  };

  const markAsRead = async (id: string) => {
    const notification = notifications.value.find((n: Notification) => n.id === id);
    if (notification) {
      notification.read = true;
    }

    try {
      await $fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Notifications] Error marking as read:', error);
      }
    }
  };

  const markAllAsRead = () => {
    for (const notification of notifications.value) {
      notification.read = true;
    }

    if (notificationsConfig.persistence === 'localStorage' && import.meta.client) {
      try {
        const stored = JSON.parse(localStorage.getItem('notifications') ?? '[]');
        for (const n of stored) {
          n.read = true;
        }
        localStorage.setItem('notifications', JSON.stringify(stored));
      } catch {
        // Storage not available
      }
    }
  };

  const clearAll = () => {
    notifications.value = [];

    if (notificationsConfig.persistence === 'localStorage' && import.meta.client) {
      try {
        localStorage.removeItem('notifications');
      } catch {
        // Storage not available
      }
    }
  };

  const loadFromStorage = () => {
    if (notificationsConfig.persistence !== 'localStorage' || !import.meta.client) {
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem('notifications') ?? '[]');
      notifications.value = stored;
    } catch {
      // Storage not available
    }
  };

  const fetchNotifications = async () => {
    try {
      const result = await $fetch<Notification[]>('/api/notifications');
      notifications.value = result;
      return result;
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Notifications] Error fetching:', error);
      }
      return [];
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    preferences.value = { ...preferences.value, ...newPreferences };

    try {
      await $fetch('/api/notifications/preferences', {
        method: 'PUT',
        body: newPreferences,
      });
    } catch (error) {
      if (isDebugEnabled.value) {
        console.error('[Notifications] Error updating preferences:', error);
      }
    }
  };

  // Quick notification helpers
  const notify = {
    info: (title: string, message: string, options?: Partial<Notification>) =>
      add({ type: 'info', title, message, channel: 'in-app', priority: 'normal', ...options }),
    success: (title: string, message: string, options?: Partial<Notification>) =>
      add({ type: 'success', title, message, channel: 'in-app', priority: 'normal', ...options }),
    warning: (title: string, message: string, options?: Partial<Notification>) =>
      add({ type: 'warning', title, message, channel: 'in-app', priority: 'high', ...options }),
    error: (title: string, message: string, options?: Partial<Notification>) =>
      add({ type: 'error', title, message, channel: 'in-app', priority: 'urgent', ...options }),
  };

  return {
    notifications,
    preferences,
    unreadCount,
    add,
    remove,
    markAsRead,
    markAllAsRead,
    clearAll,
    loadFromStorage,
    fetchNotifications,
    updatePreferences,
    notify,
  };
};
