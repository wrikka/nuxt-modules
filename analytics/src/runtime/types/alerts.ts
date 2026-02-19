export type AlertStatus = 'active' | 'paused' | 'triggered' | 'resolved' | 'acknowledged';

export interface Alert {
  id: string;
  name: string;
  type: AlertType;
  condition: AlertCondition;
  channels: AlertChannel[];
  enabled: boolean;
  status: AlertStatus;
  cooldown: number;
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type AlertType =
  | 'threshold'
  | 'anomaly'
  | 'trend'
  | 'goal'
  | 'error'
  | 'downtime';

export interface AlertCondition {
  metric: string;
  operator:
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'equals'
    | 'not_equals'
    | 'change_by'
    | 'greater_than'
    | 'less_than'
    | 'increased_by'
    | 'decreased_by';
  value: number;
  threshold?: number;
  timeframe: string;
  sensitivity?: 'low' | 'medium' | 'high';
  comparison?: 'previous_period' | 'same_period_last_year' | 'average';
}

export interface AlertChannel {
  type: ChannelType;
  config: Record<string, unknown>;
  enabled: boolean;
}

export type ChannelType =
  | 'email'
  | 'slack'
  | 'discord'
  | 'webhook'
  | 'sms'
  | 'push'
  | 'pagerduty';

export interface AlertNotification {
  id: string;
  alertId: string;
  triggeredAt: Date;
  value: number;
  threshold: number;
  message: string;
  channels: ChannelType[];
  status: 'pending' | 'sent' | 'failed' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  resolvedAt?: Date;
}

export interface AlertHistory {
  id?: string;
  alertId: string;
  triggeredAt?: Date;
  value?: number;
  channels?: ChannelType[];
  status?: 'pending' | 'sent' | 'failed' | 'acknowledged' | 'resolved';
  notifications: AlertNotification[];
  summary?: AlertSummary;
}

export interface AlertSummary {
  totalTriggers: number;
  avgResponseTime: number;
  acknowledgedRate: number;
  falsePositiveRate: number;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: AlertType;
  defaultCondition: AlertCondition;
  suggestedChannels: ChannelType[];
  severity: 'critical' | 'warning' | 'info';
}

export interface AlertConfig {
  enabled: boolean;
  maxAlerts: number;
  cooldownMinutes: number;
  escalationEnabled: boolean;
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  afterMinutes: number;
  escalateTo: ChannelType[];
  config: Record<string, unknown>;
}
