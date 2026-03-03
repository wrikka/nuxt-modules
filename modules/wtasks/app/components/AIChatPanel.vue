<script setup lang="ts">
import type { AIMessage, AITaskAnalysis } from "~/shared/types/ai"
import type { Task } from "~/shared/types/task"

interface Props {
	task?: Task
	isOpen?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
	close: []
	applySuggestion: [type: "priority" | "tags" | "estimate", value: unknown]
	applySubtasks: [subtasks: { title: string; estimatedMinutes?: number; priority?: string }[]]
}>()

const { currentSession, isLoading, suggestions, sendMessage, analyzeTask, generateSubtasks, clearSession } = useAIAssistant({
	taskId: props.task?.id,
	autoAnalyze: !!props.task,
})

const inputMessage = ref("")
const messagesContainer = ref<HTMLElement>()
const showSuggestions = ref(true)

// Auto-scroll to bottom
watch(() => currentSession.value?.messages.length, async () => {
	await nextTick()
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
	}
})

// Send message
const handleSend = async () => {
	if (!inputMessage.value.trim() || isLoading.value) return
	const message = inputMessage.value
	inputMessage.value = ""
	await sendMessage(message)
}

// Quick actions
const quickActions = [
	{ label: "Analyze this task", icon: "mdi:magnify", action: () => props.task && analyzeTask(props.task) },
	{ label: "Generate subtasks", icon: "mdi:subtasks", action: () => props.task?.description && generateSubtasks(props.task.description) },
	{ label: "Suggest priority", icon: "mdi:flag", action: () => props.task && analyzeTask(props.task) },
	{ label: "Estimate time", icon: "mdi:clock", action: () => props.task && analyzeTask(props.task) },
]

// Apply suggestion handlers
const handleApplyPriority = (priority: string) => {
	emit("applySuggestion", "priority", priority)
}

const handleApplyTags = (tags: string[]) => {
	emit("applySuggestion", "tags", tags.map(name => ({ name, color: "#94a3b8" })))
}

const handleApplyEstimate = (hours: number) => {
	emit("applySuggestion", "estimate", hours * 60)
}

const handleApplySubtasks = (subtasks: { title: string; estimatedMinutes?: number; priority?: string }[]) => {
	emit("applySubtasks", subtasks)
}

// Close panel
const handleClose = () => {
	emit("close")
}
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl flex flex-col z-50"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<Icon name="mdi:robot" class="w-5 h-5 text-purple-600" />
				<h3 class="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
			</div>
			<div class="flex items-center gap-2">
				<button
					v-if="currentSession?.messages.length"
					class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
					title="Clear conversation"
					@click="clearSession"
				>
					<Icon name="mdi:refresh" class="w-4 h-4" />
				</button>
				<button
					class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
					@click="handleClose"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Quick Actions -->
		<div v-if="task" class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
			<div class="flex flex-wrap gap-2">
				<button
					v-for="action in quickActions"
					:key="action.label"
					class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					@click="action.action"
				>
					<Icon :name="action.icon" class="w-3.5 h-3.5" />
					{{ action.label }}
				</button>
			</div>
		</div>

		<!-- Suggestions Panel -->
		<div v-if="suggestions && showSuggestions && task" class="p-3 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-purple-900 dark:text-purple-300">AI Suggestions</span>
				<button
					class="text-xs text-purple-700 dark:text-purple-400 hover:underline"
					@click="showSuggestions = false"
				>
					Hide
				</button>
			</div>

			<!-- Priority Suggestion -->
			<div v-if="suggestions.suggestedPriority" class="flex items-center justify-between py-2 border-b border-purple-200 dark:border-purple-800/50 last:border-0">
				<div class="flex items-center gap-2">
					<Icon name="mdi:flag" class="w-4 h-4 text-purple-600" />
					<span class="text-sm text-gray-700 dark:text-gray-300">
						Priority: <span class="font-medium">{{ suggestions.suggestedPriority }}</span>
					</span>
					<span class="text-xs text-gray-500">({{ Math.round(suggestions.confidence * 100) }}% confidence)</span>
				</div>
				<button
					class="px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 rounded hover:bg-purple-200 dark:hover:bg-purple-900/60"
					@click="handleApplyPriority(suggestions.suggestedPriority!)"
				>
					Apply
				</button>
			</div>

			<!-- Estimate Suggestion -->
			<div v-if="suggestions.estimatedHours" class="flex items-center justify-between py-2 border-b border-purple-200 dark:border-purple-800/50 last:border-0">
				<div class="flex items-center gap-2">
					<Icon name="mdi:clock" class="w-4 h-4 text-purple-600" />
					<span class="text-sm text-gray-700 dark:text-gray-300">
						Estimate: <span class="font-medium">{{ suggestions.estimatedHours }}h</span>
					</span>
				</div>
				<button
					class="px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 rounded hover:bg-purple-200 dark:hover:bg-purple-900/60"
					@click="handleApplyEstimate(suggestions.estimatedHours!)"
				>
					Apply
				</button>
			</div>

			<!-- Tags Suggestion -->
			<div v-if="suggestions.suggestedTags?.length" class="py-2 border-b border-purple-200 dark:border-purple-800/50 last:border-0">
				<div class="flex items-center gap-2 mb-2">
					<Icon name="mdi:tag" class="w-4 h-4 text-purple-600" />
					<span class="text-sm text-gray-700 dark:text-gray-300">Suggested tags:</span>
				</div>
				<div class="flex flex-wrap gap-1.5 mb-2">
					<span
						v-for="tag in suggestions.suggestedTags"
						:key="tag"
						class="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded-full"
					>
						{{ tag }}
					</span>
				</div>
				<button
					class="px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 rounded hover:bg-purple-200 dark:hover:bg-purple-900/60"
					@click="handleApplyTags(suggestions.suggestedTags)"
				>
					Apply all tags
				</button>
			</div>

			<!-- Subtasks Suggestion -->
			<div v-if="suggestions.subtasks?.length" class="py-2">
				<div class="flex items-center gap-2 mb-2">
					<Icon name="mdi:subtasks" class="w-4 h-4 text-purple-600" />
					<span class="text-sm text-gray-700 dark:text-gray-300">Suggested subtasks:</span>
				</div>
				<ul class="space-y-1 mb-2">
					<li
						v-for="subtask in suggestions.subtasks"
						:key="subtask.title"
						class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
					>
						<Icon name="mdi:checkbox-blank-circle-outline" class="w-3.5 h-3.5" />
						{{ subtask.title }}
						<span v-if="subtask.estimatedMinutes" class="text-xs text-gray-500">({{ subtask.estimatedMinutes }}m)</span>
					</li>
				</ul>
				<button
					class="px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 rounded hover:bg-purple-200 dark:hover:bg-purple-900/60"
					@click="handleApplySubtasks(suggestions.subtasks)"
				>
					Add all subtasks
				</button>
			</div>
		</div>

		<!-- Messages -->
		<div
			ref="messagesContainer"
			class="flex-1 overflow-y-auto p-4 space-y-4"
		>
			<div v-if="!currentSession?.messages.length" class="text-center py-8">
				<Icon name="mdi:robot-outline" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
				<p class="text-sm text-gray-500 dark:text-gray-400">
					{{ task ? "Ask me to analyze this task or suggest improvements" : "Start a conversation with the AI assistant" }}
				</p>
			</div>

			<div
				v-for="message in currentSession?.messages"
				:key="message.id"
				class="flex gap-3"
				:class="message.role === 'user' ? 'justify-end' : 'justify-start'"
			>
				<!-- AI Avatar -->
				<div
					v-if="message.role === 'assistant'"
					class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0"
				>
					<Icon name="mdi:robot" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
				</div>

				<!-- Message Bubble -->
				<div
					class="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm"
					:class="message.role === 'user'
						? 'bg-purple-600 text-white rounded-br-md'
						: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'"
				>
					{{ message.content }}
				</div>
			</div>

			<!-- Loading Indicator -->
			<div v-if="isLoading" class="flex gap-3 justify-start">
				<div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
					<Icon name="mdi:robot" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
				</div>
				<div class="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md">
					<div class="flex gap-1">
						<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
						<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
						<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
					</div>
				</div>
			</div>
		</div>

		<!-- Input Area -->
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex gap-2">
				<input
					v-model="inputMessage"
					type="text"
					placeholder="Ask the AI assistant..."
					class="flex-1 px-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
					@keydown.enter="handleSend"
				>
				<button
					class="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					:disabled="!inputMessage.trim() || isLoading"
					@click="handleSend"
				>
					<Icon name="mdi:send" class="w-5 h-5" />
				</button>
			</div>
		</div>
	</div>
</template>
