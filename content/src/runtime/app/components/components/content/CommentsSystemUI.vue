<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Comment } from "../../../../shared/types/comments";
import { useComments } from "../../../composables/useComments";

const props = defineProps<{
	contentPath: string;
	currentUser?: {
		id: string;
		name: string;
	};
}>();

const emit = defineEmits<{
	reply: [comment: Comment];
	report: [comment: Comment];
}>();

const { addComment, getComments } = useComments();

const comments = ref<Comment[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const newCommentContent = ref("");
const replyTo = ref<Comment | null>(null);
const replyContent = ref("");
const sortBy = ref<"date" | "replies">("date");

const groupedComments = computed(() => {
	const rootComments = comments.value.filter((c) => !c.parentId);
	const getReplies = (parentId: string): Comment[] => {
		return comments.value.filter((c) => c.parentId === parentId).sort((a, b) =>
			a.createdAt - b.createdAt
		);
	};

	let sorted = [...rootComments];
	if (sortBy.value === "date") {
		sorted.sort((a, b) => b.createdAt - a.createdAt);
	} else {
		sorted.sort((a, b) => getReplies(a.id).length - getReplies(b.id).length);
	}

	return sorted.map((comment) => ({
		comment,
		replies: getReplies(comment.id),
	}));
});

const totalComments = computed(() => comments.value.length);

const formatDate = (isoString: string) => {
	const date = new Date(isoString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString("th-TH", { month: "short", day: "numeric" });
};

const loadComments = async () => {
	loading.value = true;
	error.value = null;
	try {
		comments.value = await getComments(props.contentPath);
	} catch (e: any) {
		error.value = e.message || "Failed to load comments";
	} finally {
		loading.value = false;
	}
};

const handleSubmitComment = async () => {
	if (!newCommentContent.value.trim() || !props.currentUser) return;

	loading.value = true;
	try {
		await addComment(
			props.contentPath,
			props.currentUser.id,
			props.currentUser.name,
			newCommentContent.value.trim(),
		);
		newCommentContent.value = "";
		await loadComments();
	} catch (e: any) {
		error.value = e.message || "Failed to add comment";
	} finally {
		loading.value = false;
	}
};

const handleSubmitReply = async () => {
	if (!replyContent.value.trim() || !props.currentUser || !replyTo.value) {
		return;
	}

	loading.value = true;
	try {
		await addComment(
			props.contentPath,
			props.currentUser.id,
			props.currentUser.name,
			replyContent.value.trim(),
			replyTo.value.id,
		);
		replyContent.value = "";
		replyTo.value = null;
		await loadComments();
	} catch (e: any) {
		error.value = e.message || "Failed to add reply";
	} finally {
		loading.value = false;
	}
};

const startReply = (comment: Comment) => {
	replyTo.value = comment;
	replyContent.value = `@${comment.authorName} `;
};

const cancelReply = () => {
	replyTo.value = null;
	replyContent.value = "";
};

const handleReport = (comment: Comment) => {
	emit("report", comment);
};

onMounted(() => {
	loadComments();
});
</script>

<template>
	<div class="comments-system-ui">
		<div class="comments-header">
			<h3>Comments</h3>
			<div class="header-meta">
				<span class="comment-count">{{ totalComments }} comment{{
						totalComments !== 1 ? "s" : ""
					}}</span>
				<select
					v-model="sortBy"
					class="sort-select"
				>
					<option value="date">Newest First</option>
					<option value="replies">Most Replies</option>
				</select>
			</div>
		</div>

		<div
			v-if="currentUser"
			class="comment-form"
		>
			<div class="form-avatar">
				{{ currentUser.name.charAt(0).toUpperCase() }}
			</div>
			<div class="form-input-wrapper">
				<textarea
					v-model="newCommentContent"
					class="form-textarea"
					placeholder="Write a comment..."
					rows="3"
					@keydown.ctrl.enter="handleSubmitComment"
				/>
				<div class="form-actions">
					<span class="form-hint">Ctrl+Enter to submit</span>
					<button
						class="btn btn-primary"
						:disabled="!newCommentContent.trim() || loading"
						@click="handleSubmitComment"
					>
						Post Comment
					</button>
				</div>
			</div>
		</div>

		<div
			v-else
			class="login-prompt"
		>
			<p>Please log in to leave a comment</p>
		</div>

		<div
			v-if="loading"
			class="loading-state"
		>
			Loading comments...
		</div>

		<div
			v-else-if="error"
			class="error-state"
		>
			{{ error }}
		</div>

		<div
			v-else-if="groupedComments.length === 0"
			class="empty-state"
		>
			<p>No comments yet. Be the first to comment!</p>
		</div>

		<div
			v-else
			class="comments-list"
		>
			<div
				v-for="({ comment, replies }) in groupedComments"
				:key="comment.id"
				class="comment-thread"
			>
				<div class="comment-item">
					<div class="comment-avatar">
						{{ comment.authorName.charAt(0).toUpperCase() }}
					</div>
					<div class="comment-body">
						<div class="comment-header">
							<span class="comment-author">{{ comment.authorName }}</span>
							<span class="comment-time">{{
								formatDate(comment.createdAtISO)
							}}</span>
						</div>
						<p class="comment-content">{{ comment.content }}</p>
						<div class="comment-actions">
							<button
								v-if="currentUser"
								class="action-btn"
								@click="startReply(comment)"
							>
								Reply
							</button>
							<button
								class="action-btn"
								@click="handleReport(comment)"
							>
								Report
							</button>
						</div>
					</div>
				</div>

				<div
					v-if="replies.length > 0"
					class="replies-list"
				>
					<div
						v-for="reply in replies"
						:key="reply.id"
						class="comment-item reply"
					>
						<div class="comment-avatar small">
							{{ reply.authorName.charAt(0).toUpperCase() }}
						</div>
						<div class="comment-body">
							<div class="comment-header">
								<span class="comment-author">{{ reply.authorName }}</span>
								<span class="comment-time">{{
									formatDate(reply.createdAtISO)
								}}</span>
							</div>
							<p class="comment-content">{{ reply.content }}</p>
						</div>
					</div>
				</div>

				<div
					v-if="replyTo?.id === comment.id"
					class="reply-form"
				>
					<div class="form-avatar small">
						{{ currentUser?.name?.charAt(0).toUpperCase() }}
					</div>
					<div class="form-input-wrapper">
						<textarea
							v-model="replyContent"
							class="form-textarea"
							placeholder="Write a reply..."
							rows="2"
							@keydown.ctrl.enter="handleSubmitReply"
						/>
						<div class="form-actions">
							<button
								class="btn btn-secondary"
								@click="cancelReply"
							>
								Cancel
							</button>
							<button
								class="btn btn-primary"
								:disabled="!replyContent.trim() || loading"
								@click="handleSubmitReply"
							>
								Reply
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.comments-system-ui {
	display: flex;
	flex-direction: column;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	background: #fff;
	overflow: hidden;
}

.comments-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}

.comments-header h3 {
	margin: 0;
	font-size: 1.125rem;
	font-weight: 600;
}

.header-meta {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.comment-count {
	font-size: 0.875rem;
	color: #6b7280;
}

.sort-select {
	padding: 0.375rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	background: #fff;
	font-size: 0.875rem;
	cursor: pointer;
}

.comment-form {
	display: flex;
	gap: 0.75rem;
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
}

.form-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: #3b82f6;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	flex-shrink: 0;
}

.form-avatar.small {
	width: 32px;
	height: 32px;
	font-size: 0.875rem;
}

.form-input-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-textarea {
	padding: 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	resize: vertical;
	min-height: 80px;
}

.form-textarea:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.form-hint {
	font-size: 0.75rem;
	color: #9ca3af;
}

.login-prompt {
	padding: 1.5rem;
	text-align: center;
	background: #f9fafb;
	border-bottom: 1px solid #e5e7eb;
}

.login-prompt p {
	margin: 0;
	color: #6b7280;
}

.loading-state,
.error-state,
.empty-state {
	padding: 2rem;
	text-align: center;
	color: #6b7280;
}

.error-state {
	color: #dc2626;
}

.comments-list {
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.comment-thread {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.comment-item {
	display: flex;
	gap: 0.75rem;
}

.comment-item.reply {
	margin-left: 3rem;
}

.comment-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: #e5e7eb;
	color: #374151;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	flex-shrink: 0;
}

.comment-avatar.small {
	width: 32px;
	height: 32px;
	font-size: 0.875rem;
}

.comment-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.comment-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.comment-author {
	font-weight: 500;
	color: #111827;
}

.comment-time {
	font-size: 0.75rem;
	color: #9ca3af;
}

.comment-content {
	margin: 0;
	font-size: 0.875rem;
	color: #374151;
	line-height: 1.5;
}

.comment-actions {
	display: flex;
	gap: 0.5rem;
	margin-top: 0.25rem;
}

.action-btn {
	padding: 0.25rem 0.5rem;
	border: none;
	background: transparent;
	color: #6b7280;
	font-size: 0.75rem;
	cursor: pointer;
	transition: color 0.2s;
}

.action-btn:hover {
	color: #3b82f6;
}

.replies-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-left: 3rem;
	padding-left: 1rem;
	border-left: 2px solid #e5e7eb;
}

.reply-form {
	display: flex;
	gap: 0.75rem;
	margin-left: 3rem;
	padding: 0.75rem;
	background: #f9fafb;
	border-radius: 0.375rem;
}

.btn {
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-primary {
	background: #3b82f6;
	border: 1px solid #3b82f6;
	color: #fff;
}

.btn-primary:hover:not(:disabled) {
	background: #2563eb;
}

.btn-secondary {
	background: #fff;
	border: 1px solid #d1d5db;
	color: #374151;
}

.btn-secondary:hover:not(:disabled) {
	background: #f3f4f6;
}
</style>
