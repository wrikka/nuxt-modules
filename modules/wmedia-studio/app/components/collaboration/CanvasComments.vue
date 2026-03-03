<script setup lang="ts">
import type { Comment } from "#shared/types";
import { useCollaborationStore } from "~/stores/collaboration";

const collaborationStore = useCollaborationStore();
const { comments } = storeToRefs(collaborationStore);

const props = defineProps<{
	canvasRef?: HTMLElement | null;
}>();

const showComments = ref(true);
const activeCommentId = ref<string | null>(null);
const newCommentText = ref("");
const replyText = ref("");
const isAddingComment = ref(false);
const newCommentPosition = ref({ x: 0, y: 0 });

const unresolvedComments = computed(() => {
	return comments.value.filter((c) => !c.resolved);
});

const resolvedComments = computed(() => {
	return comments.value.filter((c) => c.resolved);
});

const getInitials = (name: string) => {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

const startAddComment = (event: MouseEvent) => {
	if (!props.canvasRef) return;
	const rect = props.canvasRef.getBoundingClientRect();
	newCommentPosition.value = {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	};
	isAddingComment.value = true;
};

const submitComment = () => {
	if (!newCommentText.value.trim()) return;

	collaborationStore.addComment({
		projectId: "", // Will be filled by server
		userId: "", // Will be filled by server
		userName: "", // Will be filled by server
		content: newCommentText.value,
		x: newCommentPosition.value.x,
		y: newCommentPosition.value.y,
		resolved: false,
	});

	newCommentText.value = "";
	isAddingComment.value = false;
};

const submitReply = (commentId: string) => {
	if (!replyText.value.trim()) return;

	collaborationStore.addReply(commentId, {
		userId: "", // Will be filled by server
		userName: "", // Will be filled by server
		content: replyText.value,
	});

	replyText.value = "";
	activeCommentId.value = null;
};

const toggleCommentPanel = (commentId: string) => {
	activeCommentId.value = activeCommentId.value === commentId
		? null
		: commentId;
};

const formatTime = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(new Date(date));
};
</script>

<template>
	<div class="relative">
		<!-- Comment Toggle Button -->
		<button
			class="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'bg-blue-700': showComments }"
			@click="showComments = !showComments"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
			</svg>
			<span
				v-if="unresolvedComments.length > 0"
				class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold"
			>
				{{ unresolvedComments.length }}
			</span>
		</button>

		<!-- Comments Panel -->
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div
				v-if="showComments"
				class="fixed bottom-20 right-4 z-50 w-80 max-h-[60vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<!-- Header -->
				<div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Comments ({{ unresolvedComments.length }})
					</h3>
					<button
						class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						@click="showComments = false"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				</div>

				<!-- Comments List -->
				<div class="max-h-[40vh] overflow-y-auto p-4 space-y-4">
					<div
						v-for="comment in unresolvedComments"
						:key="comment.id"
						class="group relative rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500"
						:class="{
							'border-blue-500 ring-1 ring-blue-500':
								activeCommentId === comment.id,
						}"
					>
						<!-- Comment Header -->
						<div class="mb-2 flex items-start justify-between">
							<div class="flex items-center gap-2">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
									{{ getInitials(comment.userName) }}
								</div>
								<div>
									<p class="text-sm font-medium text-gray-900 dark:text-white">
										{{ comment.userName }}
									</p>
									<p class="text-xs text-gray-500">
										{{ formatTime(comment.createdAt) }}
									</p>
								</div>
							</div>
							<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									class="p-1 text-gray-400 hover:text-green-500"
									@click="collaborationStore.resolveComment(comment.id)"
									title="Resolve"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M20 6 9 17l-5-5" />
									</svg>
								</button>
								<button
									class="p-1 text-gray-400 hover:text-red-500"
									@click="collaborationStore.deleteComment(comment.id)"
									title="Delete"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									</svg>
								</button>
							</div>
						</div>

						<!-- Comment Content -->
						<p class="mb-3 text-sm text-gray-700 dark:text-gray-300">
							{{ comment.content }}
						</p>

						<!-- Replies -->
						<div
							v-if="comment.replies.length > 0"
							class="mb-3 space-y-2 border-l-2 border-gray-200 pl-3 dark:border-gray-700"
						>
							<div
								v-for="reply in comment.replies"
								:key="reply.id"
								class="text-sm"
							>
								<span class="font-medium text-gray-900 dark:text-white">{{
									reply.userName
								}}</span>
								<span class="text-gray-600 dark:text-gray-400">: {{
										reply.content
									}}</span>
							</div>
						</div>

						<!-- Reply Input -->
						<div v-if="activeCommentId === comment.id" class="flex gap-2">
							<input
								v-model="replyText"
								type="text"
								placeholder="Write a reply..."
								class="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
								@keyup.enter="submitReply(comment.id)"
							/>
							<button
								class="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
								@click="submitReply(comment.id)"
							>
								Reply
							</button>
						</div>

						<!-- Reply Button -->
						<button
							v-else
							class="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
							@click="toggleCommentPanel(comment.id)"
						>
							Reply ({{ comment.replies.length }})
						</button>
					</div>

					<!-- Empty State -->
					<div
						v-if="unresolvedComments.length === 0"
						class="py-8 text-center text-gray-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mx-auto mb-3 opacity-50"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
						<p>No comments yet</p>
						<p class="text-xs mt-1">Click on canvas to add a comment</p>
					</div>
				</div>
			</div>
		</Transition>

		<!-- New Comment Popup -->
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="scale-95 opacity-0"
			enter-to-class="scale-100 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="scale-100 opacity-100"
			leave-to-class="scale-95 opacity-0"
		>
			<div
				v-if="isAddingComment"
				class="fixed z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
				:style="{
					left: `${newCommentPosition.x}px`,
					top: `${newCommentPosition.y}px`,
				}"
			>
				<div class="mb-3 flex items-center justify-between">
					<span class="font-medium text-gray-900 dark:text-white"
					>Add Comment</span>
					<button
						class="text-gray-400 hover:text-gray-600"
						@click="isAddingComment = false"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
					</button>
				</div>
				<textarea
					v-model="newCommentText"
					placeholder="Write your comment..."
					class="mb-3 w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					rows="3"
				/>
				<div class="flex justify-end gap-2">
					<button
						class="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
						@click="isAddingComment = false"
					>
						Cancel
					</button>
					<button
						class="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
						:disabled="!newCommentText.trim()"
						@click="submitComment"
					>
						Comment
					</button>
				</div>
			</div>
		</Transition>

		<!-- Comment Pins on Canvas -->
		<div
			v-for="comment in unresolvedComments"
			:key="`pin-${comment.id}`"
			class="absolute z-40 cursor-pointer"
			:style="{ left: `${comment.x}px`, top: `${comment.y}px` }"
			@click="activeCommentId = comment.id;
			showComments = true;"
		>
			<div
				class="flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white font-bold text-white shadow-lg transition-transform hover:scale-110"
				:class="activeCommentId === comment.id
				? 'bg-blue-600 ring-2 ring-blue-300'
				: 'bg-yellow-500'"
			>
				{{ comment.replies.length + 1 }}
			</div>
		</div>
	</div>
</template>
