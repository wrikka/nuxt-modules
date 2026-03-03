import type { WebhookEvent } from '#webhooks/types';

export interface TransformRule {
  id: string;
  name: string;
  provider?: string;
  eventTypes: string[];
  priority: number;
  enabled: boolean;
  transform: (event: WebhookEvent) => WebhookEvent;
}

const transformRules: TransformRule[] = [];

export const registerTransformRule = (rule: TransformRule) => {
  const existingIndex = transformRules.findIndex(r => r.id === rule.id);
  if (existingIndex > -1) {
    transformRules[existingIndex] = rule;
  } else {
    transformRules.push(rule);
  }
  // Sort by priority (higher priority first)
  transformRules.sort((a, b) => b.priority - a.priority);
};

export const unregisterTransformRule = (ruleId: string) => {
  const index = transformRules.findIndex(r => r.id === ruleId);
  if (index > -1) {
    transformRules.splice(index, 1);
  }
};

export const applyTransforms = (event: WebhookEvent): WebhookEvent => {
  let transformedEvent = event;

  for (const rule of transformRules) {
    if (!rule.enabled) continue;
    if (rule.provider && rule.provider !== event.provider) continue;
    if (rule.eventTypes.length > 0 && !rule.eventTypes.includes(event.type)) continue;

    try {
      transformedEvent = rule.transform(transformedEvent);
    } catch {
      // If transform fails, continue with previous state
    }
  }

  return transformedEvent;
};

export const getTransformRules = (): TransformRule[] => {
  return [...transformRules];
};

// Built-in transforms
export const addTimestampTransform: TransformRule = {
  id: 'add-timestamp',
  name: 'Add Processing Timestamp',
  eventTypes: [],
  priority: 0,
  enabled: true,
  transform: event => ({
    ...event,
    data: {
      ...event.data,
      _processedAt: new Date().toISOString(),
    },
  }),
};

export const normalizeStripeEventTransform: TransformRule = {
  id: 'normalize-stripe',
  name: 'Normalize Stripe Event',
  provider: 'stripe',
  eventTypes: [],
  priority: 10,
  enabled: true,
  transform: event => {
    const data = event.data as { object?: Record<string, unknown>; };
    return {
      ...event,
      data: {
        ...data,
        _normalized: true,
        _resourceType: data.object?.object ?? 'unknown',
      },
    };
  },
};

// Register built-in transforms
registerTransformRule(addTimestampTransform);
registerTransformRule(normalizeStripeEventTransform);
