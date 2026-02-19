import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
const workflowTriggerSchema = z.object({
  event: z.string(),
  conditions: z.record(z.any()).optional()
});
const workflowActionSchema = z.object({
  type: z.string(),
  config: z.record(z.any())
});
export const workflows = pgTable("workflows", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  // 'abandoned_cart' | 'welcome' | 'order_confirmation' | 'custom'
  trigger: jsonb("trigger").$type(),
  actions: jsonb("actions").$type(),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export const workflowExecutions = pgTable("workflow_executions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  workflowId: text("workflow_id").references(() => workflows.id).notNull(),
  triggerData: jsonb("trigger_data").$type(),
  status: text("status").notNull(),
  // 'pending' | 'running' | 'completed' | 'failed'
  result: jsonb("result").$type(),
  error: text("error"),
  executedAt: timestamp("executed_at").defaultNow()
});
export const workflowsRelations = relations(workflows, ({ many }) => ({
  executions: many(workflowExecutions)
}));
export const workflowExecutionsRelations = relations(workflowExecutions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowExecutions.workflowId],
    references: [workflows.id]
  })
}));
