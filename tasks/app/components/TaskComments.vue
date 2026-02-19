<script setup lang="ts">
import type { Task, TaskComment } from '~/shared/types/task';

const { $toast } = useNuxtApp();
const props = defineProps<{ task: Task }>();

const newComment = ref('');
const localComments = ref<TaskComment[]>([...props.task.comments]);

async function handleAddComment() {
  if (!newComment.value.trim()) return;

  const { data, error } = await useFetch(`/api/tasks/${props.task.id}/comments`, {
    method: 'POST',
    body: { text: newComment.value },
  });

  if (error.value) {
    console.error('Failed to add comment:', error.value);
    $toast.error('Failed to add comment');
    return;
  }

  if (data.value) {
    localComments.value.push(data.value as TaskComment);
    newComment.value = '';
    $toast.success('Comment added');
  }
}

const timeAgo = (date: string) => useTimeAgo(new Date(date));
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-lg font-semibold text-gray-300">Comments ({{ localComments.length }})</h2>

    <!-- Add Comment Form -->
    <div class="flex items-start gap-4">
      <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="Your avatar" class="w-8 h-8 rounded-full" />
      <form ~/submit.prevent="handleAddComment" class="flex-1">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          class="w-full rounded border border-gray-600 bg-[#101012] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          rows="3"
        ></textarea>
        <button
          type="submit"
          class="mt-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newComment.trim()"
        >
          Comment
        </button>
      </form>
    </div>

    <!-- Comments List -->
    <div class="space-y-4">
      <div v-for="comment in localComments" :key="comment.id" class="flex items-start gap-4">
        <img :src="comment.user.avatarUrl" :alt="comment.user.name" class="w-8 h-8 rounded-full" />
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-white">{{ comment.user.name }}</span>
            <span class="text-xs text-gray-500">{{ timeAgo(comment.createdAt).value }}</span>
          </div>
          <p class="text-gray-300">{{ comment.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
