<script setup lang="ts">
export interface Comment {
	id: string;
	content: string;
	author: string;
	position: { x: number; y: number };
	resolved: boolean;
	timestamp: number;
	replies: Reply[];
}

export interface Reply {
	id: string;
	content: string;
	author: string;
	timestamp: number;
}

const props = defineProps<{
	comments: Comment[];
	currentUser: string;
	isAddingComment: boolean;
}>();

const emit = defineEmits<{
	(e: "add", position: { x: number; y: number }): void;
	(e: "reply", commentId: string, content: string): void;
	(e: "resolve", commentId: string): void;
	(e: "delete", commentId: string): void;
	(e: "select", commentId: string): void;
	(e: "toggleAddingMode"): void;
}>();

const newReply = ref("");
const replyingTo = ref<string | null>(null);

const unresolvedCount = computed(() =>
	props.comments.filter(c => !c.resolved).length
);

const formatTime = (timestamp: number): string => {
	return new Date(timestamp).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const submitReply = (commentId: string) => {
	if (!newReply.value.trim()) return;
	emit("reply", commentId, newReply.value);
	newReply.value = "";
	replyingTo.value = null;
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
				Comments ({{ unresolvedCount }} unresolved)
			</h3>
			<button
				type="button"
				class="p-1.5 rounded text-xs transition-colors"
				:class="isAddingComment
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
				@click="$emit('toggleAddingMode')"
			>
				<svg
					class="w-3 h-3 inline mr-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				{{ isAddingComment ? "Click on canvas" : "Add Comment" }}
			</button>
		</div>

		<div
			v-if="comments.length === 0"
			class="text-center py-4 text-sm text-gray-500 dark:text-gray-400"
		>
			No comments yet
		</div>

		<div v-else class="space-y-2 max-h-64 overflow-y-auto">
			<div
				v-for="comment in comments"
				:key="comment.id"
				class="p-3 rounded-lg border transition-all"
				:class="comment.resolved
				? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
				: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'"
				@click="$emit('select', comment.id)"
			>
				<div class="flex items-start gap-2">
					<div
						class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
						:class="comment.resolved
						? 'bg-green-100 text-green-600'
						: 'bg-blue-100 text-blue-600'"
					>
						{{ comment.author?.[0]?.toUpperCase() ?? "?" }}
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span
								class="text-xs font-medium text-gray-700 dark:text-gray-300"
							>{{ comment.author }}</span>
							<span class="text-xs text-gray-400">{{
								formatTime(comment.timestamp)
							}}</span>
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
							{{ comment.content }}
						</p>

						<div
							v-if="comment.replies.length > 0"
							class="mt-2 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
						>
							<div
								v-for="reply in comment.replies"
								:key="reply.id"
								class="text-sm"
							>
								<span class="font-medium text-gray-700 dark:text-gray-300">{{
										reply.author
									}}:</span>
								<span class="text-gray-600 dark:text-gray-400">{{
									reply.content
								}}</span>
								<span class="text-xs text-gray-400 ml-1">{{
									formatTime(reply.timestamp)
								}}</span>
							</div>
						</div>

						<div v-if="replyingTo === comment.id" class="mt-2 flex gap-1">
							<input
								v-model="newReply"
								type="text"
								placeholder="Write a reply..."
								class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
								@keyup.enter="submitReply(comment.id)"
							>
							<button
								type="button"
								class="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
								@click="submitReply(comment.id)"
							>
								Reply
							</button>
						</div>

						<div class="flex items-center gap-2 mt-2">
							<button
								type="button"
								class="text-xs text-blue-500 hover:text-blue-600"
								@click.stop="replyingTo = replyingTo === comment.id ? null : comment.id"
							>
								{{ replyingTo === comment.id ? "Cancel" : "Reply" }}
							</button>
							<button
								type="button"
								class="text-xs"
								:class="comment.resolved
								? 'text-orange-500 hover:text-orange-600'
								: 'text-green-500 hover:text-green-600'"
								@click.stop="$emit('resolve', comment.id)"
							>
								{{ comment.resolved ? "Reopen" : "Resolve" }}
							</button>
							<button
								type="button"
								class="text-xs text-red-500 hover:text-red-600"
								@click.stop="$emit('delete', comment.id)"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
