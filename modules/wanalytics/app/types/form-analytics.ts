import type { DateRange } from './common';

export interface FormAnalytics {
  id: string;
  formId: string;
  formName: string;
  url: string;
  period: DateRange;
  metrics: FormMetrics;
  fields: FieldAnalytics[];
  insights: FormInsight[];
}

export interface FormMetrics {
  impressions: number;
  starts: number;
  submissions: number;
  successes: number;
  errors: number;
  abandonments: number;
  startRate: number;
  completionRate: number;
  abandonmentRate: number;
  avgCompletionTime: number;
  avgFieldsFilled: number;
}

export interface FieldAnalytics {
  name: string;
  type: string;
  label?: string;
  order: number;
  interactions: number;
  fills: number;
  empties: number;
  errors: number;
  corrections: number;
  avgTimeToFill: number;
  dropOffRate: number;
  errorRate: number;
  autofillRate: number;
}

export interface FormInsight {
  type: FormInsightType;
  field?: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export type FormInsightType =
  | 'high_drop_off'
  | 'slow_field'
  | 'high_error_rate'
  | 'low_autofill'
  | 'abandonment_pattern'
  | 'field_order_issue'
  | 'unnecessary_field';

export interface FormError {
  formId: string;
  fieldName: string;
  errorType: string;
  errorMessage: string;
  occurrences: number;
  affectedUsers: number;
}

export interface FormSession {
  sessionId: string;
  formId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  fields: FieldSessionData[];
  totalTime: number;
  abandonmentField?: string;
}

export interface FieldSessionData {
  name: string;
  firstInteraction: Date;
  lastInteraction: Date;
  timeSpent: number;
  corrections: number;
  error: boolean;
  autofilled: boolean;
}

export interface FormAnalyticsConfig {
  enabled: boolean;
  trackAllForms: boolean;
  formsToTrack: string[];
  sensitiveFields: string[];
  trackCorrections: boolean;
  trackAutofill: boolean;
}
