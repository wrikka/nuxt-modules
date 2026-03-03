import { z } from "zod"

// ============================================
// P0: Smart Notifications
// ============================================
export const NotificationTypeSchema = z.enum([
	"due_soon",
	"overdue",
	"assigned",
	"mentioned",
	"status_change",
	"comment",
	"blocked",
	"dependency_completed",
])

export const NotificationChannelSchema = z.enum(["in_app", "email", "push", "slack"])

export const NotificationSchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: NotificationTypeSchema,
	title: z.string(),
	message: z.string(),
	taskId: z.string().optional(),
	read: z.boolean(),
	channels: z.array(NotificationChannelSchema),
	createdAt: z.string(),
	metadata: z.record(z.unknown()).optional(),
})

export const NotificationPreferenceSchema = z.object({
	userId: z.string(),
	enabled: z.boolean(),
	channels: z.record(NotificationChannelSchema, z.boolean()),
	types: z.record(NotificationTypeSchema, z.object({
		enabled: z.boolean(),
		channels: z.array(NotificationChannelSchema),
	})),
	quietHours: z.object({
		enabled: z.boolean(),
		start: z.string(), // HH:mm format
		end: z.string(),
	}).optional(),
})

// ============================================
// P0: Team Collaboration
// ============================================
export const TeamMemberSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	avatarUrl: z.string(),
	role: z.enum(["admin", "member", "viewer"]),
	status: z.enum(["online", "away", "offline", "busy"]),
	lastSeen: z.string(),
})

export const ActivityTypeSchema = z.enum([
	"task_created",
	"task_updated",
	"task_deleted",
	"status_changed",
	"comment_added",
	"assigned",
	"time_logged",
	"attachment_added",
])

export const ActivityLogSchema = z.object({
	id: z.string(),
	type: ActivityTypeSchema,
	userId: z.string(),
	user: TeamMemberSchema,
	taskId: z.string().optional(),
	taskTitle: z.string().optional(),
	metadata: z.record(z.unknown()),
	createdAt: z.string(),
})

export const MentionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	mentionedBy: z.string(),
	taskId: z.string(),
	commentId: z.string(),
	read: z.boolean(),
	createdAt: z.string(),
})

// ============================================
// P1: Sprint/Iteration Planning
// ============================================
export const SprintSchema = z.object({
	id: z.string(),
	name: z.string(),
	goal: z.string(),
	status: z.enum(["planning", "active", "completed", "cancelled"]),
	startDate: z.string(),
	endDate: z.string(),
	taskIds: z.array(z.string()),
	capacity: z.number(), // Story points or hours
	velocity: z.number().optional(),
	completedPoints: z.number().optional(),
})

export const SprintBurndownSchema = z.object({
	sprintId: z.string(),
	data: z.array(z.object({
		date: z.string(),
		remaining: z.number(),
		ideal: z.number(),
	})),
})

// ============================================
// P1: Gantt Chart
// ============================================
export const GanttTaskSchema = z.object({
	taskId: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	progress: z.number().min(0).max(100),
	dependencies: z.array(z.string()), // taskIds
	milestone: z.boolean(),
})

// ============================================
// P1: Workflow Automation
// ============================================
export const AutomationRuleSchema = z.object({
	id: z.string(),
	name: z.string(),
	enabled: z.boolean(),
	trigger: z.object({
		type: z.enum([
			"status_change",
			"task_created",
			"due_date_approaching",
			"assigned",
			"custom_field_changed",
		]),
		conditions: z.array(z.object({
			field: z.string(),
			operator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]),
			value: z.unknown(),
		})),
	}),
	actions: z.array(z.object({
		type: z.enum([
			"change_status",
			"assign_user",
			"add_tag",
			"send_notification",
			"create_subtask",
			"webhook",
		]),
		config: z.record(z.unknown()),
	})),
})

// ============================================
// P1: Portfolio
// ============================================
export const ProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	status: z.enum(["active", "paused", "completed", "cancelled"]),
	taskIds: z.array(z.string()),
	memberIds: z.array(z.string()),
	startDate: z.string(),
	endDate: z.string().optional(),
	budget: z.number().optional(),
	color: z.string(),
})

// ============================================
// P2: Task Templates
// ============================================
export const TaskTemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	template: z.object({
		title: z.string(),
		description: z.string(),
		priority: z.enum(["Urgent", "High", "Medium", "Low", "None"]),
		tags: z.array(z.string()),
		subtasks: z.array(z.object({ title: z.string() })),
		estimatedTime: z.number().optional(),
	}),
	createdAt: z.string(),
})

// ============================================
// P2: Advanced Reports
// ============================================
export const ReportSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum([
		"task_summary",
		"time_tracking",
		"velocity",
		"burndown",
		"workload",
		"custom",
	]),
	config: z.record(z.unknown()),
	filters: z.record(z.unknown()),
	schedule: z.object({
		enabled: z.boolean(),
		frequency: z.enum(["daily", "weekly", "monthly"]),
		recipients: z.array(z.string()),
	}).optional(),
	createdAt: z.string(),
})

// ============================================
// P2: Document Attachments
// ============================================
export const AttachmentSchema = z.object({
	id: z.string(),
	taskId: z.string(),
	name: z.string(),
	url: z.string(),
	size: z.number(),
	mimeType: z.string(),
	uploadedBy: z.string(),
	uploadedAt: z.string(),
	versions: z.array(z.object({
		version: z.number(),
		url: z.string(),
		uploadedAt: z.string(),
	})).optional(),
})

// ============================================
// P3: Gamification
// ============================================
export const UserGamificationSchema = z.object({
	userId: z.string(),
	points: z.number(),
	level: z.number(),
	badges: z.array(z.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		icon: z.string(),
		earnedAt: z.string(),
	})),
	streak: z.object({
		current: z.number(),
		longest: z.number(),
		lastCompletedAt: z.string(),
	}),
	stats: z.record(z.string(), z.number()),
})

// Inferred Types
export type Notification = z.infer<typeof NotificationSchema>
export type NotificationPreference = z.infer<typeof NotificationPreferenceSchema>
export type TeamMember = z.infer<typeof TeamMemberSchema>
export type ActivityLog = z.infer<typeof ActivityLogSchema>
export type Mention = z.infer<typeof MentionSchema>
export type Sprint = z.infer<typeof SprintSchema>
export type SprintBurndown = z.infer<typeof SprintBurndownSchema>
export type GanttTask = z.infer<typeof GanttTaskSchema>
export type AutomationRule = z.infer<typeof AutomationRuleSchema>
export type Project = z.infer<typeof ProjectSchema>
export type TaskTemplate = z.infer<typeof TaskTemplateSchema>
export type Report = z.infer<typeof ReportSchema>
export type Attachment = z.infer<typeof AttachmentSchema>
export type UserGamification = z.infer<typeof UserGamificationSchema>
