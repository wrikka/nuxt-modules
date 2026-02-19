export interface FeatureFlag {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  variants?: FlagVariant[];
  targeting?: TargetingRule[];
  rollout?: RolloutConfig;
}

export interface FlagVariant {
  name: string;
  value: unknown;
  weight?: number;
}

export interface TargetingRule {
  attribute: string;
  operator: TargetingOperator;
  value: string | number | string[] | number[];
}

export type TargetingOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'in'
  | 'not_in';

export interface RolloutConfig {
  type: 'percentage' | 'gradual';
  percentage: number;
  stickiness?: 'userId' | 'sessionId' | 'random';
}

export interface FlagEvaluationContext {
  userId?: string;
  sessionId?: string;
  attributes?: Record<string, unknown>;
}

export interface FlagEvaluationResult {
  flag: string;
  enabled: boolean;
  variant?: string;
  value?: unknown;
  reason: EvaluationReason;
}

export type EvaluationReason =
  | 'TARGET_MATCH'
  | 'PERCENTAGE_ROLLOUT'
  | 'DEFAULT'
  | 'OFF'
  | 'ERROR';
