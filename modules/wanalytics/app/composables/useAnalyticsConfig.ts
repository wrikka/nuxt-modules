import { useRuntimeConfig } from '#imports';
import type { AnalyticsConfig } from '#analytics/types';

export const useAnalyticsConfig = () => {
  const config = useRuntimeConfig();
  return config.public.analytics as AnalyticsConfig;
};
