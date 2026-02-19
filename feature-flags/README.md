# @wrikka/feature-flags

Nuxt module for feature flag management with multiple providers support, A/B testing, and real-time updates.

## Features

### Core

- **Multi-provider support** - LaunchDarkly, Flagsmith, Unleash, Local
- **Targeting rules** - User attribute-based targeting with 12 operators
- **Percentage rollout** - Gradual rollout with stickiness support
- **Client & server-side evaluation** - SSR-ready with hydration support
- **Local storage persistence** - Survives page refreshes
- **Debug mode** - Detailed logging for development

### Real-time

- **SSE streaming** - Real-time flag updates via Server-Sent Events
- **Auto-reconnect** - Configurable reconnection with exponential backoff
- **Connection status** - Monitor connection state in real-time

### A/B Testing

- **Experiment management** - Create and manage A/B tests
- **Variant allocation** - Deterministic bucketing with consistent hashing
- **Metric tracking** - Track conversions and experiment outcomes
- **Multivariate support** - Multiple variants with custom payloads

### Admin

- **Dashboard UI** - Visual flag management interface
- **Audit logging** - Track all flag changes with history
- **Scheduled rollouts** - Time-based flag changes
- **Flag dependencies** - Define prerequisite flags

### Analytics

- **Usage tracking** - Track flag evaluations and usage patterns
- **Experiment stats** - Monitor A/B test performance
- **Integration ready** - Connect with analytics providers

### Environment

- **Multi-environment** - Dev/Staging/Prod support
- **Environment switching** - Dynamic environment changes
- **Environment isolation** - Separate flag configurations

## Installation

```bash
bun add @wrikka/feature-flags
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/feature-flags'],
  featureFlags: {
    enabled: true,
    providers: {
      local: {
        flags: {
          'new-dashboard': true,
          'beta-feature': {
            enabled: true,
            rollout: { percentage: 50 },
            targeting: [
              { attribute: 'plan', operator: 'eq', value: 'pro' },
            ],
          },
        },
      },
      launchdarkly: {
        sdkKey: process.env.LAUNCHDARKLY_SDK_KEY,
      },
    },
    defaultFlags: {
      'new-dashboard': false,
    },
    persistInStorage: true,
    debug: false,
    realtime: {
      enabled: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
    },
  },
});
```

## Usage

### Basic Flag Check

```typescript
const { isEnabled } = useFeatureFlags();

if (isEnabled('new-dashboard')) {
  // Show new dashboard
}
```

### Conditional Rendering

```vue
<template>
  <FeatureFlag flag="new-dashboard">
    <NewDashboard />
    <template #disabled>
      <OldDashboard />
    </template>
  </FeatureFlag>
</template>
```

### With Dependencies

```typescript
const { isEnabledWithDependencies } = useDependencies();

// Only enabled if both flags are true
if (isEnabledWithDependencies('premium-feature')) {
  // premium-feature depends on 'subscription-active'
}
```

### A/B Testing

```typescript
const { variant, isControl, payload, trackMetric } = useExperiment(
  'checkout-flow',
);

if (variant.value?.key === 'new-checkout') {
  // Show new checkout
  trackMetric('conversion', 1);
}
```

### Real-time Updates

```typescript
const { isConnected, onEvent } = useFlagStream();

onEvent(event => {
  if (event.type === 'flag:updated') {
    console.log(`Flag ${event.data.key} changed to ${event.data.enabled}`);
  }
});
```

### Scheduled Changes

```typescript
const { scheduleEnable, scheduleDisable } = useSchedule();

// Enable feature on specific date
await scheduleEnable('holiday-promo', new Date('2026-12-25'));

// Disable after promotion
await scheduleDisable('holiday-promo', new Date('2026-12-26'));
```

### Audit Log

```typescript
const { getHistoryForFlag, formatAction } = useAuditLog();

const { entries } = await getHistoryForFlag('new-dashboard');

for (const entry of entries) {
  console.log(`${formatAction(entry.action)} at ${entry.timestamp}`);
}
```

### Environment Management

```typescript
const { current, isProduction, switchEnvironment } = useEnvironment();

if (!isProduction.value) {
  // Show debug info in non-production
}

await switchEnvironment('staging');
```

## API Reference

### Composables

| Composable           | Description                |
| -------------------- | -------------------------- |
| `useFeatureFlags()`  | Core flag management       |
| `useFlagStream()`    | Real-time SSE updates      |
| `useExperiment()`    | A/B test participation     |
| `useExperiments()`   | Manage all experiments     |
| `useAuditLog()`      | Change history tracking    |
| `useSchedule()`      | Scheduled flag changes     |
| `useDependencies()`  | Flag dependency management |
| `useFlagAnalytics()` | Usage analytics            |
| `useEnvironment()`   | Environment management     |

### Components

| Component                 | Description                   |
| ------------------------- | ----------------------------- |
| `<FeatureFlag>`           | Conditional rendering wrapper |
| `<ExperimentVariant>`     | A/B test variant renderer     |
| `<FeatureFlagsDashboard>` | Admin dashboard UI            |

### Server API Endpoints

| Endpoint                                 | Method          | Description                      |
| ---------------------------------------- | --------------- | -------------------------------- |
| `/api/feature-flags`                     | GET             | Get all flags                    |
| `/api/feature-flags/evaluate`            | POST            | Evaluate flag with context       |
| `/api/feature-flags/stream`              | GET             | SSE stream for real-time updates |
| `/api/feature-flags/experiments`         | GET             | List all experiments             |
| `/api/feature-flags/experiments/metrics` | POST            | Track experiment metrics         |
| `/api/feature-flags/audit`               | GET/POST        | Audit log entries                |
| `/api/feature-flags/schedule`            | GET/POST/DELETE | Scheduled changes                |

## Provider Comparison

| Feature     | Local | LaunchDarkly | Flagsmith | Unleash |
| ----------- | ----- | ------------ | --------- | ------- |
| Self-hosted | ✅    | ❌           | ✅        | ✅      |
| Real-time   | ✅    | ✅           | ✅        | ✅      |
| Targeting   | ✅    | ✅✅         | ✅        | ✅      |
| A/B Testing | ✅    | ✅           | ✅        | ✅      |
| Analytics   | ✅    | ✅           | ✅        | ❌      |
| Pricing     | Free  | $$$          | Freemium  | Free    |

## License

MIT
