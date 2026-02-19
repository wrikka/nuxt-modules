import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";
export const useAppStore = defineStore("app", () => {
  const isLoading = ref(false);
  const notifications = ref([]);
  const setLoading = (loading) => {
    isLoading.value = loading;
  };
  const addNotification = (notification) => {
    const id = Date.now().toString();
    notifications.value.push({
      ...notification,
      id
    });
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5e3);
    }
    return id;
  };
  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };
  const clearNotifications = () => {
    notifications.value = [];
  };
  const hasNotifications = computed(() => notifications.value.length > 0);
  return {
    // State
    isLoading: readonly(isLoading),
    notifications: readonly(notifications),
    // Getters
    hasNotifications,
    // Actions
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications
  };
});
