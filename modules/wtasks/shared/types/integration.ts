import { z } from "zod"

// GitHub Integration Types
export const GitHubCommitSchema = z.object({
	sha: z.string(),
	message: z.string(),
	author: z.string(),
	date: z.string(),
	url: z.string(),
})

export const GitHubPRSchema = z.object({
	id: z.number(),
	number: z.number(),
	title: z.string(),
	state: z.enum(["open", "closed", "merged"]),
	author: z.string(),
	branch: z.string(),
	baseBranch: z.string(),
	url: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	mergedAt: z.string().optional(),
})

export const GitLabCommitSchema = z.object({
	id: z.string(),
	message: z.string(),
	author: z.string(),
	date: z.string(),
	url: z.string(),
})

export const GitLabMRSchema = z.object({
	id: z.number(),
	iid: z.number(),
	title: z.string(),
	state: z.enum(["opened", "closed", "merged", "locked"]),
	author: z.string(),
	sourceBranch: z.string(),
	targetBranch: z.string(),
	url: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	mergedAt: z.string().optional(),
})

export const GitIntegrationSchema = z.object({
	provider: z.enum(["github", "gitlab", "bitbucket"]),
	repository: z.string(),
	commits: z.array(z.union([GitHubCommitSchema, GitLabCommitSchema])),
	pullRequests: z.array(z.union([GitHubPRSchema, GitLabMRSchema])),
	linkedAt: z.string(),
})

// Webhook Types
export const WebhookProviderSchema = z.enum(["slack", "discord"])

export const WebhookConfigSchema = z.object({
	id: z.string(),
	provider: WebhookProviderSchema,
	url: z.string(),
	name: z.string(),
	events: z.array(z.enum([
		"task.created",
		"task.updated",
		"task.deleted",
		"task.completed",
		"comment.created",
		"comment.updated",
	])),
	isActive: z.boolean(),
	createdAt: z.string(),
})

// Figma Types
export const FigmaFrameSchema = z.object({
	id: z.string(),
	name: z.string(),
	thumbnailUrl: z.string(),
	url: z.string(),
	lastModified: z.string(),
})

export const FigmaFileSchema = z.object({
	id: z.string(),
	name: z.string(),
	thumbnailUrl: z.string(),
	url: z.string(),
	frames: z.array(FigmaFrameSchema),
	linkedAt: z.string(),
})

// Task Integration Link
export const TaskIntegrationLinkSchema = z.object({
	taskId: z.string(),
	git: GitIntegrationSchema.optional(),
	figma: z.array(FigmaFileSchema).optional(),
	webhooks: z.array(WebhookConfigSchema).optional(),
})

// Inferred Types
export type GitHubCommit = z.infer<typeof GitHubCommitSchema>
export type GitHubPR = z.infer<typeof GitHubPRSchema>
export type GitLabCommit = z.infer<typeof GitLabCommitSchema>
export type GitLabMR = z.infer<typeof GitLabMRSchema>
export type GitIntegration = z.infer<typeof GitIntegrationSchema>
export type WebhookProvider = z.infer<typeof WebhookProviderSchema>
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>
export type FigmaFrame = z.infer<typeof FigmaFrameSchema>
export type FigmaFile = z.infer<typeof FigmaFileSchema>
export type TaskIntegrationLink = z.infer<typeof TaskIntegrationLinkSchema>
