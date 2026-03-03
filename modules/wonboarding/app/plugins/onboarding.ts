import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import type { OnboardingConfig } from '#onboarding/types';
import { useOnboarding } from '#onboarding/composables';

export default defineNuxtPlugin({
  name: 'onboarding',
  setup() {
    const config = useRuntimeConfig();
    const onboardingConfig = config.public.onboarding as OnboardingConfig;
    const { loadProgress, start } = useOnboarding();

    // Load persisted progress on client
    if (import.meta.client && onboardingConfig.persistProgress) {
      loadProgress();
    }

    // Auto-start onboarding if enabled and not already started
    if (onboardingConfig.autoStart && import.meta.client) {
      setTimeout(() => {
        const { progress } = useOnboarding();
        if (!progress.value.started && !progress.value.completed) {
          start();
        }
      }, 1000);
    }
  },
});
