export type FlagEventType =
  | 'flag:created'
  | 'flag:updated'
  | 'flag:deleted'
  | 'flags:sync';

export interface FlagEvent {
  type: FlagEventType;
  timestamp: number;
  data: {
    key?: string;
    enabled?: boolean;
    flags?: Record<string, boolean>;
  };
}

export interface SSEConfig {
  enabled: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}
