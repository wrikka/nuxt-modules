import type { WebhookProvider } from '#webhooks/types';

export interface WebhookTemplate {
  id: string;
  name: string;
  description: string;
  provider: WebhookProvider;
  eventType: string;
  samplePayload: Record<string, unknown>;
  handler?: string;
}

export const webhookTemplates: WebhookTemplate[] = [
  {
    id: 'stripe-payment-success',
    name: 'Stripe Payment Success',
    description: 'Handle successful payment events from Stripe',
    provider: 'stripe',
    eventType: 'payment_intent.succeeded',
    samplePayload: {
      id: 'evt_123',
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          amount: 1000,
          currency: 'usd',
          status: 'succeeded',
        },
      },
    },
    handler: `
// Handle successful payment
const paymentIntent = event.data.object;
await updateOrderStatus(paymentIntent.id, 'paid');
await sendConfirmationEmail(paymentIntent.customer);
    `,
  },
  {
    id: 'stripe-subscription-created',
    name: 'Stripe Subscription Created',
    description: 'Handle new subscription events',
    provider: 'stripe',
    eventType: 'customer.subscription.created',
    samplePayload: {
      id: 'evt_456',
      object: 'event',
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'active',
          items: { data: [{ price: { id: 'price_123' } }] },
        },
      },
    },
  },
  {
    id: 'github-push',
    name: 'GitHub Push',
    description: 'Handle push events from GitHub repositories',
    provider: 'github',
    eventType: 'push',
    samplePayload: {
      ref: 'refs/heads/main',
      repository: {
        id: 123,
        name: 'my-repo',
        full_name: 'owner/my-repo',
      },
      sender: {
        login: 'username',
      },
      commits: [{ message: 'Fix bug', added: [], removed: [], modified: ['src/index.ts'] }],
    },
  },
  {
    id: 'github-pull-request',
    name: 'GitHub Pull Request',
    description: 'Handle pull request events',
    provider: 'github',
    eventType: 'pull_request',
    samplePayload: {
      action: 'opened',
      number: 1,
      pull_request: {
        title: 'New feature',
        state: 'open',
        user: { login: 'contributor' },
      },
      repository: { name: 'my-repo' },
    },
  },
  {
    id: 'slack-message',
    name: 'Slack Message',
    description: 'Handle message events from Slack',
    provider: 'slack',
    eventType: 'message',
    samplePayload: {
      type: 'event_callback',
      event: {
        type: 'message',
        channel: 'C123456',
        user: 'U123456',
        text: 'Hello world',
        ts: '1234567890.123456',
      },
    },
  },
  {
    id: 'slack-reaction',
    name: 'Slack Reaction Added',
    description: 'Handle reaction added events',
    provider: 'slack',
    eventType: 'reaction_added',
    samplePayload: {
      type: 'event_callback',
      event: {
        type: 'reaction_added',
        reaction: 'thumbsup',
        item: { type: 'message', channel: 'C123', ts: '123.456' },
        user: 'U123',
      },
    },
  },
  {
    id: 'custom-generic',
    name: 'Custom Generic Event',
    description: 'Generic custom webhook template',
    provider: 'custom',
    eventType: 'custom.event',
    samplePayload: {
      event: 'custom.event',
      timestamp: new Date().toISOString(),
      data: {
        action: 'update',
        resource: 'user',
        id: '123',
      },
    },
  },
];

export const getTemplatesByProvider = (provider: WebhookProvider): WebhookTemplate[] => {
  return webhookTemplates.filter(t => t.provider === provider);
};

export const getTemplateById = (id: string): WebhookTemplate | undefined => {
  return webhookTemplates.find(t => t.id === id);
};

export const getTemplatesByEventType = (eventType: string): WebhookTemplate[] => {
  return webhookTemplates.filter(t => t.eventType === eventType);
};
