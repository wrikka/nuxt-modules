export interface AnalyticsEvent {
  name: string;
  category: 'flag' | 'experiment' | 'evaluation';
  action: string;
  timestamp: number;
  data?: Record<string, unknown>;
  context?: {
    userId?: string;
    sessionId?: string;
    attributes?: Record<string, unknown>;
  };
}

export interface AnalyticsProvider {
  name: string;
  track(event: AnalyticsEvent): Promise<void>;
  identify?(userId: string, traits?: Record<string, unknown>): Promise<void>;
  group?(groupId: string, traits?: Record<string, unknown>): Promise<void>;
}

export interface AnalyticsConfig {
  enabled: boolean;
  providers: string[];
  trackEvaluations: boolean;
  trackExperiments: boolean;
  trackChanges: boolean;
}

export interface FlagUsageStats {
  flagKey: string;
  evaluations: number;
  enabledCount: number;
  disabledCount: number;
  lastEvaluated: number;
}

export interface ExperimentStats {
  experimentId: string;
  variantId: string;
  participants: number;
  conversions: number;
  conversionRate: number;
}
