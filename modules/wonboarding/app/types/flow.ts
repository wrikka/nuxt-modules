export interface OnboardingFlow {
  id: string;
  name: string;
  description?: string;
  targetUserType?: string;
  priority?: number;
  active: boolean;
}

export interface OnboardingFlowConfig {
  flows: OnboardingFlow[];
  defaultFlowId?: string;
}
