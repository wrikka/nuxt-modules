<script setup lang="ts">
import type { Comment } from "../../../../../shared/types/comments";

const props = defineProps<{
	comment: Comment
	replies: Comment[]
	isReply?: boolean
	canReply?: boolean
	showReplyForm?: boolean
}>()

const emit = defineEmits<{
	reply: [comment: Comment]
	report: [comment: Comment]
}>()

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
</script>

<template>
	<div class="comment-item" :class="{ reply: isReply }">
		<div class="comment-avatar" :class="{ small: isReply }">{{ comment.authorName.charAt(0).toUpperCase() }}</div>
		<div class="comment-body">
			<div class="comment-header">
				<span class="comment-author">{{ comment.authorName }}</span>
				<span class="comment-time">{{ formatDate(comment.createdAtISO) }}</span>
			</div>
			<p class="comment-content">{{ comment.content }}</p>
			<div v-if="!isReply" class="comment-actions">
				<button v-if="canReply" class="action-btn" @click="emit('reply', comment)">Reply</button>
				<button class="action-btn" @click="emit('report', comment)">Report</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.comment-item { display: flex; gap: 0.75rem; }
.comment-item.reply { margin-left: 3rem; }
.comment-avatar { width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb; color: #374151; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; }
.comment-avatar.small { width: 32px; height: 32px; font-size: 0.875rem; }
.comment-body { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
.comment-header { display: flex; align-items: center; gap: 0.5rem; }
.comment-author { font-weight: 500; color: #111827; }
.comment-time { font-size: 0.75rem; color: #9ca3af; }
.comment-content { margin: 0; font-size: 0.875rem; color: #374151; line-height: 1.5; }
.comment-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
.action-btn { padding: 0.25rem 0.5rem; border: none; background: transparent; color: #6b7280; font-size: 0.75rem; cursor: pointer; transition: color 0.2s; }
.action-btn:hover { color: #3b82f6; }
</style>
