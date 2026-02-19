import { computed } from 'vue';
import { useOnboarding } from './useOnboarding';
import type { OnboardingBadge, OnboardingGamification, OnboardingStep } from '#onboarding/types';

export const useOnboardingGamification = () => {
  const { steps } = useOnboarding();

  const gamification = computed<OnboardingGamification>(() => {
    const earnedPoints = steps.value
      .filter((s: OnboardingStep) => s.completed)
      .reduce((sum: number, s: OnboardingStep) => sum + (s.points ?? 0), 0);

    const totalPoints = steps.value
      .reduce((sum: number, s: OnboardingStep) => sum + (s.points ?? 0), 0);

    const earnedBadges = steps.value
      .filter((s: OnboardingStep) => s.completed && s.badge)
      .map((s: OnboardingStep) => ({
        id: s.id,
        name: s.badge!,
        earnedAt: s.completedAt,
      }));

    return {
      totalPoints,
      earnedPoints,
      badges: earnedBadges,
      streak: calculateStreak(),
      level: calculateLevel(earnedPoints),
    };
  });

  const earnedPoints = computed(() => gamification.value.earnedPoints);
  const totalPoints = computed(() => gamification.value.totalPoints);
  const level = computed(() => gamification.value.level);
  const streak = computed(() => gamification.value.streak);
  const badges = computed<OnboardingBadge[]>(() => gamification.value.badges);

  const hasEarnedBadge = (badgeId: string) => {
    return badges.value.some((b: OnboardingBadge) => b.id === badgeId);
  };

  const getBadgeById = (badgeId: string) => {
    return badges.value.find((b: OnboardingBadge) => b.id === badgeId);
  };

  return {
    gamification,
    earnedPoints,
    totalPoints,
    level,
    streak,
    badges,
    hasEarnedBadge,
    getBadgeById,
  };
};

function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

function calculateStreak(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const streakData = localStorage.getItem('onboarding_streak');
    if (!streakData) return 0;

    const { lastDate, count } = JSON.parse(streakData);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastDate === today || lastDate === yesterday) {
      return count;
    }

    return 0;
  } catch {
    return 0;
  }
}
