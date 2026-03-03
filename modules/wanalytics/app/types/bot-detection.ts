import type { DateRange } from './common';

export interface BotDetection {
  id: string;
  type: BotType;
  name: string;
  confidence: number;
  indicators: BotIndicator[];
  timestamp: Date;
  ip: string;
  userAgent: string;
  url: string;
}

export type BotType =
  | 'crawler'
  | 'scraper'
  | 'spambot'
  | 'hackbot'
  | 'good_bot'
  | 'unknown';

export interface BotIndicator {
  type: BotIndicatorType;
  value: unknown;
  weight: number;
}

export type BotIndicatorType =
  | 'user_agent'
  | 'ip_reputation'
  | 'behavior_pattern'
  | 'request_frequency'
  | 'headless_browser'
  | 'mouse_movement'
  | 'timing_pattern'
  | 'javascript_disabled';

export interface BotFilter {
  enabled: boolean;
  mode: 'block' | 'flag' | 'allow';
  goodBots: string[];
  badBots: string[];
  customRules: BotRule[];
}

export interface BotRule {
  id: string;
  name: string;
  type: 'allow' | 'block' | 'flag';
  conditions: BotCondition[];
  priority: number;
}

export interface BotCondition {
  field: 'user_agent' | 'ip' | 'country' | 'asn' | 'behavior';
  operator: 'equals' | 'contains' | 'matches' | 'in_list';
  value: unknown;
}

export interface BotStatistics {
  period: DateRange;
  totalRequests: number;
  botRequests: number;
  botPercentage: number;
  blockedRequests: number;
  byType: Record<BotType, number>;
  topBots: BotSummary[];
  trends: BotTrend[];
}

export interface BotSummary {
  name: string;
  type: BotType;
  requests: number;
  percentage: number;
  blocked: boolean;
}

export interface BotTrend {
  date: Date;
  totalRequests: number;
  botRequests: number;
  botPercentage: number;
}

export interface BotDetectionConfig {
  enabled: boolean;
  mode: 'passive' | 'active' | 'aggressive';
  mlModel: boolean;
  blockThreshold: number;
  flagThreshold: number;
  whitelist: string[];
  blacklist: string[];
}
