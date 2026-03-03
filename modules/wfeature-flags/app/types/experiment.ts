export interface Experiment {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  variants: ExperimentVariant[];
  targeting?: ExperimentTargeting;
  metrics?: ExperimentMetric[];
  startDate?: number;
  endDate?: number;
}

export interface ExperimentVariant {
  id: string;
  key: string;
  name: string;
  weight: number;
  isControl: boolean;
  payload?: unknown;
}

export interface ExperimentTargeting {
  conditions: TargetingCondition[];
  percentage: number;
}

export interface TargetingCondition {
  attribute: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in';
  value: unknown;
}

export interface ExperimentMetric {
  key: string;
  name: string;
  type: 'primary' | 'secondary';
  aggregation: 'sum' | 'avg' | 'count' | 'conversion';
}

export interface ExperimentResult {
  experimentId: string;
  variantId: string;
  variantKey: string;
  payload?: unknown;
  isControl: boolean;
}

export interface ExperimentAllocation {
  experimentId: string;
  variantId: string;
  userId: string;
  timestamp: number;
}

export interface ExperimentConfig {
  enabled: boolean;
  persistAllocation: boolean;
  defaultWeights: boolean;
}
