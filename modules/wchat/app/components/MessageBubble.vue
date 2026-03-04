<script setup lang="ts">
import type { Message, Chat } from '../../types'
import { useReactions } from '../../composables/useUtilities'

interface Props {
  message: Message
  isOwn?: boolean
  showAvatar?: boolean
  chat?: Chat
}

const props = defineProps<Props>()
const { availableReactions, toggleReaction } = useReactions()

const emit = defineEmits<{
  reply: [message: Message]
  forward: [message: Message]
  edit: [message: Message]
  delete: [message: Message]
  pin: [message: Message]
  react: [message: Message, emoji: string]
}>()

const showMenu = ref(false)
const showReactions = ref(false)
const isHovered = ref(false)

const formattedTime = computed(() => {
  return new Date(props.message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const editedLabel = computed(() => {
  if (!props.message.isEdited) return ''
  return `edited ${props.message.editedAt ? new Date(props.message.editedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`
})

const isForwarded = computed(() => !!props.message.forwardFrom)
const hasMedia = computed(() => !!props.message.media)
const hasReactions = computed(() => props.message.reactions?.length > 0)

const handleReaction = async (emoji: string) => {
  await toggleReaction(props.message.id, emoji)
  showReactions.value = false
}

const handleEdit = () => {
  emit('edit', props.message)
  showMenu.value = false
}

const handleDelete = () => {
  emit('delete', props.message)
  showMenu.value = false
}

const handleReply = () => {
  emit('reply', props.message)
  showMenu.value = false
}

const handleForward = () => {
  emit('forward', props.message)
  showMenu.value = false
}

const handlePin = () => {
  emit('pin', props.message)
  showMenu.value = false
}
</script>

<template>
  <div
    class="flex gap-3"
    :class="{ 'flex-row-reverse': isOwn }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Avatar -->
    <div v-if="showAvatar && !isOwn" class="flex-shrink-0">
      <AtomsAvatar
        size="sm"
        :fallback="message.senderId.charAt(0).toUpperCase()"
      />
    </div>
    <div v-else-if="isOwn" class="w-8 flex-shrink-0" />

    <!-- Message Content -->
    <div class="flex flex-col max-w-[70%]" :class="{ 'items-end': isOwn }">
      <!-- Forwarded label -->
      <div
        v-if="isForwarded"
        class="text-xs text-muted mb-1 flex items-center gap-1"
        :class="{ 'flex-row-reverse': isOwn }"
      >
        <span class="i-lucide-forward w-3 h-3" />
        Forwarded from {{ message.forwardFrom?.originalSenderName || 'unknown' }}
      </div>

      <!-- Reply preview -->
      <div
        v-if="message.replyTo"
        class="text-xs text-muted bg-surface-hover p-2 rounded-t-lg border-l-2 border-primary"
        :class="{ 'rounded-tr-lg': isOwn, 'rounded-tl-lg': !isOwn }"
      >
        Replying to message
      </div>

      <!-- Message bubble -->
      <div
        class="relative group px-4 py-2"
        :class="[
          isOwn
            ? 'bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl rounded-br-sm'
            : 'bg-surface rounded-r-2xl rounded-tl-2xl rounded-bl-sm'
        ]"
      >
        <!-- Media content -->
        <div v-if="hasMedia" class="mb-2">
          <img
            v-if="message.media?.type === 'image'"
            :src="message.media.url"
            :alt="message.media.fileName"
            class="max-w-full rounded-lg cursor-pointer"
            loading="lazy"
          >
          <video
            v-else-if="message.media?.type === 'video'"
            :src="message.media.url"
            controls
            class="max-w-full rounded-lg"
          />
          <audio
            v-else-if="message.media?.type === 'audio' || message.media?.type === 'voice'"
            :src="message.media.url"
            controls
            class="w-full"
          />
          <div
            v-else
            class="flex items-center gap-2 p-2 bg-surface-hover rounded"
          >
            <span class="i-lucide-file w-5 h-5" />
            <span class="text-sm truncate">{{ message.media?.fileName }}</span>
          </div>
        </div>

        <!-- Text content -->
        <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>

        <!-- Time & Status -->
        <div
          class="flex items-center gap-1 mt-1"
          :class="isOwn ? 'justify-end' : 'justify-start'"
        >
          <span v-if="message.isEdited" class="text-xs opacity-70">
            {{ editedLabel }}
          </span>
          <span class="text-xs opacity-70">{{ formattedTime }}</span>
          <!-- Read receipts -->
          <span
            v-if="isOwn"
            class="w-4 h-4"
            :class="[
              message.readBy?.length
                ? 'i-lucide-check-check text-primary-foreground'
                : message.deliveredTo?.length
                  ? 'i-lucide-check text-primary-foreground'
                  : 'i-lucide-check text-primary-foreground/50'
            ]"
          />
        </div>

        <!-- Self-destruct indicator -->
        <div
          v-if="message.selfDestruct?.enabled"
          class="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
        >
          <span class="i-lucide-timer w-4 h-4 text-destructive-foreground" />
        </div>
      </div>

      <!-- Reactions -->
      <div v-if="hasReactions" class="flex flex-wrap gap-1 mt-1">
        <button
          v-for="reaction in message.reactions"
          :key="reaction.emoji"
          class="flex items-center gap-1 px-2 py-0.5 bg-surface-hover rounded-full text-sm hover:bg-surface-active transition-colors"
          :class="{ 'bg-primary/20': reaction.users.includes('current-user') }"
          @click="handleReaction(reaction.emoji)"
        >
          <span>{{ reaction.emoji }}</span>
          <span v-if="reaction.count > 1" class="text-xs text-muted">{{ reaction.count }}</span>
        </button>
      </div>

      <!-- Action menu -->
      <div
        v-if="isHovered"
        class="flex items-center gap-1 mt-1"
        :class="{ 'flex-row-reverse': isOwn }"
      >
        <!-- Reaction button -->
        <MoleculesPopover v-model:open="showReactions">
          <MoleculesPopoverTrigger as-child>
            <AtomsButton variant="ghost" size="icon-xs">
              <span class="i-lucide-smile w-4 h-4" />
            </AtomsButton>
          </MoleculesPopoverTrigger>
          <MoleculesPopoverContent class="w-auto p-2">
            <div class="flex flex-wrap gap-1 max-w-[200px]">
              <button
                v-for="emoji in availableReactions"
                :key="emoji"
                class="w-8 h-8 flex items-center justify-center text-xl hover:bg-surface-hover rounded transition-colors"
                @click="handleReaction(emoji)"
              >
                {{ emoji }}
              </button>
            </div>
          </MoleculesPopoverContent>
        </MoleculesPopover>

        <!-- More actions -->
        <MoleculesPopover v-model:open="showMenu">
          <MoleculesPopoverTrigger as-child>
            <AtomsButton variant="ghost" size="icon-xs">
              <span class="i-lucide-more-vertical w-4 h-4" />
            </AtomsButton>
          </MoleculesPopoverTrigger>
          <MoleculesPopoverContent class="w-48">
            <div class="flex flex-col gap-1">
              <AtomsButton variant="ghost" size="sm" class="justify-start" @click="handleReply">
                <span class="i-lucide-reply w-4 h-4 mr-2" />
                Reply
              </AtomsButton>
              <AtomsButton variant="ghost" size="sm" class="justify-start" @click="handleForward">
                <span class="i-lucide-forward w-4 h-4 mr-2" />
                Forward
              </AtomsButton>
              <AtomsButton variant="ghost" size="sm" class="justify-start" @click="handlePin">
                <span class="i-lucide-pin w-4 h-4 mr-2" />
                Pin
              </AtomsButton>
              <AtomsButton
                v-if="isOwn"
                variant="ghost"
                size="sm"
                class="justify-start"
                @click="handleEdit"
              >
                <span class="i-lucide-pencil w-4 h-4 mr-2" />
                Edit
              </AtomsButton>
              <AtomsButton
                variant="ghost"
                size="sm"
                class="justify-start text-destructive hover:text-destructive"
                @click="handleDelete"
              >
                <span class="i-lucide-trash w-4 h-4 mr-2" />
                Delete
              </AtomsButton>
            </div>
          </MoleculesPopoverContent>
        </MoleculesPopover>
      </div>
    </div>
  </div>
</template>
