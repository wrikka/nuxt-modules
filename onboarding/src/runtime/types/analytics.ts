export type OnboardingEventType =
  | 'started'
  | 'step_viewed'
  | 'step_started'
  | 'step_completed'
  | 'step_skipped'
  | 'step_error'
  | 'flow_changed'
  | 'completed'
  | 'skipped_all'
  | 'reset';

export interface OnboardingEvent {
  type: OnboardingEventType;
  stepId?: string;
  flowId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface OnboardingAnalytics {
  events: OnboardingEvent[];
  totalDuration: number;
  averageStepDuration: number;
  completionRate: number;
  dropOffSteps: string[];
}
