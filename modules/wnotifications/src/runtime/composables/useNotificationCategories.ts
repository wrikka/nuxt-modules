import { ref } from 'vue';
import type { Notification } from '../types';
import type { CategoryConfig, NotificationCategory } from '../types/categories';

export const useNotificationCategories = () => {
  const config = ref<CategoryConfig>({
    enabled: true,
    categories: [
      {
        id: 'alerts',
        name: 'Alerts',
        icon: 'i-heroicons-bell',
        color: 'red',
        types: ['error', 'warning'],
        priority: 'urgent',
        description: 'Important alerts and warnings',
      },
      {
        id: 'updates',
        name: 'Updates',
        icon: 'i-heroicons-information-circle',
        color: 'blue',
        types: ['info', 'system'],
        priority: 'normal',
        description: 'System updates and information',
      },
      {
        id: 'messages',
        name: 'Messages',
        icon: 'i-heroicons-chat-bubble-left',
        color: 'purple',
        types: ['message'],
        priority: 'normal',
        description: 'Direct messages and communications',
      },
      {
        id: 'success',
        name: 'Success',
        icon: 'i-heroicons-check-circle',
        color: 'green',
        types: ['success'],
        priority: 'low',
        description: 'Success notifications and confirmations',
      },
    ],
    defaultCategory: 'updates',
  });

  const getCategoryForNotification = (notification: Notification): NotificationCategory => {
    const category = config.value.categories.find(cat =>
      cat.types?.includes(notification.type)
      || (cat.priority && cat.priority === notification.priority)
    );

    return category || config.value.categories[0];
  };

  const getCategories = () => {
    return config.value.categories;
  };

  const getCategoryById = (id: string): NotificationCategory | undefined => {
    return config.value.categories.find(cat => cat.id === id);
  };

  const addCategory = (category: NotificationCategory) => {
    config.value.categories.push(category);
  };

  const updateCategory = (id: string, updates: Partial<NotificationCategory>) => {
    const index = config.value.categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      config.value.categories[index] = { ...config.value.categories[index], ...updates };
    }
  };

  const deleteCategory = (id: string) => {
    config.value.categories = config.value.categories.filter(cat => cat.id !== id);
  };

  const groupNotificationsByCategory = (notifications: Notification[]): Record<string, Notification[]> => {
    const grouped: Record<string, Notification[]> = {};

    notifications.forEach(notification => {
      const category = getCategoryForNotification(notification);
      if (!grouped[category.id]) {
        grouped[category.id] = [];
      }
      grouped[category.id].push(notification);
    });

    return grouped;
  };

  return {
    config,
    getCategoryForNotification,
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    groupNotificationsByCategory,
  };
};
