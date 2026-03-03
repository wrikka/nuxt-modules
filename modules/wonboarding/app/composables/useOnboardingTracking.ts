import { ref } from 'vue';
import type { OnboardingEvent, OnboardingEventType } from '#onboarding/types';

export const useOnboardingTracking = () => {
  const events = ref<OnboardingEvent[]>([]);

  const track = (
    type: OnboardingEventType,
    metadata?: Record<string, unknown>,
  ) => {
    const event: OnboardingEvent = {
      type,
      timestamp: new Date(),
      metadata,
    };

    events.value.push(event);
    persistEvents();

    if (import.meta.client) {
      void sendToServer(event);
    }
  };

  const trackStepViewed = (stepId: string, flowId?: string) => {
    track('step_viewed', { stepId, flowId });
  };

  const trackStepStarted = (stepId: string, flowId?: string) => {
    track('step_started', { stepId, flowId });
  };

  const trackStepCompleted = (stepId: string, flowId?: string, timeSpent?: number) => {
    track('step_completed', { stepId, flowId, timeSpent });
  };

  const trackStepSkipped = (stepId: string, flowId?: string) => {
    track('step_skipped', { stepId, flowId });
  };

  const trackStarted = (flowId?: string) => {
    track('started', { flowId });
  };

  const trackCompleted = (flowId?: string, totalDuration?: number) => {
    track('completed', { flowId, totalDuration });
  };

  const trackSkippedAll = (flowId?: string) => {
    track('skipped_all', { flowId });
  };

  const trackReset = () => {
    track('reset');
  };

  const loadEvents = () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('onboarding_analytics');
      if (stored) {
        events.value = JSON.parse(stored);
      }
    } catch {
      // Storage not available
    }
  };

  const clearEvents = () => {
    events.value = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_analytics');
    }
  };

  return {
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
  };
};

function persistEvents() {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem('onboarding_analytics');
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem('onboarding_analytics', JSON.stringify(existing));
  } catch {
    // Storage not available
  }
}

async function sendToServer(event: OnboardingEvent) {
  try {
    await $fetch('/api/onboarding/analytics', {
      method: 'POST',
      body: event,
    });
  } catch {
    // Fail silently
  }
}
