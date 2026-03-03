import type { WebhookEvent } from '#webhooks/types';

export interface AlertConfig {
  id: string;
  name: string;
  enabled: boolean;
  conditions: AlertCondition[];
  channels: AlertChannel[];
  cooldown: number; // minutes between alerts
}

export interface AlertCondition {
  field: 'provider' | 'type' | 'error' | 'retryCount';
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte';
  value: string | number;
}

export interface AlertChannel {
  type: 'slack' | 'discord' | 'email' | 'webhook';
  config: {
    webhookUrl?: string;
    url?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}

interface AlertState {
  lastSent: number;
}

const alertStates = new Map<string, AlertState>();

export const checkAlertConditions = (event: WebhookEvent, config: AlertConfig): boolean => {
  for (const condition of config.conditions) {
    const fieldValue = event[condition.field];
    let matches = false;

    switch (condition.operator) {
      case 'equals':
        matches = fieldValue === condition.value;
        break;
      case 'contains':
        matches = String(fieldValue).includes(String(condition.value));
        break;
      case 'gt':
        matches = Number(fieldValue) > Number(condition.value);
        break;
      case 'lt':
        matches = Number(fieldValue) < Number(condition.value);
        break;
      case 'gte':
        matches = Number(fieldValue) >= Number(condition.value);
        break;
      case 'lte':
        matches = Number(fieldValue) <= Number(condition.value);
        break;
    }

    if (!matches) return false;
  }

  return true;
};

export const shouldSendAlert = (config: AlertConfig): boolean => {
  const state = alertStates.get(config.id);
  if (!state) return true;

  const now = Date.now();
  const cooldownMs = config.cooldown * 60 * 1000;
  return now - state.lastSent > cooldownMs;
};

export const markAlertSent = (configId: string) => {
  alertStates.set(configId, { lastSent: Date.now() });
};

export const sendAlert = async (event: WebhookEvent, channel: AlertChannel): Promise<boolean> => {
  const { type, config } = channel;

  try {
    switch (type) {
      case 'slack': {
        if (!config.webhookUrl) return false;
        const response = await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `Webhook Alert: ${event.provider} - ${event.type}`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Webhook Failed*\nProvider: ${event.provider}\nType: ${event.type}\nError: ${
                    event.error ?? 'Unknown'
                  }`,
                },
              },
            ],
          }),
        });
        return response.ok;
      }

      case 'discord': {
        if (!config.webhookUrl) return false;
        const response = await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `⚠️ Webhook Alert: ${event.provider} - ${event.type}`,
            embeds: [
              {
                title: 'Webhook Failed',
                fields: [
                  { name: 'Provider', value: event.provider, inline: true },
                  { name: 'Type', value: event.type, inline: true },
                  { name: 'Error', value: event.error ?? 'Unknown' },
                ],
                color: 15158332, // Red
              },
            ],
          }),
        });
        return response.ok;
      }

      case 'email': {
        // Would integrate with email service
        // For now, just log
        return true;
      }

      case 'webhook': {
        if (!config.url) return false;
        const response = await fetch(config.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'webhook_alert',
            data: event,
          }),
        });
        return response.ok;
      }

      default:
        return false;
    }
  } catch {
    return false;
  }
};

export const processAlerts = async (event: WebhookEvent, configs: AlertConfig[]): Promise<void> => {
  for (const config of configs) {
    if (!config.enabled) continue;
    if (!checkAlertConditions(event, config)) continue;
    if (!shouldSendAlert(config)) continue;

    for (const channel of config.channels) {
      const success = await sendAlert(event, channel);
      if (success) {
        markAlertSent(config.id);
      }
    }
  }
};

// Default alert configs
export const defaultAlertConfigs: AlertConfig[] = [
  {
    id: 'failed-webhook-alert',
    name: 'Failed Webhook Alert',
    enabled: true,
    conditions: [
      { field: 'error', operator: 'contains', value: '' }, // Any error
    ],
    channels: [],
    cooldown: 5,
  },
  {
    id: 'high-retry-count',
    name: 'High Retry Count Alert',
    enabled: true,
    conditions: [
      { field: 'retryCount', operator: 'gte', value: 3 },
    ],
    channels: [],
    cooldown: 15,
  },
];
