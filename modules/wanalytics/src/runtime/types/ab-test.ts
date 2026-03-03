export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: ABTestStatus;
  variants: ABTestVariant[];
  targetMetric: string;
  startDate: Date;
  endDate?: Date;
  trafficAllocation: number;
  targeting: ABTestTargeting;
}

export type ABTestStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';

export interface ABTestVariant {
  id: string;
  name: string;
  type: 'control' | 'treatment';
  trafficPercentage: number;
  config: Record<string, unknown>;
}

export interface ABTestTargeting {
  conditions: TargetingCondition[];
  userPercentage: number;
}

export interface TargetingCondition {
  type: 'url' | 'device' | 'browser' | 'country' | 'user_property' | 'event';
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'matches';
  value: unknown;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface ABTestStatistics {
  testId: string;
  winner: string | null;
  confidence: number;
  significanceReached: boolean;
  pValue: number;
  effectSize: number;
  relativeImprovement: number;
  recommendation: ABTestRecommendation;
}

export type ABTestRecommendation =
  | 'declare_winner'
  | 'continue_testing'
  | 'increase_sample'
  | 'no_difference';

export interface ABTestConfig {
  enabled: boolean;
  defaultSignificanceLevel: number;
  minSampleSize: number;
  maxTestDuration: number;
  autoAllocateTraffic: boolean;
}
