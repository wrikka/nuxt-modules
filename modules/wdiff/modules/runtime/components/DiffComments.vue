<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimeAgo } from '@vueuse/core'

interface Comment {
  id: string
  lineNumber: number | null
  side: 'old' | 'new' | null
  author: string
  avatar?: string
  content: string
  createdAt: number
  updatedAt?: number
  replies?: Comment[]
  reactions?: Record<string, string[]>
  resolved?: boolean
  tags?: string[]
}

interface Props {
  comments: Comment[]
  currentUser: string
  allowReactions?: boolean
  allowReplies?: boolean
  allowResolve?: boolean
  lineNumbers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowReactions: true,
  allowReplies: true,
  allowResolve: true,
  lineNumbers: true,
})

const emit = defineEmits<{
  (e: 'add', comment: Omit<Comment, 'id' | 'createdAt'>): void
  (e: 'edit', commentId: string, content: string): void
  (e: 'delete', commentId: string): void
  (e: 'reply', parentId: string, comment: Omit<Comment, 'id' | 'createdAt'>): void
  (e: 'react', commentId: string, reaction: string): void
  (e: 'resolve', commentId: string, resolved: boolean): void
  (e: 'tag', commentId: string, tags: string[]): void
}>()

const newCommentLine = ref<number | null>(null)
const newCommentSide = ref<'old' | 'new' | null>(null)
const newCommentContent = ref('')
const editingComment = ref<string | null>(null)
const editContent = ref('')
const replyingTo = ref<string | null>(null)
const replyContent = ref('')
const showResolved = ref(true)

const availableReactions = ['👍', '👎', '😄', '🎉', '😕', '❤️', '🚀', '👀']

const filteredComments = computed(() => {
  let filtered = props.comments
  if (!showResolved.value) {
    filtered = filtered.filter((c) => !c.resolved)
  }
  return filtered.sort((a, b) => (a.lineNumber ?? 0) - (b.lineNumber ?? 0))
})

const groupedComments = computed(() => {
  const groups = new Map<number | string, Comment[]>()
  
  for (const comment of filteredComments.value) {
    const key = comment.lineNumber ?? 'general'
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(comment)
  }
  
  return Array.from(groups.entries()).sort((a, b) => {
    if (a[0] === 'general') return 1
    if (b[0] === 'general') return -1
    return (a[0] as number) - (b[0] as number)
  })
})

const stats = computed(() => {
  const total = props.comments.length
  const resolved = props.comments.filter((c) => c.resolved).length
  const unresolved = total - resolved
  return { total, resolved, unresolved }
})

const startNewComment = (lineNumber?: number, side?: 'old' | 'new') => {
  newCommentLine.value = lineNumber ?? null
  newCommentSide.value = side ?? null
  newCommentContent.value = ''
}

const submitComment = () => {
  if (!newCommentContent.value.trim()) return
  
  const comment: Omit<Comment, 'id' | 'createdAt'> = {
    lineNumber: newCommentLine.value,
    side: newCommentSide.value,
    author: props.currentUser,
    content: newCommentContent.value,
  }
  
  emit('add', comment)
  newCommentContent.value = ''
  newCommentLine.value = null
  newCommentSide.value = null
}

const startEdit = (comment: Comment) => {
  editingComment.value = comment.id
  editContent.value = comment.content
}

const saveEdit = (commentId: string) => {
  if (!editContent.value.trim()) return
  emit('edit', commentId, editContent.value)
  editingComment.value = null
  editContent.value = ''
}

const startReply = (commentId: string) => {
  replyingTo.value = commentId
  replyContent.value = ''
}

const submitReply = (parentId: string) => {
  if (!replyContent.value.trim()) return
  
  const reply: Omit<Comment, 'id' | 'createdAt'> = {
    lineNumber: null,
    side: null,
    author: props.currentUser,
    content: replyContent.value,
  }
  
  emit('reply', parentId, reply)
  replyingTo.value = null
  replyContent.value = ''
}

const toggleReaction = (commentId: string, reaction: string) => {
  emit('react', commentId, reaction)
}

const toggleResolve = (commentId: string) => {
  const comment = props.comments.find((c) => c.id === commentId)
  emit('resolve', commentId, !comment?.resolved)
}

const deleteComment = (commentId: string) => {
  if (confirm('Delete this comment?')) {
    emit('delete', commentId)
  }
}

const formatTime = (timestamp: number) => {
  return useTimeAgo(timestamp).value
}
</script>

<template>
  <div class="diff-comments-panel">
    <!-- Header -->
    <div class="comments-header">
      <div class="header-title">
        <span class="title-icon">💬</span>
        Comments
        <span class="comments-count">{{ stats.total }}</span>
      </div>
      <div class="header-actions">
        <button
          class="toggle-resolved"
          :class="{ active: showResolved }"
          @click="showResolved = !showResolved"
        >
          {{ showResolved ? 'Hide' : 'Show' }} resolved ({{ stats.resolved }})
        </button>
        <button class="btn-new" @click="startNewComment()">
          + New comment
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="comments-stats">
      <div class="stat-item" :class="{ active: stats.unresolved > 0 }">
        <span class="stat-value">{{ stats.unresolved }}</span>
        <span class="stat-label">unresolved</span>
      </div>
      <div class="stat-item resolved">
        <span class="stat-value">{{ stats.resolved }}</span>
        <span class="stat-label">resolved</span>
      </div>
    </div>

    <!-- New comment form -->
    <div v-if="newCommentLine !== null || newCommentLine === null" class="new-comment-form">
      <div v-if="newCommentLine !== null" class="comment-context">
        Commenting on
        <span v-if="lineNumbers" class="context-line">line {{ newCommentLine }}</span>
        <span v-if="newCommentSide" class="context-side">({{ newCommentSide }})</span>
        <button class="btn-clear" @click="newCommentLine = null; newCommentSide = null">
          ×
        </button>
      </div>
      <textarea
        v-model="newCommentContent"
        class="comment-textarea"
        placeholder="Add a comment..."
        rows="3"
      />
      <div class="form-actions">
        <button class="btn-submit" :disabled="!newCommentContent.trim()" @click="submitComment">
          Add Comment
        </button>
        <button class="btn-cancel" @click="newCommentLine = null; newCommentContent = ''">
          Cancel
        </button>
      </div>
    </div>

    <!-- Comments list -->
    <div class="comments-list">
      <div
        v-for="[groupKey, groupComments] in groupedComments"
        :key="String(groupKey)"
        class="comment-group"
      >
        <div v-if="groupKey !== 'general'" class="group-header">
          <span class="group-line">Line {{ groupKey }}</span>
        </div>

        <div
          v-for="comment in groupComments"
          :key="comment.id"
          :class="['comment-card', { resolved: comment.resolved }]"
        >
          <!-- Comment header -->
          <div class="comment-header">
            <div class="comment-author">
              <img
                v-if="comment.avatar"
                :src="comment.avatar"
                :alt="comment.author"
                class="author-avatar"
              />
              <div v-else class="author-avatar placeholder">
                {{ comment.author.charAt(0).toUpperCase() }}
              </div>
              <div class="author-info">
                <span class="author-name">{{ comment.author }}</span>
                <span class="comment-time" :title="new Date(comment.createdAt).toLocaleString()">
                  {{ formatTime(comment.createdAt) }}
                </span>
              </div>
            </div>
            <div class="comment-actions">
              <button
                v-if="allowResolve"
                :class="['btn-resolve', { resolved: comment.resolved }]"
                @click="toggleResolve(comment.id)"
              >
                {{ comment.resolved ? '✓ Resolved' : 'Resolve' }}
              </button>
              <button
                v-if="comment.author === currentUser"
                class="btn-edit"
                @click="startEdit(comment)"
              >
                Edit
              </button>
              <button
                v-if="comment.author === currentUser"
                class="btn-delete"
                @click="deleteComment(comment.id)"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Comment content -->
          <div v-if="editingComment === comment.id" class="comment-edit">
            <textarea v-model="editContent" class="edit-textarea" rows="3" />
            <div class="edit-actions">
              <button class="btn-save" @click="saveEdit(comment.id)">Save</button>
              <button class="btn-cancel" @click="editingComment = null">Cancel</button>
            </div>
          </div>

          <div v-else class="comment-content">
            {{ comment.content }}
          </div>

          <!-- Tags -->
          <div v-if="comment.tags?.length" class="comment-tags">
            <span v-for="tag in comment.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>

          <!-- Reactions -->
          <div v-if="allowReactions" class="comment-reactions">
            <div v-if="comment.reactions && Object.keys(comment.reactions).length > 0" class="reaction-list">
              <button
                v-for="(users, reaction) in comment.reactions"
                :key="reaction"
                :class="['reaction-btn', { active: users.includes(currentUser) }]"
                :title="`${users.join(', ')} reacted with ${reaction}`"
                @click="toggleReaction(comment.id, reaction)"
              >
                {{ reaction }} {{ users.length }}
              </button>
            </div>
            <div class="reaction-picker">
              <button
                v-for="reaction in availableReactions"
                :key="reaction"
                class="reaction-option"
                @click="toggleReaction(comment.id, reaction)"
              >
                {{ reaction }}
              </button>
            </div>
          </div>

          <!-- Replies -->
          <div v-if="comment.replies?.length" class="comment-replies">
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="reply-card"
            >
              <div class="reply-header">
                <span class="reply-author">{{ reply.author }}</span>
                <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
            </div>
          </div>

          <!-- Reply form -->
          <div v-if="allowReplies" class="reply-section">
            <button
              v-if="replyingTo !== comment.id"
              class="btn-reply"
              @click="startReply(comment.id)"
            >
              Reply
            </button>
            <div v-else class="reply-form">
              <textarea
                v-model="replyContent"
                class="reply-textarea"
                placeholder="Write a reply..."
                rows="2"
              />
              <div class="reply-actions">
                <button class="btn-submit-reply" @click="submitReply(comment.id)">
                  Reply
                </button>
                <button class="btn-cancel" @click="replyingTo = null">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredComments.length === 0" class="empty-state">
        <span class="empty-icon">💬</span>
        <p>No comments yet</p>
        <span class="empty-hint">Be the first to add a comment</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff-comments-panel {
  @apply flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden;
}

.comments-header {
  @apply flex items-center justify-between px-4 py-3;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.header-title {
  @apply flex items-center gap-2 font-semibold text-gray-900 dark:text-white;
}

.title-icon {
  @apply text-lg;
}

.comments-count {
  @apply px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
  @apply text-sm rounded-full;
}

.header-actions {
  @apply flex gap-2;
}

.toggle-resolved {
  @apply px-3 py-1.5 text-sm rounded;
  @apply text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800;
  @apply transition-colors;
}

.toggle-resolved.active {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
}

.btn-new {
  @apply px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium;
  @apply hover:bg-blue-700 transition-colors;
}

.comments-stats {
  @apply flex gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.stat-item {
  @apply flex items-center gap-1 text-sm;
}

.stat-value {
  @apply font-semibold text-gray-900 dark:text-white;
}

.stat-item.active .stat-value {
  @apply text-red-600 dark:text-red-400;
}

.stat-label {
  @apply text-gray-500 dark:text-gray-400;
}

.new-comment-form {
  @apply p-4 border-b border-gray-200 dark:border-gray-700;
}

.comment-context {
  @apply flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400;
}

.context-line,
.context-side {
  @apply font-medium text-blue-600 dark:text-blue-400;
}

.btn-clear {
  @apply w-5 h-5 flex items-center justify-center rounded-full;
  @apply text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.comment-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-white;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply resize-y min-h-20;
}

.form-actions {
  @apply flex gap-2 mt-3;
}

.btn-submit {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium;
  @apply hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

.btn-cancel {
  @apply px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.comments-list {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

.comment-group {
  @apply space-y-3;
}

.group-header {
  @apply sticky top-0 bg-white dark:bg-gray-900 py-2;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.group-line {
  @apply text-sm font-medium text-blue-600 dark:text-blue-400;
}

.comment-card {
  @apply p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg;
  @apply border border-gray-200 dark:border-gray-700;
}

.comment-card.resolved {
  @apply opacity-60 border-green-300 dark:border-green-700;
}

.comment-header {
  @apply flex items-start justify-between gap-3 mb-3;
}

.comment-author {
  @apply flex items-center gap-2;
}

.author-avatar {
  @apply w-8 h-8 rounded-full object-cover;
}

.author-avatar.placeholder {
  @apply bg-blue-600 text-white flex items-center justify-center font-semibold text-sm;
}

.author-info {
  @apply flex flex-col;
}

.author-name {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.comment-time {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.comment-actions {
  @apply flex items-center gap-1;
}

.btn-resolve,
.btn-edit,
.btn-delete {
  @apply px-2 py-1 text-xs rounded;
  @apply transition-colors;
}

.btn-resolve {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700;
}

.btn-resolve.resolved {
  @apply bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300;
}

.btn-edit {
  @apply text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20;
}

.btn-delete {
  @apply text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20;
}

.comment-edit {
  @apply space-y-2;
}

.edit-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.edit-actions {
  @apply flex gap-2;
}

.btn-save {
  @apply px-3 py-1 bg-green-600 text-white rounded text-sm;
  @apply hover:bg-green-700 transition-colors;
}

.comment-content {
  @apply text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap;
}

.comment-tags {
  @apply flex flex-wrap gap-1 mt-2;
}

.tag {
  @apply px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300;
  @apply text-xs rounded-full;
}

.comment-reactions {
  @apply flex items-center gap-2 mt-3;
}

.reaction-list {
  @apply flex gap-1;
}

.reaction-btn {
  @apply px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors;
}

.reaction-btn.active {
  @apply bg-blue-100 dark:bg-blue-900/30;
}

.reaction-picker {
  @apply flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity;
}

.reaction-option {
  @apply w-7 h-7 flex items-center justify-center rounded-full;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors;
}

.comment-replies {
  @apply mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2;
}

.reply-card {
  @apply p-2 bg-white dark:bg-gray-900 rounded;
}

.reply-header {
  @apply flex items-center gap-2 mb-1;
}

.reply-author {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.reply-time {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.reply-content {
  @apply text-sm text-gray-700 dark:text-gray-300;
}

.reply-section {
  @apply mt-3;
}

.btn-reply {
  @apply text-sm text-blue-600 dark:text-blue-400 hover:underline;
}

.reply-form {
  @apply space-y-2;
}

.reply-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.reply-actions {
  @apply flex gap-2;
}

.btn-submit-reply {
  @apply px-3 py-1.5 bg-blue-600 text-white rounded text-sm;
  @apply hover:bg-blue-700 transition-colors;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-icon {
  @apply text-4xl mb-4 opacity-50;
}

.empty-state p {
  @apply text-gray-600 dark:text-gray-400 mb-2;
}

.empty-hint {
  @apply text-sm text-gray-500 dark:text-gray-500;
}
</style>
