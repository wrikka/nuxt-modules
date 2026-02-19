# @wrikka/webhooks

Nuxt module for webhook handling with multiple provider support.

## Features

- Multi-provider support (Stripe, GitHub, Slack, Custom)
- Signature verification
- Event logging
- Retry logic
- Debug mode

## Installation

```bash
bun add @wrikka/webhooks
```

## Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/webhooks'],
  webhooks: {
    enabled: true,
    secret: process.env.WEBHOOK_SECRET,
    providers: {
      stripe: {
        enabled: true,
        secret: process.env.STRIPE_WEBHOOK_SECRET,
      },
      github: {
        enabled: true,
        secret: process.env.GITHUB_WEBHOOK_SECRET,
      },
    },
    retryAttempts: 3,
    retryDelay: 1000,
    debug: false,
  },
});
```

## Usage

### Webhook Endpoints

- `POST /api/webhooks/stripe` - Stripe webhooks
- `POST /api/webhooks/github` - GitHub webhooks
- `POST /api/webhooks/slack` - Slack webhooks
- `POST /api/webhooks/custom` - Custom webhooks
- `GET /api/webhooks/events` - List webhook events

### Handle Events

```typescript
// server/plugins/webhooks.ts
export default defineNitroPlugin(nitroApp => {
  nitroApp.hook('webhooks:stripe:payment_intent.succeeded', event => {
    console.log('Payment succeeded:', event.data);
  });
});
```

## License

MIT
