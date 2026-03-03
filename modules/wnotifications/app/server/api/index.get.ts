import { defineEventHandler, getQuery, type H3Event } from 'h3';
import type { Notification } from '#notifications/types';

// In-memory store for demo - use database in production
const notificationStore: Notification[] = [];

export default defineEventHandler((event: H3Event) => {
  const query = getQuery(event);

  let notifications = [...notificationStore];

  // Filter by read status
  if (query.read !== undefined) {
    const isRead = query.read === 'true';
    notifications = notifications.filter(n => n.read === isRead);
  }

  // Filter by type
  if (query.type) {
    notifications = notifications.filter(n => n.type === query.type);
  }

  // Limit results
  const limit = Number(query.limit) || 50;
  notifications = notifications.slice(0, limit);

  return notifications;
});
