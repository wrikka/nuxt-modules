import { defineEventHandler, getQuery, type H3Event, readBody } from 'h3';
import type { ScheduledAction, ScheduledChange } from '#feature-flags/types';

// In-memory storage (in production, use database with cron jobs)
const scheduleStore: ScheduledChange[] = [];
let scheduleId = 0;

const checkAndExecuteSchedules = async () => {
  const now = Date.now();
  const pending = scheduleStore.filter(
    s => s.status === 'pending' && s.scheduledAt <= now,
  );

  for (const schedule of pending) {
    try {
      // Execute the scheduled action
      // In production, this would update the actual flag
      schedule.executedAt = now;
      schedule.status = 'executed';
    } catch {
      schedule.status = 'failed';
    }
  }
};

// Check schedules every minute
if (import.meta.server) {
  setInterval(checkAndExecuteSchedules, 60000);
}

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method;

  if (method === 'GET') {
    const query = getQuery<{
      flagKey?: string;
      status?: ScheduledChange['status'];
      limit?: number;
      offset?: number;
    }>(event);

    let schedules = [...scheduleStore];

    if (query.flagKey) {
      schedules = schedules.filter(s => s.flagKey === query.flagKey);
    }

    if (query.status) {
      schedules = schedules.filter(s => s.status === query.status);
    }

    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;

    return {
      schedules: schedules.slice(offset, offset + limit),
      total: schedules.length,
      pending: schedules.filter(s => s.status === 'pending').length,
    };
  }

  if (method === 'POST') {
    const body = await readBody<{
      flagKey: string;
      action: ScheduledAction;
      scheduledAt: number;
      createdBy?: string;
    }>(event);

    const schedule: ScheduledChange = {
      id: `schedule_${++scheduleId}`,
      flagKey: body.flagKey,
      action: body.action,
      scheduledAt: body.scheduledAt,
      status: 'pending',
      createdBy: body.createdBy,
      createdAt: Date.now(),
    };

    scheduleStore.push(schedule);

    // Sort by scheduled time
    scheduleStore.sort((a, b) => a.scheduledAt - b.scheduledAt);

    return { success: true, schedule };
  }

  if (method === 'DELETE') {
    const body = await readBody<{ id: string; }>(event);
    const index = scheduleStore.findIndex(s => s.id === body.id);

    if (index !== -1) {
      const schedule = scheduleStore[index];
      if (schedule.status === 'pending') {
        schedule.status = 'cancelled';
        return { success: true };
      }
    }

    return { success: false, error: 'Schedule not found or already executed' };
  }

  return { error: 'Method not allowed' };
});
