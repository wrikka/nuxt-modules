import { z } from "zod"

// AI Message Types
export const AIMessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "assistant", "system"]),
	content: z.string(),
	timestamp: z.string(),
	metadata: z.record(z.unknown()).optional(),
})

export const AISuggestionSchema = z.object({
	type: z.enum(["priority", "subtasks", "estimate", "tags", "assignee"]),
	content: z.string(),
	confidence: z.number().min(0).max(1),
	data: z.record(z.unknown()),
})

export const AIChatSessionSchema = z.object({
	id: z.string(),
	taskId: z.string().optional(),
	messages: z.array(AIMessageSchema),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export const AIGeneratedSubtaskSchema = z.object({
	title: z.string(),
	estimatedMinutes: z.number().optional(),
	priority: z.enum(["Urgent", "High", "Medium", "Low", "None"]).optional(),
})

export const AITaskAnalysisSchema = z.object({
	suggestedPriority: z.enum(["Urgent", "High", "Medium", "Low", "None"]).optional(),
	suggestedTags: z.array(z.string()).optional(),
	estimatedHours: z.number().optional(),
	subtasks: z.array(AIGeneratedSubtaskSchema).optional(),
	summary: z.string().optional(),
	confidence: z.number().min(0).max(1),
})

// Inferred Types
export type AIMessage = z.infer<typeof AIMessageSchema>
export type AISuggestion = z.infer<typeof AISuggestionSchema>
export type AIChatSession = z.infer<typeof AIChatSessionSchema>
export type AIGeneratedSubtask = z.infer<typeof AIGeneratedSubtaskSchema>
export type AITaskAnalysis = z.infer<typeof AITaskAnalysisSchema>
