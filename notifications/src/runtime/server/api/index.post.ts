import { defineEventHandler, type H3Event, readBody } from 'h3';
import type { Notification } from '#notifications/types';

// In-memory store for demo
const notificationStore: Notification[] = [];

interface CreateNotificationInput {
  type: Notification['type'];
  title: string;
  message: string;
  url?: string;
  data?: Record<string, unknown>;
  priority?: Notification['priority'];
  channel?: Notification['channel'];
}

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<CreateNotificationInput>(event);

  if (!body) {
    throw new Error('Body is required');
  }

  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: body.type ?? 'info',
    title: body.title,
    message: body.message,
    url: body.url,
    data: body.data,
    priority: body.priority ?? 'normal',
    channel: body.channel ?? 'in-app',
    read: false,
    createdAt: new Date(),
  };

  notificationStore.unshift(notification);

  return notification;
});
