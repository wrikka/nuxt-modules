import { defineEventHandler, type H3Event, readBody } from 'h3';

interface MetricEvent {
  experimentId: string;
  variantId: string;
  metricKey: string;
  value: number;
  context?: {
    userId?: string;
    sessionId?: string;
    attributes?: Record<string, unknown>;
  };
}

// In-memory storage for metrics (in production, use database)
const metricsStore: Map<string, Array<{ variantId: string; metricKey: string; value: number; timestamp: number; }>> =
  new Map();

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<MetricEvent>(event);
  const { experimentId, variantId, metricKey, value } = body;

  // Store metric
  const key = `${experimentId}:${metricKey}`;
  const existing = metricsStore.get(key) ?? [];
  existing.push({
    variantId,
    metricKey,
    value,
    timestamp: Date.now(),
  });
  metricsStore.set(key, existing);

  return { success: true };
});

export function getMetrics(experimentId: string): Map<string, Array<{ variantId: string; value: number; }>> {
  const result = new Map<string, Array<{ variantId: string; value: number; }>>();

  for (const [key, events] of metricsStore) {
    if (key.startsWith(experimentId)) {
      const metricKey = key.split(':')[1];
      result.set(metricKey, events.map(e => ({ variantId: e.variantId, value: e.value })));
    }
  }

  return result;
}
