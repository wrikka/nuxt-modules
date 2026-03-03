import type { CustomProviderConfig, PlausibleConfig, PostHogConfig, UmamiConfig } from './provider';

export interface AnalyticsConfig {
  enabled: boolean;
  providers: {
    plausible?: PlausibleConfig;
    umami?: UmamiConfig;
    posthog?: PostHogConfig;
    custom?: CustomProviderConfig;
  };
  trackPageViews: boolean;
  trackEvents: boolean;
  respectDoNotTrack: boolean;
  debug: boolean;
  errorTracking?: {
    enabled: boolean;
    captureStackTrace: boolean;
    captureSessionReplay: boolean;
    ignoreErrors: string[];
    ignoreUrls: string[];
    sampleRate: number;
  };
  webVitals?: {
    enabled: boolean;
    reportAllChanges: boolean;
    sampleRate: number;
  };
  team?: {
    enabled: boolean;
    maxMembers: number;
    maxTeams: number;
    defaultRole: string;
  };
  reports?: {
    enabled: boolean;
    defaultTimezone: string;
    maxRecipients: number;
    retentionDays: number;
  };
  privacy?: {
    enabled: boolean;
    gdpr: boolean;
    ccpa: boolean;
    consentManagement: boolean;
  };
  offline?: {
    enabled: boolean;
    storageType: string;
    maxSize: number;
    maxEvents: number;
    syncOnReconnect: boolean;
  };
  geo?: {
    enabled: boolean;
    provider: string;
    cacheExpiry: number;
    trackCity: boolean;
    trackRegion: boolean;
  };
  sessionReplay?: {
    enabled: boolean;
    sampleRate: number;
    maskAllInputs: boolean;
    maskTextSelector?: string;
    blockSelector?: string;
    ignoreSelector?: string;
    recordCanvas: boolean;
    recordImages: boolean;
    maxDuration: number;
    privacyMode: 'strict' | 'balanced' | 'relaxed';
    recordErrors?: boolean;
    maskInputs?: boolean;
    blockClass?: string;
  };
  predictive?: {
    enabled: boolean;
    modelType: 'linear' | 'prophet' | 'lstm' | 'ensemble';
    retrainFrequency: 'daily' | 'weekly';
    minDataPoints: number;
    confidenceThreshold: number;
    model?: string;
    features?: string[];
    retrainInterval?: number;
  };
  journeys?: {
    enabled: boolean;
    maxSteps: number;
    trackScrollDepth: boolean;
    trackExitRate: boolean;
    trackErrors?: boolean;
  };
  funnels?: {
    enabled: boolean;
    autoTrack: boolean;
    defaultSteps: Array<{ id: string; name: string; type: string; target: string; order: number; }>;
    maxSteps?: number;
    trackTime?: boolean;
  };
  formAnalytics?: {
    enabled: boolean;
    trackAllForms: boolean;
    formsToTrack: string[];
    sensitiveFields: string[];
    trackCorrections: boolean;
    trackAutofill: boolean;
    trackInteractions?: boolean;
    trackAbandonment?: boolean;
  };
  heatmaps?: {
    enabled: boolean;
    sampleRate: number;
    types: string[];
    resolution: number;
    minInteractions: number;
    privacyMode: 'strict' | 'balanced' | 'relaxed';
    captureClicks?: boolean;
    captureMoves?: boolean;
  };
  ecommerce?: {
    enabled: boolean;
    currency: string;
    trackProducts: boolean;
    trackCategories: boolean;
  };
  abTesting?: {
    enabled: boolean;
    defaultSignificanceLevel: number;
    minSampleSize: number;
    maxTestDuration: number;
    autoAllocateTraffic: boolean;
  };
  botDetection?: {
    enabled: boolean;
    mode: 'passive' | 'active' | 'aggressive';
    mlModel: boolean;
    blockThreshold: number;
    flagThreshold: number;
    whitelist: string[];
    blacklist: string[];
  };
  aiInsights?: {
    enabled: boolean;
    provider: 'openai' | 'anthropic' | 'local';
    apiKey?: string;
    model?: string;
    autoGenerate: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  alerts?: {
    enabled: boolean;
    maxAlerts: number;
    cooldownMinutes: number;
    escalationEnabled: boolean;
    escalationRules: Array<{
      afterMinutes: number;
      escalateTo: string[];
      config: Record<string, unknown>;
    }>;
  };
  cohorts?: {
    enabled: boolean;
    autoCreate: boolean;
    defaultCohorts: string[];
    retentionPeriods: number[];
  };
  cookieless?: {
    enabled: boolean;
    method: string;
    fingerprinting: {
      enabled: boolean;
      components: string[];
      hashFunction: 'sha256' | 'sha512' | 'murmur';
      privacyMode: 'strict' | 'balanced' | 'open';
      rotateInterval: number;
    };
    localStorage: {
      enabled: boolean;
      keyPrefix: string;
      expiry: number;
      fallbackToSession: boolean;
    };
    sessionStorage: {
      enabled: boolean;
      keyPrefix: string;
      crossTab: boolean;
    };
  };
  crossDomain?: {
    enabled: boolean;
    domains: Array<
      { domain: string; primary: boolean; shareSession: boolean; shareUser: boolean; shareEvents: boolean; }
    >;
    linkingMethod: 'url_parameter' | 'post_message' | 'shared_storage' | 'server_side';
    timeout: number;
  };
  customData?: {
    enabled: boolean;
    maxDimensions: number;
    maxMetrics: number;
    autoTrack: string[];
  };
  device?: {
    enabled: boolean;
    trackScreen: boolean;
    trackViewport: boolean;
    trackPlugins: boolean;
    trackLanguage: boolean;
  };
  export?: {
    enabled: boolean;
    maxExports: number;
    retentionDays: number;
    defaultFormat: string;
    maxFileSize: number;
    allowedFormats: string[];
  };
}

export interface AnalyticsRuntimeConfig {
  public: {
    analytics: AnalyticsConfig;
  };
}
