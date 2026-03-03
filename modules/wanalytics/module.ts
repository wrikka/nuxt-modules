import { addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { z } from 'zod';

// Re-export UnoCSS types for module consumers
export type { UserConfig as UnoConfig } from 'unocss';

const analyticsModuleOptionsSchema = z.object({
  enabled: z.boolean().default(true),

  // Provider configurations
  providers: z.object({
    plausible: z.object({
      domain: z.string().optional(),
      apiHost: z.string().default('https://plausible.io'),
    }).optional(),
    umami: z.object({
      websiteId: z.string().optional(),
      apiHost: z.string().default('https://analytics.umami.is'),
    }).optional(),
    posthog: z.object({
      apiKey: z.string().optional(),
      apiHost: z.string().default('https://app.posthog.com'),
    }).optional(),
    custom: z.object({
      endpoint: z.string().optional(),
    }).optional(),
  }).default({}),

  // Core tracking
  trackPageViews: z.boolean().default(true),
  trackEvents: z.boolean().default(true),
  respectDoNotTrack: z.boolean().default(true),
  debug: z.boolean().default(false),

  // Session Replay
  sessionReplay: z.object({
    enabled: z.boolean().default(false),
    sampleRate: z.number().min(0).max(1).default(1),
    maskAllInputs: z.boolean().default(true),
    maskTextSelector: z.string().optional(),
    blockSelector: z.string().optional(),
    ignoreSelector: z.string().optional(),
    recordCanvas: z.boolean().default(false),
    recordImages: z.boolean().default(false),
    maxDuration: z.number().default(1800000),
    privacyMode: z.enum(['strict', 'balanced', 'open']).default('balanced'),
  }).optional(),

  // Funnels
  funnels: z.object({
    enabled: z.boolean().default(false),
    autoTrack: z.boolean().default(true),
    defaultSteps: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['pageview', 'event', 'custom']),
      target: z.string(),
      order: z.number(),
    })).default([]),
  }).optional(),

  // User Journeys
  journeys: z.object({
    enabled: z.boolean().default(false),
    maxSteps: z.number().default(50),
    trackScrollDepth: z.boolean().default(true),
    trackExitRate: z.boolean().default(true),
  }).optional(),

  // Web Vitals
  webVitals: z.object({
    enabled: z.boolean().default(true),
    reportAllChanges: z.boolean().default(false),
    sampleRate: z.number().min(0).max(1).default(1),
    debug: z.boolean().default(false),
  }).optional(),

  // AI Insights
  aiInsights: z.object({
    enabled: z.boolean().default(false),
    provider: z.enum(['openai', 'anthropic', 'local']).default('openai'),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    autoGenerate: z.boolean().default(true),
    frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  }).optional(),

  // Predictive Analytics
  predictive: z.object({
    enabled: z.boolean().default(false),
    modelType: z.enum(['linear', 'prophet', 'lstm', 'ensemble']).default('linear'),
    retrainFrequency: z.enum(['daily', 'weekly']).default('weekly'),
    minDataPoints: z.number().default(30),
    confidenceThreshold: z.number().min(0).max(1).default(0.8),
  }).optional(),

  // Cohort Analysis
  cohorts: z.object({
    enabled: z.boolean().default(false),
    autoCreate: z.boolean().default(true),
    defaultCohorts: z.array(z.enum(['signup_date', 'first_purchase', 'user_segment', 'behavior', 'custom'])).default([
      'signup_date',
    ]),
    retentionPeriods: z.array(z.number()).default([1, 7, 14, 30, 60, 90]),
  }).optional(),

  // A/B Testing
  abTesting: z.object({
    enabled: z.boolean().default(false),
    defaultSignificanceLevel: z.number().min(0).max(1).default(0.95),
    minSampleSize: z.number().default(1000),
    maxTestDuration: z.number().default(2592000000),
    autoAllocateTraffic: z.boolean().default(false),
  }).optional(),

  // Heatmaps
  heatmaps: z.object({
    enabled: z.boolean().default(false),
    sampleRate: z.number().min(0).max(1).default(0.1),
    types: z.array(z.enum(['click', 'move', 'scroll', 'attention'])).default(['click', 'scroll']),
    resolution: z.number().default(10),
    minInteractions: z.number().default(100),
    privacyMode: z.boolean().default(true),
  }).optional(),

  // Form Analytics
  formAnalytics: z.object({
    enabled: z.boolean().default(false),
    trackAllForms: z.boolean().default(true),
    formsToTrack: z.array(z.string()).default([]),
    sensitiveFields: z.array(z.string()).default(['password', 'credit_card', 'cvv', 'ssn']),
    trackCorrections: z.boolean().default(true),
    trackAutofill: z.boolean().default(true),
  }).optional(),

  // Error Tracking
  errorTracking: z.object({
    enabled: z.boolean().default(true),
    captureStackTrace: z.boolean().default(true),
    captureSessionReplay: z.boolean().default(false),
    ignoreErrors: z.array(z.string()).default([]),
    ignoreUrls: z.array(z.string()).default([]),
    sampleRate: z.number().min(0).max(1).default(1),
  }).optional(),

  // Bot Detection
  botDetection: z.object({
    enabled: z.boolean().default(true),
    mode: z.enum(['passive', 'active', 'aggressive']).default('active'),
    mlModel: z.boolean().default(true),
    blockThreshold: z.number().min(0).max(1).default(0.9),
    flagThreshold: z.number().min(0).max(1).default(0.5),
    whitelist: z.array(z.string()).default([]),
    blacklist: z.array(z.string()).default([]),
  }).optional(),

  // Geo Analytics
  geo: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['maxmind', 'ipapi', 'ipinfo', 'cloudflare']).default('cloudflare'),
    apiKey: z.string().optional(),
    cacheExpiry: z.number().default(3600),
    trackCity: z.boolean().default(true),
    trackRegion: z.boolean().default(true),
  }).optional(),

  // Device Analytics
  device: z.object({
    enabled: z.boolean().default(true),
    trackScreen: z.boolean().default(true),
    trackViewport: z.boolean().default(true),
    trackPlugins: z.boolean().default(false),
    trackLanguage: z.boolean().default(true),
  }).optional(),

  // Custom Dimensions & Metrics
  customData: z.object({
    enabled: z.boolean().default(false),
    maxDimensions: z.number().default(20),
    maxMetrics: z.number().default(20),
    autoTrack: z.array(z.string()).default([]),
  }).optional(),

  // E-commerce
  ecommerce: z.object({
    enabled: z.boolean().default(false),
    currency: z.string().default('USD'),
    trackProducts: z.boolean().default(true),
    trackCategories: z.boolean().default(true),
    trackCart: z.boolean().default(true),
    trackCheckout: z.boolean().default(true),
  }).optional(),

  // Team Collaboration
  team: z.object({
    enabled: z.boolean().default(false),
    maxMembers: z.number().default(10),
    maxSites: z.number().default(5),
    allowGuests: z.boolean().default(true),
    requireInvitation: z.boolean().default(true),
  }).optional(),

  // Reports
  reports: z.object({
    enabled: z.boolean().default(false),
    defaultTimezone: z.string().default('UTC'),
    maxRecipients: z.number().default(10),
    retentionDays: z.number().default(90),
    branding: z.object({
      logo: z.string().optional(),
      primaryColor: z.string().optional(),
      companyName: z.string().optional(),
      footerText: z.string().optional(),
    }).optional(),
  }).optional(),

  // Alerts
  alerts: z.object({
    enabled: z.boolean().default(false),
    maxAlerts: z.number().default(50),
    cooldownMinutes: z.number().default(30),
    escalationEnabled: z.boolean().default(false),
    escalationRules: z.array(z.object({
      afterMinutes: z.number(),
      escalateTo: z.array(z.enum(['email', 'slack', 'discord', 'webhook', 'sms', 'push', 'pagerduty'])),
      config: z.record(z.string(), z.unknown()),
    })).default([]),
  }).optional(),

  // Data Export & API
  export: z.object({
    enabled: z.boolean().default(false),
    maxExports: z.number().default(10),
    maxFileSize: z.number().default(104857600),
    retentionDays: z.number().default(7),
    allowedFormats: z.array(z.enum(['csv', 'json', 'parquet', 'xlsx'])).default(['csv', 'json']),
  }).optional(),

  // Privacy Compliance
  privacy: z.object({
    enabled: z.boolean().default(true),
    gdpr: z.boolean().default(true),
    ccpa: z.boolean().default(false),
    consentManagement: z.boolean().default(false),
    autoCompliance: z.boolean().default(true),
  }).optional(),

  // Cookieless Tracking
  cookieless: z.object({
    enabled: z.boolean().default(true),
    method: z.enum(['fingerprint', 'local_storage', 'session_storage', 'indexeddb', 'combination']).default(
      'combination',
    ),
    fingerprinting: z.object({
      enabled: z.boolean().default(true),
      components: z.array(z.string()).default(['userAgent', 'language', 'screenResolution', 'timezone', 'platform']),
      hashFunction: z.enum(['sha256', 'sha512', 'murmur']).default('sha256'),
      privacyMode: z.enum(['strict', 'balanced', 'open']).default('balanced'),
      rotateInterval: z.number().default(0),
    }).optional(),
  }).optional(),

  // Cross-domain Tracking
  crossDomain: z.object({
    enabled: z.boolean().default(false),
    domains: z.array(z.object({
      domain: z.string(),
      primary: z.boolean().default(false),
      shareSession: z.boolean().default(true),
      shareUser: z.boolean().default(true),
      shareEvents: z.boolean().default(true),
    })).default([]),
    linkingMethod: z.enum(['url_parameter', 'post_message', 'shared_storage', 'server_side']).default('url_parameter'),
    timeout: z.number().default(30000),
  }).optional(),

  // Offline Analytics
  offline: z.object({
    enabled: z.boolean().default(true),
    storageType: z.enum(['indexeddb', 'localstorage', 'memory']).default('indexeddb'),
    maxSize: z.number().default(5242880),
    maxEvents: z.number().default(1000),
    retryStrategy: z.object({
      maxRetries: z.number().default(5),
      backoff: z.enum(['linear', 'exponential', 'fixed']).default('exponential'),
      initialDelay: z.number().default(1000),
      maxDelay: z.number().default(60000),
      jitter: z.boolean().default(true),
    }).optional(),
    syncOnReconnect: z.boolean().default(true),
  }).optional(),
});

export type AnalyticsModuleOptions = z.infer<typeof analyticsModuleOptionsSchema>;

export default defineNuxtModule<AnalyticsModuleOptions>({
  meta: {
    name: '@wrikka/analytics',
    configKey: 'analytics',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    enabled: true,
    providers: {},
    trackPageViews: true,
    trackEvents: true,
    respectDoNotTrack: true,
    debug: false,
    sessionReplay: {
      enabled: false,
      sampleRate: 1,
      maskAllInputs: true,
      recordCanvas: false,
      recordImages: false,
      maxDuration: 1800000,
      privacyMode: 'balanced',
    },
    funnels: {
      enabled: false,
      autoTrack: true,
      defaultSteps: [],
    },
    journeys: {
      enabled: false,
      maxSteps: 50,
      trackScrollDepth: true,
      trackExitRate: true,
    },
    webVitals: {
      enabled: true,
      reportAllChanges: false,
      sampleRate: 1,
      debug: false,
    },
    aiInsights: {
      enabled: false,
      provider: 'openai',
      autoGenerate: true,
      frequency: 'daily',
    },
    predictive: {
      enabled: false,
      modelType: 'linear',
      retrainFrequency: 'weekly',
      minDataPoints: 30,
      confidenceThreshold: 0.8,
    },
    cohorts: {
      enabled: false,
      autoCreate: true,
      defaultCohorts: ['signup_date'],
      retentionPeriods: [1, 7, 14, 30, 60, 90],
    },
    abTesting: {
      enabled: false,
      defaultSignificanceLevel: 0.95,
      minSampleSize: 1000,
      maxTestDuration: 2592000000,
      autoAllocateTraffic: false,
    },
    heatmaps: {
      enabled: false,
      sampleRate: 0.1,
      types: ['click', 'scroll'],
      resolution: 10,
      minInteractions: 100,
      privacyMode: true,
    },
    formAnalytics: {
      enabled: false,
      trackAllForms: true,
      formsToTrack: [],
      sensitiveFields: ['password', 'credit_card', 'cvv', 'ssn'],
      trackCorrections: true,
      trackAutofill: true,
    },
    errorTracking: {
      enabled: true,
      captureStackTrace: true,
      captureSessionReplay: false,
      ignoreErrors: [],
      ignoreUrls: [],
      sampleRate: 1,
    },
    botDetection: {
      enabled: true,
      mode: 'active',
      mlModel: true,
      blockThreshold: 0.9,
      flagThreshold: 0.5,
      whitelist: [],
      blacklist: [],
    },
    geo: {
      enabled: true,
      provider: 'cloudflare',
      cacheExpiry: 3600,
      trackCity: true,
      trackRegion: true,
    },
    device: {
      enabled: true,
      trackScreen: true,
      trackViewport: true,
      trackPlugins: false,
      trackLanguage: true,
    },
    customData: {
      enabled: false,
      maxDimensions: 20,
      maxMetrics: 20,
      autoTrack: [],
    },
    ecommerce: {
      enabled: false,
      currency: 'USD',
      trackProducts: true,
      trackCategories: true,
      trackCart: true,
      trackCheckout: true,
    },
    team: {
      enabled: false,
      maxMembers: 10,
      maxSites: 5,
      allowGuests: true,
      requireInvitation: true,
    },
    reports: {
      enabled: false,
      defaultTimezone: 'UTC',
      maxRecipients: 10,
      retentionDays: 90,
      branding: {},
    },
    alerts: {
      enabled: false,
      maxAlerts: 50,
      cooldownMinutes: 30,
      escalationEnabled: false,
      escalationRules: [],
    },
    export: {
      enabled: false,
      maxExports: 10,
      maxFileSize: 104857600,
      retentionDays: 7,
      allowedFormats: ['csv', 'json'],
    },
    privacy: {
      enabled: true,
      gdpr: true,
      ccpa: false,
      consentManagement: false,
      autoCompliance: true,
    },
    cookieless: {
      enabled: true,
      method: 'combination',
      fingerprinting: {
        enabled: true,
        components: ['userAgent', 'language', 'screenResolution', 'timezone', 'platform'],
        hashFunction: 'sha256',
        privacyMode: 'balanced',
        rotateInterval: 0,
      },
    },
    crossDomain: {
      enabled: false,
      domains: [],
      linkingMethod: 'url_parameter',
      timeout: 30000,
    },
    offline: {
      enabled: true,
      storageType: 'indexeddb',
      maxSize: 5242880,
      maxEvents: 1000,
      retryStrategy: {
        maxRetries: 5,
        backoff: 'exponential',
        initialDelay: 1000,
        maxDelay: 60000,
        jitter: true,
      },
      syncOnReconnect: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (!options.enabled) {
      return;
    }

    // Register runtime directory
    nuxt.options.alias['#analytics'] = resolver.resolve('./runtime');

    // Register composables
    addImportsDir(resolver.resolve('./app/composables'));

    // Register components
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      prefix: 'Analytics',
    });

    // Register plugins
    addPlugin(resolver.resolve('./app/plugins/analytics.client'));

    // Add public runtime config
    nuxt.options.runtimeConfig.public.analytics = {
      enabled: options.enabled,
      providers: options.providers,
      trackPageViews: options.trackPageViews,
      trackEvents: options.trackEvents,
      respectDoNotTrack: options.respectDoNotTrack,
      debug: options.debug,
      sessionReplay: options.sessionReplay,
      funnels: options.funnels,
      journeys: options.journeys,
      webVitals: options.webVitals,
      aiInsights: options.aiInsights,
      predictive: options.predictive,
      cohorts: options.cohorts,
      abTesting: options.abTesting,
      heatmaps: options.heatmaps,
      formAnalytics: options.formAnalytics,
      errorTracking: options.errorTracking,
      botDetection: options.botDetection,
      geo: options.geo,
      device: options.device,
      customData: options.customData,
      ecommerce: options.ecommerce,
      team: options.team,
      reports: options.reports,
      alerts: options.alerts,
      export: options.export,
      privacy: options.privacy,
      cookieless: options.cookieless,
      crossDomain: options.crossDomain,
      offline: options.offline,
    };
  },
});
