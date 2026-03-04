<script setup lang="ts">
import { ref } from 'vue'

interface Comment {
  id: string
  author: { name: string; avatar?: string }
  content: string
  time: Date
  likes?: number
  replies?: Reply[]
}

interface Reply {
  id: string
  author: { name: string; avatar?: string }
  content: string
  time: Date
  replyingTo: string
}

interface Props {
  comments: Comment[]
  currentUser?: { name: string; avatar?: string }
  allowReplies?: boolean
  allowLikes?: boolean
  sortBy?: 'newest' | 'oldest' | 'popular'
}

const props = withDefaults(defineProps<Props>(), {
  allowReplies: true,
  allowLikes: true,
  sortBy: 'newest'
})

const emit = defineEmits<{
  'addComment': [content: string]
  'addReply': [commentId: string, content: string]
  'likeComment': [commentId: string]
}>()

const replyTo = ref<string | null>(null)
const replyContent = ref('')
const newComment = ref('')

const sortedComments = computed(() => {
  return [...props.comments].sort((a, b) => {
    switch (props.sortBy) {
      case 'oldest': return new Date(a.time).getTime() - new Date(b.time).getTime()
      case 'popular': return (b.likes || 0) - (a.likes || 0)
      default: return new Date(b.time).getTime() - new Date(a.time).getTime()
    }
  })
})

const submitReply = (commentId: string) => {
  if (!replyContent.value.trim()) return
  emit('addReply', commentId, replyContent.value)
  replyContent.value = ''
  replyTo.value = null
}

const submitComment = () => {
  if (!newComment.value.trim()) return
  emit('addComment', newComment.value)
  newComment.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="currentUser" class="flex gap-3">
      <Avatar
        :src="currentUser.avatar"
        :alt="currentUser.name"
        :fallback="currentUser.name.charAt(0)"
      />
      <div class="flex-1">
        <Textarea
          v-model="newComment"
          placeholder="Write a comment..."
          rows="3"
          class="mb-2"
        />
        <div class="flex justify-end">
          <Button size="sm" :disabled="!newComment.trim()" @click="submitComment">
            Post Comment
          </Button>
        </div>
      </div>
    </div>
    
    <div class="space-y-6">
      <div
        v-for="comment in sortedComments"
        :key="comment.id"
        class="space-y-4"
      >
        <Comment
          :avatar="{ src: comment.author.avatar, name: comment.author.name }"
          :author="comment.author.name"
          :time="comment.time"
          :content="comment.content"
          :actions="allowLikes ? [
            { label: `${comment.likes || 0} likes`, icon: 'heart' },
            allowReplies ? { label: 'Reply', icon: 'message-circle' } : null
          ].filter(Boolean) as any[] : []"
        />
        
        <div v-if="allowReplies" class="ml-12 space-y-3">
          <div
            v-for="reply in comment.replies"
            :key="reply.id"
          >
            <Reply
              :to="{ src: reply.author.avatar, name: reply.author.name }"
              :author="reply.author.name"
              :time="reply.time"
              :content="reply.content"
              :parent-author="comment.author.name"
            />
          </div>
          
          <div v-if="replyTo === comment.id" class="flex gap-3">
            <Avatar
              v-if="currentUser"
              :src="currentUser.avatar"
              :alt="currentUser.name"
              :fallback="currentUser.name.charAt(0)"
              size="sm"
            />
            <div class="flex-1">
              <Input
                v-model="replyContent"
                placeholder="Write a reply..."
                size="sm"
                @keydown.enter.prevent="submitReply(comment.id)"
              />
              <div class="mt-2 flex gap-2">
                <Button size="sm" @click="submitReply(comment.id)">Reply</Button>
                <Button size="sm" variant="ghost" @click="replyTo = null">Cancel</Button>
              </div>
            </div>
          </div>
          
          <Button
            v-else-if="currentUser"
            variant="ghost"
            size="sm"
            class="text-gray-500"
            @click="replyTo = comment.id"
          >
            <span class="i-lucide-message-circle mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
