import { createError, defineEventHandler, getHeader, readBody, useRuntimeConfig } from 'h3';
import { verifySlackSignature } from '#webhooks/utils';
import type { WebhookEvent } from '#webhooks/types';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const providers = config.webhooksProviders || {};

  if (!providers?.slack?.enabled) {
    throw createError({
      statusCode: 400,
      message: 'Slack webhooks are not enabled',
    });
  }

  const signature = getHeader(event, 'x-slack-signature');
  const timestamp = getHeader(event, 'x-slack-request-timestamp');

  if (!signature || !timestamp) {
    throw createError({
      statusCode: 400,
      message: 'Missing Slack signature or timestamp',
    });
  }

  const body = await readBody(event);
  const rawBody = typeof body === 'string' ? body : JSON.stringify(body);

  const secret = providers.slack.secret || '';
  if (!secret || !verifySlackSignature(rawBody, timestamp, signature, secret)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid signature',
    });
  }

  const eventType = body.type || body.event?.type || 'unknown';

  const webhookEvent: WebhookEvent = {
    id: `slack_${Date.now()}`,
    provider: 'slack',
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
