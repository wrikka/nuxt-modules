<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Comment } from "../../shared/types/comments";
import { useComments } from "../composables/useComments";
import CommentForm from "./comments/CommentForm.vue";
import CommentItem from "./comments/CommentItem.vue";

const props = defineProps<{
	contentPath: string;
	currentUser?: { id: string; name: string };
}>();

const emit = defineEmits<{
	reply: [comment: Comment];
	report: [comment: Comment];
}>();

const { addComment, getComments } = useComments();

const comments = ref<Comment[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const replyTo = ref<Comment | null>(null);
const replyContent = ref("");
const sortBy = ref<"date" | "replies">("date");

const groupedComments = computed(() => {
	const rootComments = comments.value.filter(c => !c.parentId);
	const getReplies = (parentId: string) => comments.value.filter(c => c.parentId === parentId).sort((a, b) => a.createdAt - b.createdAt);
	let sorted = [...rootComments];
	sorted = sortBy.value === "date" ? sorted.sort((a, b) => b.createdAt - a.createdAt) : sorted.sort((a, b) => getReplies(a.id).length - getReplies(b.id).length);
	return sorted.map(comment => ({ comment, replies: getReplies(comment.id) }));
});

const totalComments = computed(() => comments.value.length);

const loadComments = async () => {
	loading.value = true;
	try {
		comments.value = await getComments(props.contentPath);
	} catch (e: any) {
		error.value = e.message || "Failed to load comments";
	} finally {
		loading.value = false;
	}
};

const handleSubmitComment = async (content: string) => {
	if (!props.currentUser) return;
	loading.value = true;
	try {
		await addComment(props.contentPath, props.currentUser.id, props.currentUser.name, content);
		await loadComments();
	} catch (e: any) {
		error.value = e.message || "Failed to add comment";
	} finally {
		loading.value = false;
	}
};

const handleSubmitReply = async () => {
	if (!replyContent.value.trim() || !props.currentUser || !replyTo.value) return;
	loading.value = true;
	try {
		await addComment(props.contentPath, props.currentUser.id, props.currentUser.name, replyContent.value.trim(), replyTo.value.id);
		replyContent.value = "";
		replyTo.value = null;
		await loadComments();
	} catch (e: any) {
		error.value = e.message || "Failed to add reply";
	} finally {
		loading.value = false;
	}
};

const startReply = (comment: Comment) => { replyTo.value = comment; replyContent.value = `@${comment.authorName} `; };
const cancelReply = () => { replyTo.value = null; replyContent.value = ""; };

onMounted(() => loadComments());
</script>

<template>
	<div class="comments-system-ui">
		<div class="comments-header">
			<h3>Comments</h3>
			<div class="header-meta">
				<span class="comment-count">{{ totalComments }} comment{{ totalComments !== 1 ? "s" : "" }}</span>
				<select v-model="sortBy" class="sort-select">
					<option value="date">Newest First</option>
					<option value="replies">Most Replies</option>
				</select>
			</div>
		</div>

		<CommentForm
			v-if="currentUser"
			:avatar="currentUser.name.charAt(0).toUpperCase()"
			placeholder="Write a comment..."
			:rows="3"
			submit-text="Post Comment"
			:disabled="loading"
			@submit="handleSubmitComment"
		/>
		<div v-else class="login-prompt"><p>Please log in to leave a comment</p></div>

		<div v-if="loading" class="loading-state">Loading comments...</div>
		<div v-else-if="error" class="error-state">{{ error }}</div>
		<div v-else-if="groupedComments.length === 0" class="empty-state"><p>No comments yet. Be the first to comment!</p></div>

		<div v-else class="comments-list">
			<div v-for="({ comment, replies }) in groupedComments" :key="comment.id" class="comment-thread">
				<CommentItem
					:comment="comment"
					:replies="replies"
					:can-reply="!!currentUser"
					@reply="startReply"
					@report="emit('report', $event)"
				/>

				<div v-if="replies.length > 0" class="replies-list">
					<CommentItem
						v-for="reply in replies"
						:key="reply.id"
						:comment="reply"
						:replies="[]"
						is-reply
						@report="emit('report', $event)"
					/>
				</div>

				<div v-if="replyTo?.id === comment.id" class="reply-form">
					<CommentForm
						:avatar="currentUser?.name?.charAt(0).toUpperCase() || ''"
						placeholder="Write a reply..."
						:rows="2"
						submit-text="Reply"
						:disabled="loading"
						show-cancel
						@submit="handleSubmitReply"
						@cancel="cancelReply"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.comments-system-ui { display: flex; flex-direction: column; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: #fff; overflow: hidden; }
.comments-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
.comments-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
.header-meta { display: flex; align-items: center; gap: 1rem; }
.comment-count { font-size: 0.875rem; color: #6b7280; }
.sort-select { padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; font-size: 0.875rem; cursor: pointer; }
.login-prompt { padding: 1.5rem; text-align: center; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.login-prompt p { margin: 0; color: #6b7280; }
.loading-state, .error-state, .empty-state { padding: 2rem; text-align: center; color: #6b7280; }
.error-state { color: #dc2626; }
.comments-list { padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
.comment-thread { display: flex; flex-direction: column; gap: 0.5rem; }
.replies-list { display: flex; flex-direction: column; gap: 0.75rem; margin-left: 3rem; padding-left: 1rem; border-left: 2px solid #e5e7eb; }
.reply-form { display: flex; gap: 0.75rem; margin-left: 3rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.375rem; }
</style>
