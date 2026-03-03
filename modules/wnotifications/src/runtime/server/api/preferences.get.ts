import { defineEventHandler } from 'h3';
import type { NotificationPreferences } from '#notifications/types';

// In-memory store for demo
let preferences: NotificationPreferences = {
  enabled: true,
  channels: {
    inApp: true,
    email: false,
    push: false,
  },
  types: {},
};

export default defineEventHandler(() => {
  return preferences;
});
