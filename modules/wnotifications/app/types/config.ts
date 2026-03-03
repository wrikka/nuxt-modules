import type { EmailChannelConfig, InAppChannelConfig, PushChannelConfig } from './channel';

export interface NotificationsConfig {
  enabled: boolean;
  channels: {
    inApp: InAppChannelConfig;
    email?: EmailChannelConfig;
    push?: PushChannelConfig;
  };
  persistence: 'memory' | 'localStorage' | 'database';
  realtime: boolean;
  debug: boolean;
}

export interface NotificationsRuntimeConfig {
  public: {
    notifications: NotificationsConfig;
  };
}
