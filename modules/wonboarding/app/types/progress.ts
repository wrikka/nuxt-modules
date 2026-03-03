import type { OnboardingStep } from './step';

export interface OnboardingProgress {
  started: boolean;
  startedAt?: Date;
  completed: boolean;
  completedAt?: Date;
  skipped: boolean;
  skippedAt?: Date;
  currentStep: string | null;
  completedSteps: string[];
  skippedSteps: string[];
  percentage: number;
}

export interface OnboardingState {
  steps: OnboardingStep[];
  progress: OnboardingProgress;
  isActive: boolean;
}
