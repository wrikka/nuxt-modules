import { z } from "zod"

// Schemas
export const AssigneeSchema = z.object({
	name: z.string(),
	avatarUrl: z.string(),
})

export const TaskTagSchema = z.object({
	name: z.string(),
	color: z.string(),
})

export const TaskCommentSchema = z.object({
	id: z.string(),
	text: z.string(),
	createdAt: z.string(),
	user: AssigneeSchema,
})

export const SubtaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
})

export const PrioritySchema = z.enum(["Urgent", "High", "Medium", "Low", "None"])
export const SortBySchema = z.enum(["recent", "updated", "priority"])
export const StatusSchema = z.enum(["In Review", "In Progress", "In Design", "Done", "Backlog"])

export const TaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	status: StatusSchema,
	tags: z.array(TaskTagSchema),
	date: z.string(),
	updatedAt: z.string(),
	priority: PrioritySchema,
	assignee: AssigneeSchema.optional(),
	comments: z.array(TaskCommentSchema),
	subtasks: z.array(SubtaskSchema),
})

export const TaskFilterStateSchema = z.object({
	assignee: z.string().nullable(),
	searchTerm: z.string(),
	sortBy: SortBySchema,
	status: StatusSchema.nullable(),
	list: z.string().nullable().optional(),
})

// Inferred Types
export type Assignee = z.infer<typeof AssigneeSchema>
export type TaskTag = z.infer<typeof TaskTagSchema>
export type TaskComment = z.infer<typeof TaskCommentSchema>
export type Subtask = z.infer<typeof SubtaskSchema>
export type Priority = z.infer<typeof PrioritySchema>
export type SortBy = z.infer<typeof SortBySchema>
export type Status = z.infer<typeof StatusSchema>
export type Task = z.infer<typeof TaskSchema>
export type TaskFilterState = z.infer<typeof TaskFilterStateSchema>
