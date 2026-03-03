// Subscription Management UI Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  trialPeriodDays?: number;
  features: string[];
  active: boolean;
  popular?: boolean;
}

export interface SubscriptionChange {
  subscriptionId: string;
  currentPlan: SubscriptionPlan;
  newPlan: SubscriptionPlan;
  prorationBehavior: 'create_prorations' | 'none' | 'always_invoice';
  effectiveAt: 'immediately' | 'period_end';
  priceDifference: number;
  prorationAmount?: number;
}

export interface SubscriptionAction {
  type: 'upgrade' | 'downgrade' | 'cancel' | 'pause' | 'resume';
  subscriptionId: string;
  reason?: string;
  effectiveAt?: 'immediately' | 'period_end';
  feedback?: CancellationFeedback;
}

export interface CancellationFeedback {
  category: 'too_expensive' | 'missing_features' | 'switching_service' | 'unused' | 'other';
  comment?: string;
}

export interface SubscriptionSchedule {
  id: string;
  subscription: string;
  phases: SubscriptionPhase[];
  released?: boolean;
  status: 'active' | 'canceled' | 'completed' | 'released' | 'not_started';
}

export interface SubscriptionPhase {
  start_date: number;
  end_date?: number;
  plans: SubscriptionPhasePlan[];
  trial_end?: number;
  prorate?: boolean;
}

export interface SubscriptionPhasePlan {
  plan: string;
  quantity: number;
}

export interface SubscriptionUsage {
  subscriptionId: string;
  planId: string;
  quantity: number;
  limit?: number;
  periodStart: number;
  periodEnd: number;
  usageRecords: UsageRecord[];
}

export interface UsageRecord {
  id: string;
  quantity: number;
  timestamp: number;
  action: 'increment' | 'set';
}

export interface SubscriptionFilter {
  status?: ('active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing')[];
  plan?: string;
  search?: string;
  dateRange?: '7d' | '30d' | '90d' | '1y' | 'custom';
}

export interface SubscriptionStats {
  total: number;
  active: number;
  canceled: number;
  pastDue: number;
  trialing: number;
  mrr: number;
  arr: number;
  churnRate: number;
}
