<script setup lang="ts">
import type { Comment } from "#shared/types";

interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
	addComment: [comment: Partial<Comment>];
}>();

const comments = ref<Comment[]>([
	{
		id: "1",
		projectId: "project-1",
		content: "ส่วนนี้ควรเพิ่ม spacing ให้มากขึ้น ดูแน่นไปหน่อย",
		userId: "user1",
		userName: "Jane",
		userAvatar: "",
		createdAt: new Date(Date.now() - 3600000),
		updatedAt: new Date(Date.now() - 3600000),
		x: 200,
		y: 150,
		resolved: false,
		replies: [
			{
				id: "r1",
				content: "เห็นด้วยครับ จะปรับให้",
				userId: "user2",
				userName: "John",
				userAvatar: "",
				createdAt: new Date(Date.now() - 1800000),
			},
		],
	},
	{
		id: "2",
		projectId: "project-1",
		content: "สีตรงนี้ตัดกันเกินไป ควรเปลี่ยนให้ contrast ลดลง",
		userId: "user3",
		userName: "Alice",
		userAvatar: "",
		createdAt: new Date(Date.now() - 7200000),
		updatedAt: new Date(Date.now() - 7200000),
		elementId: "hero-text",
		x: 0,
		y: 0,
		resolved: true,
		replies: [],
	},
]);

const newComment = ref("");
const activeFilter = ref<"all" | "unresolved" | "resolved">("all");
const showResolved = ref(false);

const filteredComments = computed(() => {
	let filtered = comments.value;
	if (activeFilter.value === "unresolved") {
		filtered = filtered.filter(c => !c.resolved);
	} else if (activeFilter.value === "resolved") {
		filtered = filtered.filter(c => c.resolved);
	}
	return filtered;
});

const formatTime = (date: Date) => {
	const diff = Date.now() - date.getTime();
	if (diff < 60000) return "Just now";
	if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
	return date.toLocaleDateString();
};

const addComment = () => {
	if (!newComment.value.trim()) return;

	const comment: Comment = {
		id: crypto.randomUUID(),
		projectId: "project-1",
		content: newComment.value,
		userId: "me",
		userName: "You",
		userAvatar: "",
		createdAt: new Date(),
		updatedAt: new Date(),
		x: 0,
		y: 0,
		resolved: false,
		replies: [],
	};

	comments.value.unshift(comment);
	newComment.value = "";
};

const toggleResolve = (comment: Comment) => {
	comment.resolved = !comment.resolved;
};

const replyingTo = ref<string | null>(null);
const replyText = ref("");

const addReply = (commentId: string) => {
	if (!replyText.value.trim()) return;

	const comment = comments.value.find(c => c.id === commentId);
	if (comment) {
		comment.replies.push({
			id: crypto.randomUUID(),
			content: replyText.value,
			userId: "me",
			userName: "You",
			userAvatar: "",
			createdAt: new Date(),
		});
	}

	replyingTo.value = null;
	replyText.value = "";
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-40"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<Icon name="mdi:message" class="w-5 h-5 text-green-500" />
				<h3 class="font-semibold text-gray-900 dark:text-white">Comments</h3>
				<span
					class="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
				>
					{{ filteredComments.length }}
				</span>
			</div>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>

		<!-- Filters -->
		<div class="flex border-b border-gray-200 dark:border-gray-700">
			<button
				v-for='filter in ["all", "unresolved", "resolved"] as const'
				:key="filter"
				:class="[
					'flex-1 py-2 text-xs font-medium transition-colors capitalize',
					activeFilter === filter
						? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
						: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
				]"
				@click="activeFilter = filter"
			>
				{{ filter }}
				<span
					v-if="filter === 'unresolved' && comments.filter(c =>
						!c.resolved
					).length > 0"
					class="ml-1 px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded text-[10px]"
				>
					{{ comments.filter(c => !c.resolved).length }}
				</span>
			</button>
		</div>

		<!-- Comments List -->
		<div class="flex-1 overflow-y-auto p-4 space-y-4">
			<div
				v-for="comment in filteredComments"
				:key="comment.id"
				:class="[
					'border rounded-lg p-3 transition-all',
					comment.resolved
						? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
						: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
				]"
			>
				<!-- Comment Header -->
				<div class="flex items-start gap-2 mb-2">
					<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
						{{ comment.userName[0] }}
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="font-medium text-sm text-gray-900 dark:text-white">{{
								comment.userName
							}}</span>
							<span class="text-xs text-gray-400">{{
								formatTime(comment.createdAt)
							}}</span>
						</div>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							<span v-if="comment.x !== undefined && comment.y !== undefined">📍
								{{ comment.x }}, {{ comment.y }}</span>
							<span v-else-if="comment.elementId">🔗 {{
									comment.elementId
								}}</span>
						</p>
					</div>
					<button
						:class="[
							'p-1 rounded transition-colors',
							comment.resolved
								? 'text-green-500 bg-green-100 dark:bg-green-900/30'
								: 'text-gray-400 hover:text-green-500',
						]"
						@click="toggleResolve(comment)"
					>
						<Icon name="mdi:check" class="w-4 h-4" />
					</button>
				</div>

				<!-- Comment Text -->
				<p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
					{{ comment.content }}
				</p>

				<!-- Replies -->
				<div v-if="comment.replies.length > 0" class="mt-3 space-y-2">
					<div
						v-for="reply in comment.replies"
						:key="reply.id"
						class="flex gap-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
					>
						<div class="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-xs">
							{{ reply.userName[0] }}
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<span
									class="font-medium text-xs text-gray-900 dark:text-white"
								>{{ reply.userName }}</span>
								<span class="text-[10px] text-gray-400">{{
									formatTime(reply.createdAt)
								}}</span>
							</div>
							<p class="text-xs text-gray-600 dark:text-gray-400">
								{{ reply.content }}
							</p>
						</div>
					</div>
				</div>

				<!-- Reply Input -->
				<div v-if="replyingTo === comment.id" class="mt-3 pl-4">
					<div class="flex gap-2">
						<input
							v-model="replyText"
							type="text"
							placeholder="Reply..."
							class="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
							@keyup.enter="addReply(comment.id)"
						>
						<button
							class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs transition-colors"
							@click="addReply(comment.id)"
						>
							Reply
						</button>
					</div>
				</div>

				<!-- Actions -->
				<div v-else class="flex gap-2 mt-2">
					<button
						class="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
						@click="replyingTo = comment.id"
					>
						Reply
					</button>
					<button class="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
						Delete
					</button>
				</div>
			</div>

			<!-- Empty State -->
			<div v-if="filteredComments.length === 0" class="text-center py-8">
				<Icon
					name="mdi:message-text"
					class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
				/>
				<p class="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
			</div>
		</div>

		<!-- New Comment Input -->
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex gap-2">
				<input
					v-model="newComment"
					type="text"
					placeholder="Add a comment..."
					class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
					@keyup.enter="addComment"
				>
				<button
					class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
					:disabled="!newComment.trim()"
					@click="addComment"
				>
					<Icon name="mdi:send" class="w-5 h-5" />
				</button>
			</div>
			<p class="text-xs text-gray-400 mt-2">
				💡 Tip: Click on canvas to pin comment
			</p>
		</div>
	</div>
</template>
