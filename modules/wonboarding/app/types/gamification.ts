export interface OnboardingGamification {
  totalPoints: number;
  earnedPoints: number;
  badges: OnboardingBadge[];
  streak: number;
  level: number;
}

export interface OnboardingBadge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  earnedAt?: Date;
}

export interface OnboardingReward {
  type: 'badge' | 'points' | 'unlock' | 'discount';
  value: string | number;
  message?: string;
}
