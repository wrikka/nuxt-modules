import type { AnalyticsConfig } from '#analytics/types';

export const loadPlausible = (config: NonNullable<AnalyticsConfig['providers']['plausible']>) => {
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = config.domain;
  script.src = `${config.apiHost}/js/script.js`;
  document.head.appendChild(script);
};

export const loadUmami = (config: NonNullable<AnalyticsConfig['providers']['umami']>) => {
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.websiteId = config.websiteId;
  script.src = `${config.apiHost}/script.js`;
  document.head.appendChild(script);
};

export const loadPostHog = (
  config: NonNullable<AnalyticsConfig['providers']['posthog']>,
) => {
  const apiKey = config.apiKey;
  if (!apiKey) return;

  // eslint-disable-next-line unicorn/prefer-global-this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posthog: any = window.posthog ?? [];
  // eslint-disable-next-line unicorn/prefer-global-this
  window.posthog = posthog;

  const methods = [
    'capture',
    'identify',
    'reset',
    'setPersonProperties',
    'setGroupProperties',
    'onFeatureFlags',
    'getFeatureFlag',
    'getFeatureFlagPayload',
    'isFeatureEnabled',
    'reloadFeatureFlags',
    'opt_in_capturing',
    'opt_out_capturing',
  ];

  const factory = (method: string) => {
    return (...args: unknown[]) => {
      posthog.push([method, ...args]);
    };
  };

  posthog.methods = methods;
  posthog.factory = factory;

  for (const method of methods) {
    posthog[method] = factory(method);
  }

  posthog.load(apiKey, { api_host: config.apiHost });

  const script = document.createElement('script');
  script.async = true;
  script.src = `${config.apiHost}/static/array.js`;
  document.head.appendChild(script);
};
