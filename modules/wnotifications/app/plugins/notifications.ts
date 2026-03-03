import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { useNotifications } from '#notifications/composables';
import type { NotificationsConfig } from '#notifications/types';

export default defineNuxtPlugin({
  name: 'notifications',
  setup() {
    const config = useRuntimeConfig();
    const notificationsConfig = config.public.notifications as NotificationsConfig;
    const { loadFromStorage, fetchNotifications } = useNotifications();

    // Load from storage on client
    if (import.meta.client && notificationsConfig.persistence === 'localStorage') {
      loadFromStorage();
    }

    // Fetch from server if using database persistence
    if (notificationsConfig.persistence === 'database') {
      void fetchNotifications();
    }
  },
});
