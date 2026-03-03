import { createError, defineEventHandler, getRouterParam, type H3Event } from 'h3';

// In-memory store for demo
declare global {
  // eslint-disable-next-line no-var
  var notificationStore: Array<{ id: string; read: boolean; }>;
}

if (!globalThis.notificationStore) {
  globalThis.notificationStore = [];
}

export default defineEventHandler((event: H3Event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Notification ID is required',
    });
  }

  const notification = globalThis.notificationStore.find(n => n.id === id);

  if (!notification) {
    throw createError({
      statusCode: 404,
      message: 'Notification not found',
    });
  }

  notification.read = true;

  return { success: true };
});
