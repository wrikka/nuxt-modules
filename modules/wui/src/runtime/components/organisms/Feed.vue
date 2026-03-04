<script setup lang="ts">
import { ref } from 'vue'

interface Post {
  id: string
  author: { name: string; avatar?: string; verified?: boolean }
  content: string
  media?: Array<{ type: 'image' | 'video'; url: string }>
  time: Date
  likes: number
  comments: number
  shares: number
  liked?: boolean
}

interface Props {
  posts: Post[]
  currentUser?: { name: string; avatar?: string }
  loading?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: false
})

const emit = defineEmits<{
  'like': [postId: string]
  'comment': [postId: string]
  'share': [postId: string]
  'loadMore': []
}>()
</script>

<template>
  <div class="space-y-4">
    <Card
      v-for="post in posts"
      :key="post.id"
      class="overflow-hidden"
    >
      <CardHeader class="pb-2">
        <div class="flex items-center gap-3">
          <Avatar
            :src="post.author.avatar"
            :alt="post.author.name"
            :fallback="post.author.name.charAt(0)"
          />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold">{{ post.author.name }}</span>
              <span
                v-if="post.author.verified"
                class="i-lucide-badge-check size-4 text-blue-500"
              />
            </div>
            <Time :value="post.time" format="relative" class="text-sm text-gray-500" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent class="py-2">
        <p class="text-gray-800">{{ post.content }}</p>
        
        <div v-if="post.media?.length" class="mt-3 grid gap-2" :class="post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'">
          <img
            v-for="media in post.media"
            :key="media.url"
            :src="media.url"
            class="rounded-lg object-cover"
            :class="post.media.length === 1 ? 'max-h-96 w-full' : 'h-48 w-full'"
          />
        </div>
      </CardContent>
      
      <CardFooter class="border-t border-gray-100 pt-3">
        <div class="flex w-full items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            :class="post.liked ? 'text-red-500' : 'text-gray-500'"
            @click="$emit('like', post.id)"
          >
            <span :class="post.liked ? 'i-lucide-heart fill-current' : 'i-lucide-heart'" />
            {{ post.likes }}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            class="text-gray-500"
            @click="$emit('comment', post.id)"
          >
            <span class="i-lucide-message-circle" />
            {{ post.comments }}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            class="text-gray-500"
            @click="$emit('share', post.id)"
          >
            <span class="i-lucide-share-2" />
            {{ post.shares }}
          </Button>
        </div>
      </CardFooter>
    </Card>
    
    <div v-if="loading" class="flex justify-center py-4">
      <Spinner />
    </div>
    
    <Button
      v-if="hasMore && !loading"
      variant="outline"
      class="w-full"
      @click="$emit('loadMore')"
    >
      Load more
    </Button>
  </div>
</template>
