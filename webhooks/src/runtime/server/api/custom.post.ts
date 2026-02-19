import { createError, defineEventHandler, getHeader, readBody, useRuntimeConfig } from 'h3';
import type { WebhookEvent } from '#webhooks/types';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const providers = config.webhooksProviders || {};

  if (!providers?.custom?.enabled) {
    throw createError({
      statusCode: 400,
      message: 'Custom webhooks are not enabled',
    });
  }

  const signature = getHeader(event, 'x-webhook-signature');
  const body = await readBody(event);
  const rawBody = JSON.stringify(body);

  // Custom verification - can be extended
  if (providers.custom.secret && signature) {
    // Simple HMAC verification or custom logic
    // For now, just check if signature matches secret
    if (signature !== providers.custom.secret) {
      throw createError({
        statusCode: 400,
        message: 'Invalid signature',
      });
    }
  }

  const eventType = body.type || body.event || 'custom';

  const webhookEvent: WebhookEvent = {
    id: body.id || `custom_${Date.now()}`,
    provider: 'custom',
    type: eventType,
    timestamp: new Date(),
    data: body,
    raw: rawBody,
    signature,
    processed: false,
    retryCount: 0,
  };

  event.context.webhooks = webhookEvent;

  return { received: true, id: webhookEvent.id };
});
