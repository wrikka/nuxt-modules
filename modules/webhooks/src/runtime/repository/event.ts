import { and, desc, eq, gte, inArray, like, lte, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { webhookEventLogs, webhookEvents, webhookRetryQueue } from '../db/schema';

export type WebhookEventInsert = typeof webhookEvents.$inferInsert;
export type WebhookEventSelect = typeof webhookEvents.$inferSelect;
export type WebhookEventLogInsert = typeof webhookEventLogs.$inferInsert;
export type WebhookEventLogSelect = typeof webhookEventLogs.$inferSelect;
export type WebhookRetryQueueInsert = typeof webhookRetryQueue.$inferInsert;

export interface EventFilterOptions {
  provider?: string;
  type?: string;
  processed?: boolean;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  limit?: number;
  offset?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDb = {
  select: (...args: any[]) => any;
  insert: (...args: any[]) => any;
  update: (...args: any[]) => any;
  delete: (...args: any[]) => any;
};

export class WebhookEventRepository {
  constructor(private db: AnyDb) {}

  async create(event: Omit<WebhookEventInsert, 'id' | 'createdAt' | 'updatedAt'>): Promise<WebhookEventSelect> {
    const id = nanoid();
    const now = new Date();
    const [result] = await this.db.insert(webhookEvents).values({
      ...event,
      id,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return result;
  }

  async findById(id: string): Promise<WebhookEventSelect | undefined> {
    const [result] = await this.db.select().from(webhookEvents).where(eq(webhookEvents.id, id));
    return result;
  }

  async findMany(options: EventFilterOptions = {}): Promise<WebhookEventSelect[]> {
    const conditions = [];

    if (options.provider) {
      conditions.push(eq(webhookEvents.provider, options.provider as 'stripe' | 'github' | 'slack' | 'custom'));
    }
    if (options.type) {
      conditions.push(eq(webhookEvents.type, options.type));
    }
    if (options.processed !== undefined) {
      conditions.push(eq(webhookEvents.processed, options.processed));
    }
    if (options.startDate) {
      conditions.push(gte(webhookEvents.timestamp, options.startDate));
    }
    if (options.endDate) {
      conditions.push(lte(webhookEvents.timestamp, options.endDate));
    }
    if (options.search) {
      conditions.push(or(
        like(webhookEvents.type, `%${options.search}%`),
        like(webhookEvents.error, `%${options.search}%`),
      ));
    }

    let query = this.db.select().from(webhookEvents);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    query = query.orderBy(desc(webhookEvents.timestamp)) as typeof query;

    if (options.limit) {
      query = query.limit(options.limit) as typeof query;
    }
    if (options.offset) {
      query = query.offset(options.offset) as typeof query;
    }

    return query;
  }

  async update(
    id: string,
    data: Partial<Omit<WebhookEventInsert, 'id' | 'createdAt'>>,
  ): Promise<WebhookEventSelect | undefined> {
    const [result] = await this.db.update(webhookEvents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(webhookEvents.id, id))
      .returning();
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await this.db.delete(webhookEvents).where(eq(webhookEvents.id, id)).returning();
    return !!result;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const results = await this.db.delete(webhookEvents)
      .where(inArray(webhookEvents.id, ids))
      .returning();
    return results.length;
  }

  async count(options: EventFilterOptions = {}): Promise<number> {
    const conditions = [];

    if (options.provider) {
      conditions.push(eq(webhookEvents.provider, options.provider as 'stripe' | 'github' | 'slack' | 'custom'));
    }
    if (options.type) {
      conditions.push(eq(webhookEvents.type, options.type));
    }
    if (options.processed !== undefined) {
      conditions.push(eq(webhookEvents.processed, options.processed));
    }
    if (options.startDate) {
      conditions.push(gte(webhookEvents.timestamp, options.startDate));
    }
    if (options.endDate) {
      conditions.push(lte(webhookEvents.timestamp, options.endDate));
    }

    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(webhookEvents)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result?.count ?? 0;
  }

  async getStatistics(startDate?: Date, endDate?: Date): Promise<{
    total: number;
    byProvider: Record<string, number>;
    byStatus: { processed: number; failed: number; pending: number; };
    successRate: number;
  }> {
    const conditions = [];
    if (startDate) conditions.push(gte(webhookEvents.timestamp, startDate));
    if (endDate) conditions.push(lte(webhookEvents.timestamp, endDate));

    const events = await this.db.select()
      .from(webhookEvents)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = events.length;
    const byProvider: Record<string, number> = {};
    let processed = 0;
    let failed = 0;
    let pending = 0;

    for (const event of events) {
      byProvider[event.provider] = (byProvider[event.provider] ?? 0) + 1;
      if (event.processed && !event.error) processed++;
      else if (event.error) failed++;
      else pending++;
    }

    return {
      total,
      byProvider,
      byStatus: { processed, failed, pending },
      successRate: total > 0 ? (processed / total) * 100 : 0,
    };
  }
}

export class WebhookEventLogRepository {
  constructor(private db: AnyDb) {}

  async create(log: Omit<WebhookEventLogInsert, 'id' | 'createdAt'>): Promise<WebhookEventLogSelect> {
    const id = nanoid();
    const [result] = await this.db.insert(webhookEventLogs).values({
      ...log,
      id,
      createdAt: new Date(),
    }).returning();
    return result;
  }

  async findByEventId(eventId: string): Promise<WebhookEventLogSelect[]> {
    return this.db.select()
      .from(webhookEventLogs)
      .where(eq(webhookEventLogs.eventId, eventId))
      .orderBy(desc(webhookEventLogs.timestamp));
  }
}

export class WebhookRetryQueueRepository {
  constructor(private db: AnyDb) {}

  async create(
    item: Omit<WebhookRetryQueueInsert, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WebhookRetryQueueInsert> {
    const id = nanoid();
    const now = new Date();
    const [result] = await this.db.insert(webhookRetryQueue).values({
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return result as WebhookRetryQueueInsert;
  }

  async findPending(): Promise<WebhookRetryQueueInsert[]> {
    return this.db.select()
      .from(webhookRetryQueue)
      .where(eq(webhookRetryQueue.status, 'pending'))
      .orderBy(webhookRetryQueue.scheduledAt);
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    lastError?: string,
  ): Promise<void> {
    await this.db.update(webhookRetryQueue)
      .set({ status, lastError, updatedAt: new Date() })
      .where(eq(webhookRetryQueue.id, id));
  }
}
