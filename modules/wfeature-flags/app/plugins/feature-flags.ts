import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import { useFeatureFlags } from '#feature-flags/composables';

export default defineNuxtPlugin({
  name: 'feature-flags',
  setup() {
    // TODO: Get config from runtime config
    // For now, use default values
    const config = {
      public: {
        featureFlags: {
          providers: {
            launchdarkly: false,
            flagsmith: false,
            unleash: false,
          },
        },
      },
    };
    const { loadFromStorage, refreshFlags } = useFeatureFlags();

    // Load flags from storage on client
    if (import.meta.client) {
      loadFromStorage();
    }

    // Refresh flags from server if not using local provider only
    const hasRemoteProvider = config.public.featureFlags.providers.launchdarkly
      || config.public.featureFlags.providers.flagsmith
      || config.public.featureFlags.providers.unleash;

    if (hasRemoteProvider) {
      void refreshFlags();
    }
  },
});
