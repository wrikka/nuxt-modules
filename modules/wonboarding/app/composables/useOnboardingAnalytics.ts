import { computed } from 'vue';
import { useOnboardingTracking } from './useOnboardingTracking';
import type { OnboardingAnalytics, OnboardingEvent } from '#onboarding/types';

export const useOnboardingAnalytics = () => {
  const {
    events,
    track,
    trackStepViewed,
    trackStepStarted,
    trackStepCompleted,
    trackStepSkipped,
    trackStarted,
    trackCompleted,
    trackSkippedAll,
    trackReset,
    loadEvents,
    clearEvents,
  } = useOnboardingTracking();

  const analytics = computed<OnboardingAnalytics>(() => {
    const completedEvents = events.value.filter((e: OnboardingEvent) => e.type === 'step_completed');
    const totalDuration = completedEvents.reduce(
      (sum: number, e: OnboardingEvent) => sum + (e.metadata?.timeSpent as number ?? 0),
      0,
    );

    return {
      events: events.value,
      totalDuration,
      averageStepDuration: completedEvents.length > 0
        ? totalDuration / completedEvents.length
        : 0,
      completionRate: calculateCompletionRate(),
      dropOffSteps: calculateDropOffSteps(),
    };
  });

  return {
    events,
    analytics,
    track,
    trackStepViewed,
    trackStepStarted,
    trackStepCompleted,
    trackStepSkipped,
    trackStarted,
    trackCompleted,
    trackSkippedAll,
    trackReset,
    loadEvents,
    clearEvents,
  };
};

function calculateCompletionRate(): number {
  return 0;
}

function calculateDropOffSteps(): string[] {
  return [];
}
