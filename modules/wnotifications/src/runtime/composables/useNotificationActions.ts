import { ref } from 'vue';
import type { Notification, NotificationAction, NotificationActionHandler } from '#notifications/types';
import { useNotifications } from './useNotifications';
import { navigateTo } from 'nuxt/app';

export interface ActionsConfig {
  maxActions: number;
  showIcons: boolean;
  closeOnAction: boolean;
}

const defaultConfig: ActionsConfig = {
  maxActions: 3,
  showIcons: true,
  closeOnAction: true,
};

const actionHandlers = new Map<string, NotificationActionHandler>();

export const useNotificationActions = (config?: Partial<ActionsConfig>) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const loadingActions = ref<Set<string>>(new Set());

  const { remove } = useNotifications();

  const registerHandler = (actionId: string, handler: NotificationActionHandler) => {
    actionHandlers.set(actionId, handler);

    return () => {
      actionHandlers.delete(actionId);
    };
  };

  const unregisterHandler = (actionId: string) => {
    actionHandlers.delete(actionId);
  };

  const executeAction = async (action: NotificationAction, notification: Notification) => {
    if (action.disabled || loadingActions.value.has(action.id)) {
      return false;
    }

    loadingActions.value.add(action.id);

    try {
      // If URL is provided, navigate to it
      if (action.url) {
        await navigateTo(action.url);
      }

      // Execute custom onClick handler
      if (action.onClick) {
        await action.onClick(notification);
      }

      // Execute registered handler
      const handler = actionHandlers.get(action.id);
      if (handler) {
        await handler(action, notification);
      }

      // Close notification if configured
      if (action.closeOnClick ?? mergedConfig.closeOnAction) {
        remove(notification.id);
      }

      return true;
    } catch (error) {
      console.error('[Notifications] Action execution failed:', error);
      return false;
    } finally {
      loadingActions.value.delete(action.id);
    }
  };

  const isActionLoading = (actionId: string) => {
    return loadingActions.value.has(actionId);
  };

  const getAvailableActions = (notification: Notification): NotificationAction[] => {
    const actions = notification.data?.actions as NotificationAction[] | undefined;
    if (!actions) {
      return [];
    }

    return actions.slice(0, mergedConfig.maxActions);
  };

  return {
    registerHandler,
    unregisterHandler,
    executeAction,
    isActionLoading,
    getAvailableActions,
    loadingActions,
  };
};
