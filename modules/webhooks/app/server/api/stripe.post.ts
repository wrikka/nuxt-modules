import { createError, defineEventHandler, getHeader, readBody, useRuntimeConfig } from 'h3';
import { verifyStripeSignature } from '#webhooks/utils';
import type { WebhookEvent } from '#webhooks/types';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const providers = config.webhooksProviders || {};

  if (!providers?.stripe?.enabled) {
    throw createError({
      statusCode: 400,
      message: 'Stripe webhooks are not enabled',
    });
  }

  const signature = getHeader(event, 'stripe-signature');
  if (!signature) {
    throw createError({
      statusCode: 400,
      message: 'Missing Stripe signature',
    });
  }

  const body = await readBody(event);
  const rawBody = JSON.stringify(body);

  const secret = providers.stripe.secret || '';
  if (!secret || !verifyStripeSignature(rawBody, signature, secret)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid signature',
    });
  }

  const webhookEvent: WebhookEvent = {
    id: body.id,
    provider: 'stripe',
    type: body.type,
    timestamp: new Date(body.created * 1000),
    data: body.data.object,
    raw: rawBody,
    signature,
    processed: false,
    retryCount: 0,
  };

  // Emit event for handlers
  event.context.webhooks = webhookEvent;

  return { received: true, id: webhookEvent.id };
});
