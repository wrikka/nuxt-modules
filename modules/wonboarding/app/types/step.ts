export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  required: boolean;
  action?: OnboardingAction;
  completed: boolean;
  skipped: boolean;
  completedAt?: Date;
  skippedAt?: Date;
  // Conditional steps
  condition?: OnboardingCondition;
  // Step dependencies
  dependsOn?: string[];
  // Video tutorials
  video?: OnboardingVideo;
  // Interactive demo
  demo?: OnboardingDemo;
  // Gamification
  points?: number;
  badge?: string;
  // Time tracking
  timeSpent?: number;
  startedAt?: Date;
  // Flow assignment
  flowId?: string;
}

export interface OnboardingAction {
  type: 'link' | 'form' | 'custom';
  target?: string;
  data?: Record<string, unknown>;
}

export interface OnboardingCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'exists' | 'not_exists';
  value?: unknown;
}

export interface OnboardingVideo {
  url: string;
  provider?: 'youtube' | 'vimeo' | 'self';
  thumbnail?: string;
  duration?: number;
  autoplay?: boolean;
}

export interface OnboardingDemo {
  type: 'playground' | 'interactive' | 'preview';
  component?: string;
  props?: Record<string, unknown>;
  instructions?: string[];
}

export interface OnboardingStepInput {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  required?: boolean;
  action?: OnboardingAction;
  condition?: OnboardingCondition;
  dependsOn?: string[];
  video?: OnboardingVideo;
  demo?: OnboardingDemo;
  points?: number;
  badge?: string;
  flowId?: string;
}
