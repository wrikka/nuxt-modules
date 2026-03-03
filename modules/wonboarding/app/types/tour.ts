export interface OnboardingTourStep {
  target: string;
  title: string;
  description?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  spotlight?: boolean;
  spotlightPadding?: number;
}

export interface OnboardingTourConfig {
  steps: OnboardingTourStep[];
  showProgress?: boolean;
  allowSkip?: boolean;
  scrollToSelector?: boolean;
}
