import { useRuntimeConfig } from '#imports';
import { computed, ref } from 'vue';
import type {
  Alert,
  AlertChannel,
  AlertCondition,
  AlertConfig,
  AlertHistory,
  AlertStatus,
  AlertType,
} from '#analytics/types';
import type { AnalyticsConfig } from '#analytics/types/config';

export const useAlerts = () => {
  const config = useRuntimeConfig();
  const analyticsConfig = config.public.analytics as AnalyticsConfig;
  const alertConfig = analyticsConfig.alerts as AlertConfig;

  const alerts = ref<Alert[]>([]);
  const history = ref<AlertHistory[]>([]);
  const isLoading = ref(false);

  const isEnabled = computed(() => alertConfig.enabled);

  const createAlert = (
    name: string,
    type: AlertType,
    condition: AlertCondition,
    channels: AlertChannel[],
  ): Alert | null => {
    if (!isEnabled.value) return null;
    if (alerts.value.length >= alertConfig.maxAlerts) return null;

    const alert: Alert = {
      id: crypto.randomUUID(),
      name,
      type,
      condition,
      channels,
      enabled: true,
      status: 'active',
      cooldown: alertConfig.cooldownMinutes * 60 * 1000,
      triggerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    alerts.value.push(alert);
    return alert;
  };

  const updateAlert = (alertId: string, updates: Partial<Alert>): Alert | null => {
    const alert = alerts.value.find(a => a.id === alertId);
    if (!alert) return null;

    Object.assign(alert, updates, { updatedAt: new Date() });
    return alert;
  };

  const deleteAlert = (alertId: string): boolean => {
    const index = alerts.value.findIndex(a => a.id === alertId);
    if (index === -1) return false;

    alerts.value.splice(index, 1);
    return true;
  };

  const getAlert = (alertId: string): Alert | undefined => {
    return alerts.value.find(a => a.id === alertId);
  };

  const pauseAlert = (alertId: string): boolean => {
    const alert = alerts.value.find(a => a.id === alertId);
    if (!alert) return false;

    alert.status = 'paused';
    return true;
  };

  const resumeAlert = (alertId: string): boolean => {
    const alert = alerts.value.find(a => a.id === alertId);
    if (!alert) return false;

    alert.status = 'active';
    return true;
  };

  const checkConditions = async (): Promise<void> => {
    const activeAlerts = alerts.value.filter(a => a.status === 'active');

    for (const alert of activeAlerts) {
      const shouldTrigger = await evaluateCondition(alert.condition);

      if (shouldTrigger) {
        const lastTriggered = alert.lastTriggered;
        const cooldownExpired = !lastTriggered
          || (Date.now() - lastTriggered.getTime()) > alert.cooldown;

        if (cooldownExpired) {
          await triggerAlert(alert);
        }
      }
    }
  };

  const evaluateCondition = async (condition: AlertCondition): Promise<boolean> => {
    // Mock evaluation - would check actual metrics
    const currentValue = Math.random() * 100;
    const threshold = condition.threshold ?? condition.value;

    switch (condition.operator) {
      case 'greater_than':
      case 'gt':
        return currentValue > threshold;
      case 'less_than':
      case 'lt':
        return currentValue < threshold;
      case 'equals':
        return currentValue === threshold;
      case 'not_equals':
        return currentValue !== threshold;
      case 'gte':
        return currentValue >= threshold;
      case 'lte':
        return currentValue <= threshold;
      case 'increased_by':
      case 'change_by':
        return true; // Would compare with previous period
      case 'decreased_by':
        return true; // Would compare with previous period
      default:
        return false;
    }
  };

  const triggerAlert = async (alert: Alert): Promise<void> => {
    alert.lastTriggered = new Date();
    alert.triggerCount = (alert.triggerCount ?? 0) + 1;

    // Send to all channels
    for (const channel of alert.channels) {
      await sendToChannel(alert, channel);
    }

    // Log to history
    const historyEntry: AlertHistory = {
      id: crypto.randomUUID(),
      alertId: alert.id,
      triggeredAt: new Date(),
      value: 0,
      channels: alert.channels.map(c => c.type),
      status: 'sent',
      notifications: [],
    };

    history.value.unshift(historyEntry);

    // Handle escalation
    if (alertConfig.escalationEnabled) {
      await handleEscalation(alert);
    }
  };

  const sendToChannel = async (alert: Alert, channel: AlertChannel): Promise<void> => {
    switch (channel.type) {
      case 'email':
        await sendEmail(alert, channel);
        break;
      case 'slack':
        await sendSlack(alert, channel);
        break;
      case 'discord':
        await sendDiscord(alert, channel);
        break;
      case 'webhook':
        await sendWebhook(alert, channel);
        break;
      case 'sms':
        await sendSMS(alert, channel);
        break;
      case 'push':
        await sendPush(alert, channel);
        break;
    }
  };

  const sendEmail = async (_alert: Alert, _channel: AlertChannel): Promise<void> => {
    // Would send email via backend
  };

  const sendSlack = async (_alert: Alert, _channel: AlertChannel): Promise<void> => {
    // Would send Slack message via webhook
  };

  const sendDiscord = async (_alert: Alert, _channel: AlertChannel): Promise<void> => {
    // Would send Discord message via webhook
  };

  const sendWebhook = async (_alert: Alert, _channel: AlertChannel): Promise<void> => {
    // Would POST to webhook URL
  };

  const sendSMS = async (_alert: Alert, _channel: AlertChannel): Promise<void> => {
    // Would send SMS via provider
  };

  const sendPush = async (_alert: Alert, _channel: AlertChannel): Promise<void> => {
    // Would send push notification
  };

  const handleEscalation = async (alert: Alert): Promise<void> => {
    const lastTriggered = alert.lastTriggered;
    if (!lastTriggered) return;

    const minutesSinceTrigger = (Date.now() - lastTriggered.getTime()) / (60 * 1000);

    for (const rule of alertConfig.escalationRules) {
      if (minutesSinceTrigger >= rule.afterMinutes) {
        for (const channelType of rule.escalateTo) {
          const channel: AlertChannel = {
            type: channelType,
            config: rule.config,
            enabled: true,
          };
          await sendToChannel(alert, channel);
        }
      }
    }
  };

  const acknowledgeAlert = (alertId: string): boolean => {
    const alert = alerts.value.find(a => a.id === alertId);
    if (!alert) return false;

    alert.status = 'acknowledged';
    return true;
  };

  const resolveAlert = (alertId: string): boolean => {
    const alert = alerts.value.find(a => a.id === alertId);
    if (!alert) return false;

    alert.status = 'resolved';
    return true;
  };

  const getAlertsByStatus = (status: AlertStatus): Alert[] => {
    return alerts.value.filter(a => a.status === status);
  };

  const getAlertsByType = (type: AlertType): Alert[] => {
    return alerts.value.filter(a => a.type === type);
  };

  const getRecentHistory = (limit: number = 50): AlertHistory[] => {
    return history.value.slice(0, limit);
  };

  return {
    alerts,
    history,
    isLoading,
    isEnabled,
    createAlert,
    updateAlert,
    deleteAlert,
    getAlert,
    pauseAlert,
    resumeAlert,
    checkConditions,
    acknowledgeAlert,
    resolveAlert,
    getAlertsByStatus,
    getAlertsByType,
    getRecentHistory,
  };
};
