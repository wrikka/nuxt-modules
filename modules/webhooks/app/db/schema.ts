import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const webhookEvents = sqliteTable('webhook_events', {
  id: text('id').primaryKey(),
  provider: text('provider', { enum: ['stripe', 'github', 'slack', 'custom'] }).notNull(),
  type: text('type').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  data: text('data', { mode: 'json' }).notNull(),
  raw: text('raw').notNull(),
  signature: text('signature'),
  processed: integer('processed', { mode: 'boolean' }).default(false).notNull(),
  error: text('error'),
  retryCount: integer('retry_count').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow().notNull(),
}, table => ({
  providerIdx: index('webhook_events_provider_idx').on(table.provider),
  typeIdx: index('webhook_events_type_idx').on(table.type),
  timestampIdx: index('webhook_events_timestamp_idx').on(table.timestamp),
  processedIdx: index('webhook_events_processed_idx').on(table.processed),
}));

export const webhookEventLogs = sqliteTable('webhook_event_logs', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => webhookEvents.id, { onDelete: 'cascade' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['received', 'processing', 'success', 'failed'] }).notNull(),
  message: text('message'),
  duration: integer('duration'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
}, table => ({
  eventIdIdx: index('webhook_event_logs_event_id_idx').on(table.eventId),
  statusIdx: index('webhook_event_logs_status_idx').on(table.status),
}));

export const webhookRetryQueue = sqliteTable('webhook_retry_queue', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => webhookEvents.id, { onDelete: 'cascade' }),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }).notNull(),
  attempts: integer('attempts').default(0).notNull(),
  maxAttempts: integer('max_attempts').notNull(),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'failed'] }).default('pending').notNull(),
  lastError: text('last_error'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow().notNull(),
}, table => ({
  eventIdIdx: index('webhook_retry_queue_event_id_idx').on(table.eventId),
  scheduledAtIdx: index('webhook_retry_queue_scheduled_at_idx').on(table.scheduledAt),
  statusIdx: index('webhook_retry_queue_status_idx').on(table.status),
}));

export const webhookTransformRules = sqliteTable('webhook_transform_rules', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  provider: text('provider', { enum: ['stripe', 'github', 'slack', 'custom'] }),
  eventTypes: text('event_types', { mode: 'json' }).notNull(),
  transform: text('transform').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).default(true).notNull(),
  priority: integer('priority').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow().notNull(),
}, table => ({
  providerIdx: index('webhook_transform_rules_provider_idx').on(table.provider),
  enabledIdx: index('webhook_transform_rules_enabled_idx').on(table.enabled),
}));

export const webhookAlerts = sqliteTable('webhook_alerts', {
  id: text('id').primaryKey(),
  eventId: text('event_id').references(() => webhookEvents.id, { onDelete: 'cascade' }),
  provider: text('provider', { enum: ['stripe', 'github', 'slack', 'custom'] }).notNull(),
  type: text('type').notNull(),
  channel: text('channel', { enum: ['slack', 'email', 'discord', 'webhook'] }).notNull(),
  recipient: text('recipient').notNull(),
  status: text('status', { enum: ['pending', 'sent', 'failed'] }).default('pending').notNull(),
  error: text('error'),
  sentAt: integer('sent_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
}, table => ({
  eventIdIdx: index('webhook_alerts_event_id_idx').on(table.eventId),
  statusIdx: index('webhook_alerts_status_idx').on(table.status),
}));
