import { z } from "zod"

// Custom Field Types
export const CustomFieldTypeSchema = z.enum([
	"text",
	"number",
	"date",
	"select",
	"multiSelect",
	"checkbox",
	"url",
	"email",
])

export const CustomFieldSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: CustomFieldTypeSchema,
	options: z.array(z.string()).optional(),
	required: z.boolean().default(false),
})

export const CustomFieldValueSchema = z.object({
	fieldId: z.string(),
	value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
})

// Time Entry
export const TimeEntrySchema = z.object({
	id: z.string(),
	taskId: z.string(),
	userId: z.string(),
	startTime: z.string(),
	endTime: z.string().optional(),
	duration: z.number(), // in minutes
	description: z.string().optional(),
	billable: z.boolean().default(false),
})

// Task Dependency
export const TaskDependencySchema = z.object({
	id: z.string(),
	sourceTaskId: z.string(),
	targetTaskId: z.string(),
	type: z.enum(["blocks", "blockedBy", "relatesTo", "duplicates"]),
})

// Recurring Task Config
export const RecurringConfigSchema = z.object({
	enabled: z.boolean(),
	frequency: z.enum(["daily", "weekly", "monthly", "custom"]),
	interval: z.number().default(1),
	weekDays: z.array(z.number()).optional(), // 0-6 for weekly
	monthDay: z.number().optional(), // 1-31 for monthly
	endDate: z.string().optional(),
	maxOccurrences: z.number().optional(),
})

// Original Schemas
export const AssigneeSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatarUrl: z.string(),
	email: z.string().optional(),
})

export const TaskTagSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string(),
})

export const TaskCommentSchema = z.object({
	id: z.string(),
	text: z.string(),
	createdAt: z.string(),
	updatedAt: z.string().optional(),
	user: AssigneeSchema,
	mentions: z.array(z.string()).optional(),
})

export const SubtaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
	assignee: AssigneeSchema.optional(),
	dueDate: z.string().optional(),
})

export const PrioritySchema = z.enum(["Urgent", "High", "Medium", "Low", "None"])
export const SortBySchema = z.enum(["recent", "updated", "priority", "dueDate", "title"])
export const StatusSchema = z.enum(["In Review", "In Progress", "In Design", "Done", "Backlog", "Cancelled"])

export const TaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	status: StatusSchema,
	tags: z.array(TaskTagSchema),
	createdAt: z.string(),
	updatedAt: z.string(),
	dueDate: z.string().optional(),
	startDate: z.string().optional(),
	completedAt: z.string().optional(),
	priority: PrioritySchema,
	assignee: AssigneeSchema.optional(),
	comments: z.array(TaskCommentSchema),
	subtasks: z.array(SubtaskSchema),
	// New fields
	customFields: z.array(CustomFieldValueSchema).default([]),
	timeEntries: z.array(TimeEntrySchema).default([]),
	dependencies: z.array(TaskDependencySchema).default([]),
	recurringConfig: RecurringConfigSchema.optional(),
	parentTaskId: z.string().optional(),
	estimatedTime: z.number().optional(), // in minutes
	actualTime: z.number().optional(), // in minutes
	progress: z.number().min(0).max(100).default(0),
})

export const TaskFilterStateSchema = z.object({
	assignee: z.string().nullable(),
	searchTerm: z.string(),
	sortBy: SortBySchema,
	status: StatusSchema.nullable(),
	list: z.string().nullable().optional(),
	// New filters
	priority: PrioritySchema.nullable().optional(),
	tags: z.array(z.string()).optional(),
	dueDateFrom: z.string().nullable().optional(),
	dueDateTo: z.string().nullable().optional(),
	assignees: z.array(z.string()).optional(),
	customFieldFilters: z.array(z.object({
		fieldId: z.string(),
		operator: z.enum(["equals", "notEquals", "contains", "greaterThan", "lessThan"]),
		value: z.union([z.string(), z.number(), z.boolean()]),
	})).optional(),
})

// View Types
export const ViewSchema = z.enum(["list", "kanban", "calendar", "timeline", "table"])
export const GroupBySchema = z.enum(["status", "assignee", "priority", "dueDate", "none"])
export const FieldSchema = z.enum([
	"tags",
	"assignee",
	"comments",
	"subtasks",
	"date",
	"dueDate",
	"priority",
	"timeTracking",
	"dependencies",
	"customFields",
])

// Search Types
export const SearchOperatorSchema = z.enum([
	"equals",
	"notEquals",
	"contains",
	"notContains",
	"startsWith",
	"endsWith",
	"greaterThan",
	"lessThan",
	"between",
	"in",
	"notIn",
	"isEmpty",
	"isNotEmpty",
])

export const SearchFilterSchema = z.object({
	field: z.string(),
	operator: SearchOperatorSchema,
	value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
})

export const SavedSearchSchema = z.object({
	id: z.string(),
	name: z.string(),
	filters: z.array(SearchFilterSchema),
	sortBy: SortBySchema.optional(),
	groupBy: GroupBySchema.optional(),
	view: ViewSchema.optional(),
})

// Analytics Types
export const TaskAnalyticsSchema = z.object({
	totalTasks: z.number(),
	completedTasks: z.number(),
	inProgressTasks: z.number(),
	overdueTasks: z.number(),
	averageCompletionTime: z.number(), // in hours
	tasksByStatus: z.record(z.number()),
	tasksByPriority: z.record(z.number()),
	tasksByAssignee: z.record(z.number()),
	timeTrackedTotal: z.number(), // in minutes
	timeTrackedByUser: z.record(z.number()),
})

// Inferred Types
export type CustomFieldType = z.infer<typeof CustomFieldTypeSchema>
export type CustomField = z.infer<typeof CustomFieldSchema>
export type CustomFieldValue = z.infer<typeof CustomFieldValueSchema>
export type TimeEntry = z.infer<typeof TimeEntrySchema>
export type TaskDependency = z.infer<typeof TaskDependencySchema>
export type RecurringConfig = z.infer<typeof RecurringConfigSchema>
export type Assignee = z.infer<typeof AssigneeSchema>
export type TaskTag = z.infer<typeof TaskTagSchema>
export type TaskComment = z.infer<typeof TaskCommentSchema>
export type Subtask = z.infer<typeof SubtaskSchema>
export type Priority = z.infer<typeof PrioritySchema>
export type SortBy = z.infer<typeof SortBySchema>
export type Status = z.infer<typeof StatusSchema>
export type Task = z.infer<typeof TaskSchema>
export type TaskFilterState = z.infer<typeof TaskFilterStateSchema>
