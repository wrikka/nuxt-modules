import { defineEventHandler, getQuery, type H3Event } from 'h3';
import type { Actor, ChangelogAction, ChangelogEntry } from '#feature-flags/types';

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const flagKey = query.flagKey as string | undefined;

  const actors: Actor[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', type: 'user' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', type: 'user' },
    { id: 'system', name: 'System', type: 'system' },
  ];

  const actions: ChangelogAction[] = [
    'created',
    'enabled',
    'disabled',
    'updated',
    'targeting_changed',
    'rollout_changed',
  ];

  const entries: ChangelogEntry[] = Array.from({ length: 10 }, (_, i) => ({
    id: `entry-${i}`,
    flagKey: flagKey || `flag-${i % 3}`,
    action: actions[i % actions.length],
    timestamp: Date.now() - i * 3600000 * 24,
    actor: actors[i % actors.length],
    changes: [
      { field: 'enabled', oldValue: i % 2 === 0, newValue: i % 2 === 1 },
      { field: 'percentage', oldValue: 25, newValue: 50 },
    ],
    environment: ['development', 'staging', 'production'][i % 3],
    reason: i % 2 === 0 ? 'Feature rollout' : undefined,
  }));

  return { entries };
});
