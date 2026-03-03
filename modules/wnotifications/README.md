# @wrikka/notifications

Nuxt module for notification management with multi-channel support.

## Features

- Multi-channel support (In-App, Email, Push)
- Notification preferences
- Persistence options (memory, localStorage, database)
- Real-time support
- Priority levels
- Auto-expiration

## Installation

```bash
bun add @wrikka/notifications
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/notifications'],
  notifications: {
    enabled: true,
    channels: {
      inApp: {
        enabled: true,
        position: 'top-right',
        maxVisible: 5,
      },
      email: {
        enabled: true,
        provider: 'resend',
      },
    },
    persistence: 'localStorage',
    realtime: false,
    debug: false,
  },
});
```

## Usage

### Add Notifications

```typescript
const { notify } = useNotifications();

// Quick helpers
notify.success('Success!', 'Your changes have been saved');
notify.error('Error', 'Something went wrong');
notify.warning('Warning', 'Please review your input');
notify.info('Info', 'New feature available');

// Full control
const { add } = useNotifications();
add({
  type: 'success',
  title: 'Payment received',
  message: 'Your payment of $99 has been processed',
  url: '/billing',
  priority: 'high',
  data: { amount: 99, currency: 'USD' },
});
```

### Manage Notifications

```typescript
const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
  useNotifications();

// Get unread count
console.log('Unread:', unreadCount.value);

// Mark single as read
await markAsRead('notif_123');

// Mark all as read
markAllAsRead();

// Clear all
clearAll();
```

### Preferences

```typescript
const { preferences, updatePreferences } = useNotifications();

// Update preferences
await updatePreferences({
  channels: {
    inApp: true,
    email: true,
    push: false,
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
});
```

## License

MIT
