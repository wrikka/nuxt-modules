# @wrikka/analytics

> **Advanced Analytics Module for Nuxt 3/4** - A comprehensive analytics solution with 25+ features, surpassing rybbit.com capabilities.

## Features

### Core Analytics

- **Multi-provider support** - Plausible, Umami, PostHog, Custom providers
- **Automatic page view tracking** - Route-based tracking
- **Event tracking** - Custom events with properties
- **User identification** - User traits and identification

### Session Replay & User Journey

- **Session Replay** - Record and replay user sessions with privacy controls
- **User Journeys** - Track complete user journeys across pages and events
- **Funnels** - Create and analyze conversion funnels

### Performance & Web Vitals

- **Web Vitals** - LCP, FID, CLS, FCP, TTFB, INP tracking
- **Performance Insights** - Automated performance recommendations

### AI & Predictive Analytics

- **AI Insights** - AI-powered insights and recommendations
- **Predictive Analytics** - Traffic, conversion, and revenue predictions
- **Churn Prediction** - Identify users at risk of churning

### User Analytics

- **Cohort Analysis** - Group users and analyze behavior over time
- **A/B Testing** - Built-in experiment management
- **Heatmaps** - Click, scroll, and attention heatmaps
- **Form Analytics** - Form completion, drop-off, and field analysis

### Monitoring & Error Tracking

- **Error Tracking** - JavaScript, network, and performance error tracking
- **Bot Detection** - Identify and filter bot traffic
- **Alerts** - Configurable alerts with multiple channels

### Audience Insights

- **Geo Analytics** - Country, region, and city-level analytics with globe view
- **Device Analytics** - Browser, OS, screen, and device type analytics
- **Custom Dimensions** - Custom data dimensions and metrics

### Business Intelligence

- **E-commerce Tracking** - Product views, cart, checkout, and revenue tracking
- **Team Collaboration** - Multi-user access with role management
- **Automated Reports** - Scheduled reports with multiple formats

### Data & Privacy

- **Data Export** - Export data in multiple formats (CSV, JSON, PDF)
- **API Access** - RESTful API with key management
- **Privacy Compliance** - GDPR, CCPA support with consent management
- **Cookieless Tracking** - Fingerprinting and alternative tracking methods
- **Cross-domain Tracking** - Track users across multiple domains
- **Offline Analytics** - Queue and sync events when offline

### Dashboard

- **Real-time Dashboard** - Live analytics dashboard component

## Installation

```bash
bun add @wrikka/analytics
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/analytics'],
  analytics: {
    enabled: true,

    // Provider configuration
    providers: {
      plausible: {
        domain: 'example.com',
        apiHost: 'https://plausible.io',
      },
      umami: {
        websiteId: 'xxx-xxx-xxx',
        apiHost: 'https://analytics.umami.is',
      },
      posthog: {
        apiKey: 'phc_xxx',
        apiHost: 'https://app.posthog.com',
      },
    },

    // Core settings
    trackPageViews: true,
    trackEvents: true,
    respectDoNotTrack: true,
    debug: false,

    // Session Replay
    sessionReplay: {
      enabled: true,
      sampleRate: 0.1,
      maskAllInputs: true,
      privacyMode: 'balanced',
    },

    // Funnels
    funnels: {
      enabled: true,
      autoTrack: true,
    },

    // User Journeys
    journeys: {
      enabled: true,
      maxSteps: 100,
    },

    // Web Vitals
    webVitals: {
      enabled: true,
      sampleRate: 1,
    },

    // AI Insights
    aiInsights: {
      enabled: true,
      provider: 'openai',
    },

    // Predictive Analytics
    predictive: {
      enabled: true,
      models: ['traffic', 'conversion', 'churn'],
    },

    // Cohort Analysis
    cohorts: {
      enabled: true,
      autoCreate: true,
    },

    // A/B Testing
    abTesting: {
      enabled: true,
      autoAssign: true,
    },

    // Heatmaps
    heatmaps: {
      enabled: true,
      types: ['click', 'scroll', 'attention'],
    },

    // Form Analytics
    formAnalytics: {
      enabled: true,
      trackAllForms: true,
    },

    // Error Tracking
    errorTracking: {
      enabled: true,
      captureStackTrace: true,
    },

    // Bot Detection
    botDetection: {
      enabled: true,
      blockThreshold: 0.9,
    },

    // Geo Analytics
    geo: {
      enabled: true,
      trackCity: true,
    },

    // Device Analytics
    device: {
      enabled: true,
      trackScreen: true,
    },

    // Custom Dimensions
    customData: {
      enabled: true,
      maxDimensions: 20,
      maxMetrics: 20,
    },

    // E-commerce
    ecommerce: {
      enabled: true,
      currency: 'USD',
    },

    // Team
    team: {
      enabled: true,
      maxMembers: 50,
    },

    // Reports
    reports: {
      enabled: true,
      formats: ['pdf', 'csv', 'json'],
    },

    // Alerts
    alerts: {
      enabled: true,
      channels: ['email', 'slack'],
    },

    // Data Export
    export: {
      enabled: true,
      formats: ['csv', 'json', 'pdf'],
    },

    // Privacy
    privacy: {
      enabled: true,
      gdpr: true,
      ccpa: true,
      consentManagement: true,
    },

    // Cookieless Tracking
    cookieless: {
      enabled: true,
      method: 'fingerprint',
    },

    // Cross-domain Tracking
    crossDomain: {
      enabled: true,
      domains: [
        { domain: 'example.com', primary: true },
        { domain: 'app.example.com' },
      ],
    },

    // Offline Analytics
    offline: {
      enabled: true,
      storageType: 'indexeddb',
    },
  },
});
```

## Usage

### Core Analytics

```typescript
const { trackEvent, identify, trackPageView } = useAnalytics();

// Track custom event
trackEvent({
  name: 'button_click',
  category: 'engagement',
  properties: {
    button: 'signup',
    page: '/pricing',
  },
});

// Identify user
identify({
  userId: 'user_123',
  traits: {
    email: 'user@example.com',
    plan: 'pro',
  },
});
```

### Session Replay

```typescript
const { startRecording, stopRecording, getSession } = useSessionReplay();

// Start recording
startRecording();

// Stop and get session
const session = await stopRecording();
```

### Funnels

```typescript
const { createFunnel, trackStep, getConversionRate } = useFunnels();

// Create funnel
const funnel = createFunnel('checkout', [
  { name: 'view_product', order: 1 },
  { name: 'add_to_cart', order: 2 },
  { name: 'begin_checkout', order: 3 },
  { name: 'purchase', order: 4 },
]);

// Track funnel step
trackStep('checkout', 'add_to_cart');

// Get conversion rate
const rate = await getConversionRate('checkout');
```

### User Journeys

```typescript
const { startJourney, trackPage, trackEvent, analyzeJourney } = useJourneys();

// Start journey tracking
startJourney();

// Analyze journey
const analysis = await analyzeJourney();
```

### Web Vitals

```typescript
const { getAllMetrics, getMetric, getSummary } = useWebVitals();

// Get all metrics
const metrics = getAllMetrics();

// Get specific metric
const lcp = getMetric('LCP');
```

### AI Insights

```typescript
const { generateInsights, queryInsights, getReport } = useAIInsights();

// Generate insights
const insights = await generateInsights({ period: '30d' });

// Query with natural language
const result = await queryInsights('What caused the traffic spike last week?');
```

### Predictive Analytics

```typescript
const { predictTraffic, predictChurn, getHighRiskUsers } =
  usePredictiveAnalytics();

// Predict traffic
const prediction = await predictTraffic('7d');

// Predict user churn
const churnPrediction = await predictChurn('user_123');

// Get high-risk users
const highRisk = await getHighRiskUsers();
```

### Cohort Analysis

```typescript
const { createCohort, analyzeCohort, compareCohorts } = useCohortAnalysis();

// Create cohort
const cohort = createCohort('signups-jan', 'acquisition', {
  field: 'createdAt',
  operator: 'between',
  value: [startDate, endDate],
});

// Analyze cohort
const analysis = await analyzeCohort(cohort.id, period);
```

### A/B Testing

```typescript
const { createTest, getVariant, trackConversion } = useABTest();

// Create test
const test = createTest(
  'cta-color',
  'Test different CTA button colors',
  [
    {
      name: 'Control',
      type: 'control',
      trafficPercentage: 50,
      config: { color: 'blue' },
    },
    {
      name: 'Variant A',
      type: 'treatment',
      trafficPercentage: 50,
      config: { color: 'green' },
    },
  ],
  'conversion_rate',
);

// Get variant for user
const variant = getVariant('cta-color');

// Track conversion
trackConversion('cta-color');
```

### Heatmaps

```typescript
const { getClickHeatmap, getHotspots, startTracking } = useHeatmaps();

// Start tracking
startTracking();

// Get click heatmap data
const heatmap = getClickHeatmap();

// Get hotspots
const hotspots = getHotspots();
```

### Form Analytics

```typescript
const { getFormAnalytics, getInsights } = useFormAnalytics();

// Get form analytics
const analytics = getFormAnalytics('signup-form');

// Get insights
const insights = getInsights('signup-form');
```

### Error Tracking

```typescript
const { getSummary, errors } = useErrorTracking();

// Get error summary
const summary = getSummary({ start: startDate, end: endDate });
```

### Bot Detection

```typescript
const { detect, shouldBlock, isGoodBot } = useBotDetection();

// Detect bot
const detection = detect();

// Check if should block
if (shouldBlock()) {
  // Block request
}
```

### Geo Analytics

```typescript
const { detectGeo, getCountryAnalytics, getGeoSummary } = useGeoAnalytics();

// Detect user geo
const geo = await detectGeo();

// Get country analytics
const countries = await getCountryAnalytics(period);
```

### Device Analytics

```typescript
const { detectDevice, getDeviceSummary } = useDeviceAnalytics();

// Detect device
const device = detectDevice();

// Get device summary
const summary = await getDeviceSummary(period);
```

### Custom Dimensions

```typescript
const { setDimension, setMetric, getAllDimensions } = useCustomDimensions();

// Set custom dimension
setDimension('page_category', 'blog');

// Set custom metric
setMetric('scroll_depth', 75);

// Get all dimensions
const dimensions = getAllDimensions();
```

### E-commerce

```typescript
const { viewProduct, addToCart, purchase, getRevenueMetrics } = useEcommerce();

// Track product view
viewProduct({
  id: 'prod_123',
  name: 'Premium Plan',
  price: 99,
  category: 'subscription',
});

// Add to cart
addToCart({ id: 'prod_123', name: 'Premium Plan', price: 99 }, 1);

// Track purchase
purchase({
  id: 'order_123',
  transactionId: 'txn_456',
});

// Get revenue metrics
const metrics = await getRevenueMetrics(period);
```

### Team Management

```typescript
const { createTeam, inviteMember, addMember } = useTeam();

// Create team
const team = createTeam('Marketing Team');

// Invite member
inviteMember(team.id, 'user@example.com', 'editor');
```

### Reports

```typescript
const { createReport, generateReport, scheduleReport } = useReports();

// Create report
const report = createReport('Monthly Overview', 'overview', {
  period: { start: startDate, end: endDate },
});

// Generate report
const data = await generateReport(report.id);

// Schedule report
scheduleReport(report.id, 'monthly', [{ email: 'team@example.com' }]);
```

### Alerts

```typescript
const { createAlert, pauseAlert, getAlertsByStatus } = useAlerts();

// Create alert
const alert = createAlert(
  'High Error Rate',
  'threshold',
  { metric: 'error_rate', operator: 'greater_than', threshold: 5 },
  [{ type: 'email', config: { to: 'team@example.com' } }],
);
```

### Data Export

```typescript
const { createExport, startExport, downloadExport } = useDataExport();

// Create export
const exportItem = createExport('csv', { period: '30d' });

// Start export
await startExport(exportItem.id);

// Download
const url = downloadExport(exportItem.id);
```

### Privacy Management

```typescript
const { grantConsent, denyConsent, shouldTrack, withdrawConsent } =
  usePrivacy();

// Grant consent
grantConsent(['analytics', 'marketing']);

// Check if should track
if (shouldTrack()) {
  trackEvent({ name: 'event' });
}

// Withdraw consent
withdrawConsent();
```

### Cookieless Tracking

```typescript
const { generateVisitorId, generateSessionId } = useCookielessTracking();

// Generate visitor ID (fingerprint-based)
const visitorId = await generateVisitorId();

// Generate session ID
const sessionId = generateSessionId();
```

### Cross-domain Tracking

```typescript
const { generateCrossDomainUrl, linkToDomain } = useCrossDomainTracking();

// Generate cross-domain URL
const url = generateCrossDomainUrl('app.example.com', '/dashboard');

// Link to another domain
await linkToDomain('app.example.com');
```

### Offline Analytics

```typescript
const { storeEvent, syncEvents, isOffline } = useOfflineAnalytics();

// Store event (will sync when online)
await storeEvent({
  id: crypto.randomUUID(),
  type: 'pageview',
  data: { url: '/page' },
  timestamp: new Date(),
});

// Manually sync
if (!isOffline.value) {
  await syncEvents();
}
```

### Real-time Dashboard

```vue
<template>
  <AnalyticsDashboard
    :refresh-interval="5000"
    :show-web-vitals="true"
    :show-errors="true"
    :show-geo="true"
    :show-devices="true"
    @update="handleUpdate"
  />
</template>

<script setup>
import { AnalyticsDashboard } from '@wrikka/analytics';

const handleUpdate = (data) => {
  console.log('Dashboard update:', data);
};
</script>
```

## Components

### AnalyticsDashboard

A real-time analytics dashboard component with live metrics, top pages, traffic sources, and web vitals.

**Props:**

- `refreshInterval` - Update interval in ms (default: 5000)
- `showWebVitals` - Show web vitals section (default: true)
- `showErrors` - Show error count (default: true)
- `showGeo` - Show geo analytics (default: true)
- `showDevices` - Show device analytics (default: true)

**Events:**

- `@update` - Emitted on each data update

## License

MIT
