import { createError, defineEventHandler, getHeader, readBody, useRuntimeConfig } from 'h3';
import { verifyGitHubSignature } from '#webhooks/utils';
import type { WebhookEvent } from '#webhooks/types';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const providers = config.webhooksProviders || {};

  if (!providers?.github?.enabled) {
    throw createError({
      statusCode: 400,
      message: 'GitHub webhooks are not enabled',
    });
  }

  const signature = getHeader(event, 'x-hub-signature-256');
  if (!signature) {
    throw createError({
      statusCode: 400,
      message: 'Missing GitHub signature',
    });
  }

  const body = await readBody(event);
  const rawBody = JSON.stringify(body);

  const secret = providers.github.secret || '';
  if (!secret || !verifyGitHubSignature(rawBody, signature, secret)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid signature',
    });
  }

  const eventType = getHeader(event, 'x-github-event') || 'unknown';

  const webhookEvent: WebhookEvent = {
    id: `gh_${Date.now()}`,
    provider: 'github',
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
