import { defineEventHandler, getQuery, type H3Event } from 'h3';
import type { WebhookEvent } from '#webhooks/types';

// In-memory store for demo - use database in production
const eventStore: WebhookEvent[] = [];

export default defineEventHandler((event: H3Event) => {
  const query = getQuery(event);

  let events = [...eventStore];

  // Filter by provider
  if (query.provider) {
    events = events.filter(e => e.provider === query.provider);
  }

  // Filter by type
  if (query.type) {
    events = events.filter(e => e.type === query.type);
  }

  // Limit results
  const limit = Number(query.limit) || 50;
  events = events.slice(0, limit);

  return events;
});
