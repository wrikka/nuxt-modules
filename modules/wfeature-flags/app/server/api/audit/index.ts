import { defineEventHandler, getQuery, type H3Event, readBody } from 'h3';
import type { AuditLogEntry, AuditLogFilter } from '#feature-flags/types';

// In-memory storage (in production, use database)
const auditLogStore: AuditLogEntry[] = [];
let entryId = 0;

export function addAuditEntry(
  action: AuditLogEntry['action'],
  flagKey: string,
  previousValue?: unknown,
  newValue?: unknown,
  actor?: AuditLogEntry['actor'],
  metadata?: Record<string, unknown>,
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `audit_${++entryId}`,
    timestamp: Date.now(),
    action,
    flagKey,
    previousValue,
    newValue,
    actor: actor ?? { type: 'system' },
    metadata,
  };

  auditLogStore.unshift(entry);

  // Limit entries
  if (auditLogStore.length > 10000) {
    auditLogStore.pop();
  }

  return entry;
}

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method;

  if (method === 'GET') {
    // Get audit logs
    const query = getQuery<AuditLogFilter>(event);
    let entries = [...auditLogStore];

    // Apply filters
    if (query.flagKey) {
      entries = entries.filter(e => e.flagKey === query.flagKey);
    }

    if (query.action) {
      entries = entries.filter(e => e.action === query.action);
    }

    if (query.actorId) {
      entries = entries.filter(e => e.actor.id === query.actorId);
    }

    if (query.startDate) {
      entries = entries.filter(e => e.timestamp >= query.startDate!);
    }

    if (query.endDate) {
      entries = entries.filter(e => e.timestamp <= query.endDate!);
    }

    // Pagination
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;

    return {
      entries: entries.slice(offset, offset + limit),
      total: entries.length,
      hasMore: offset + limit < entries.length,
    };
  }

  if (method === 'POST') {
    // Add audit entry (for external use)
    const body = await readBody<{
      action: AuditLogEntry['action'];
      flagKey: string;
      previousValue?: unknown;
      newValue?: unknown;
      actor?: AuditLogEntry['actor'];
      metadata?: Record<string, unknown>;
    }>(event);

    const entry = addAuditEntry(
      body.action,
      body.flagKey,
      body.previousValue,
      body.newValue,
      body.actor,
      body.metadata,
    );

    return { success: true, entry };
  }

  return { error: 'Method not allowed' };
});
