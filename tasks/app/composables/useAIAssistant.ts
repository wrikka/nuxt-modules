import type { AIMessage, AIChatSession, AITaskAnalysis, AIGeneratedSubtask } from "~/shared/types/ai"
import type { Task } from "~/shared/types/task"

export interface UseAIAssistantOptions {
	taskId?: string
	autoAnalyze?: boolean
}

/**
 * Composable for AI Task Assistant functionality
 */
export const useAIAssistant = (options: UseAIAssistantOptions = {}) => {
	const { $toast } = useNuxtApp()
	const { taskId, autoAnalyze = false } = options

	// State
	const currentSession = useState<AIChatSession | null>("ai-current-session", () => null)
	const isLoading = useState<boolean>("ai-is-loading", () => false)
	const suggestions = useState<AITaskAnalysis | null>("ai-suggestions", () => null)
	const chatHistory = useState<AIChatSession[]>("ai-chat-history", () => [])

	/**
	 * Initialize a new chat session
	 */
	const initSession = () => {
		const session: AIChatSession = {
			id: crypto.randomUUID(),
			taskId,
			messages: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}
		currentSession.value = session
		return session
	}

	/**
	 * Send message to AI and get response
	 */
	const sendMessage = async (content: string): Promise<AIMessage | null> => {
		if (!currentSession.value) {
			initSession()
		}

		const userMessage: AIMessage = {
			id: crypto.randomUUID(),
			role: "user",
			content,
			timestamp: new Date().toISOString(),
		}

		// Add user message to session
		currentSession.value?.messages.push(userMessage)
		isLoading.value = true

		try {
			const { data, error } = await useFetch<AIMessage>("/api/ai/chat", {
				method: "POST",
				body: {
					sessionId: currentSession.value?.id,
					taskId,
					message: content,
					history: currentSession.value?.messages.slice(-10), // Last 10 messages for context
				},
			})

			if (error.value) {
				$toast.error("Failed to get AI response")
				return null
			}

			if (data.value) {
				currentSession.value?.messages.push(data.value)
				return data.value
			}
		} catch (err) {
			$toast.error("AI service error")
			console.error("AI chat error:", err)
		} finally {
			isLoading.value = false
		}

		return null
	}

	/**
	 * Analyze a task and get AI suggestions
	 */
	const analyzeTask = async (task: Task): Promise<AITaskAnalysis | null> => {
		isLoading.value = true

		try {
			const { data, error } = await useFetch<AITaskAnalysis>("/api/ai/analyze-task", {
				method: "POST",
				body: {
					taskId: task.id,
					title: task.title,
					description: task.description,
					currentPriority: task.priority,
					currentTags: task.tags.map(t => t.name),
				},
			})

			if (error.value) {
				$toast.error("Failed to analyze task")
				return null
			}

			if (data.value) {
				suggestions.value = data.value
				return data.value
			}
		} catch (err) {
			$toast.error("AI analysis error")
			console.error("AI analysis error:", err)
		} finally {
			isLoading.value = false
		}

		return null
	}

	/**
	 * Generate subtasks from task description
	 */
	const generateSubtasks = async (description: string): Promise<AIGeneratedSubtask[]> => {
		isLoading.value = true

		try {
			const { data, error } = await useFetch<AIGeneratedSubtask[]>("/api/ai/generate-subtasks", {
				method: "POST",
				body: { description },
			})

			if (error.value) {
				$toast.error("Failed to generate subtasks")
				return []
			}

			return data.value || []
		} catch (err) {
			$toast.error("Subtask generation error")
			console.error("Subtask generation error:", err)
			return []
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * Apply AI suggestion to task
	 */
	const applySuggestion = async (
		taskId: string,
		suggestionType: "priority" | "tags" | "estimate",
		value: unknown
	): Promise<boolean> => {
		try {
			const updateData: Record<string, unknown> = {}

			switch (suggestionType) {
				case "priority":
					updateData.priority = value
					break
				case "tags":
					updateData.tags = value
					break
				case "estimate":
					updateData.estimatedTime = value
					break
			}

			const { error } = await useFetch(`/api/tasks/${taskId}`, {
				method: "PATCH",
				body: updateData,
			})

			if (error.value) {
				$toast.error("Failed to apply suggestion")
				return false
			}

			$toast.success("Suggestion applied")
			return true
		} catch (err) {
			$toast.error("Error applying suggestion")
			console.error("Apply suggestion error:", err)
			return false
		}
	}

	/**
	 * Clear current session
	 */
	const clearSession = () => {
		currentSession.value = null
		suggestions.value = null
	}

	/**
	 * Save chat session to history
	 */
	const saveSession = () => {
		if (currentSession.value) {
			chatHistory.value.unshift({ ...currentSession.value })
			// Keep only last 50 sessions
			if (chatHistory.value.length > 50) {
				chatHistory.value = chatHistory.value.slice(0, 50)
			}
		}
	}

	// Auto-analyze if enabled and taskId provided
	if (autoAnalyze && taskId) {
		const tasks = useState<Task[]>("tasks")
		const task = tasks.value?.find(t => t.id === taskId)
		if (task) {
			analyzeTask(task)
		}
	}

	return {
		currentSession: readonly(currentSession),
		isLoading: readonly(isLoading),
		suggestions: readonly(suggestions),
		chatHistory: readonly(chatHistory),
		initSession,
		sendMessage,
		analyzeTask,
		generateSubtasks,
		applySuggestion,
		clearSession,
		saveSession,
	}
}
