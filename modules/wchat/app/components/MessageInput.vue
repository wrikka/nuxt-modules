<script setup lang="ts">
import { useCloudDrafts } from '../../composables/useCloudFeatures'
import { useMedia } from '../../composables/useMedia'
import { useStickers } from '../../composables/useMedia'
import { useMessageScheduling } from '../../composables/useCloudFeatures'

const emit = defineEmits<{
  send: [content: string, options: { replyTo?: string; media?: any[]; selfDestruct?: any; scheduled?: Date }]
  typing: [isTyping: boolean]
}>()

const { saveDraft, getDraft, clearDraft } = useCloudDrafts()
const { uploadFile } = useMedia()
const { recentStickers, addToRecent } = useStickers()
const { scheduleMessage } = useMessageScheduling()

const chatId = inject('chatId', ref(''))

const message = ref('')
const replyTo = ref<string | null>(null)
const attachments = ref<File[]>([])
const isRecording = ref(false)
const showEmoji = ref(false)
const showStickers = ref(false)
const showSchedule = ref(false)
const scheduleDate = ref<Date | null>(null)
const selfDestruct = ref<number | null>(null)

// Load draft on mount
onMounted(() => {
  const draft = getDraft(chatId.value)
  if (draft) {
    message.value = draft.content
    replyTo.value = draft.replyTo || null
  }
})

// Save draft on input
watch(message, (val) => {
  saveDraft(chatId.value, val, replyTo.value || undefined)
  emit('typing', val.length > 0)
}, { debounce: 500 })

const handleSend = async () => {
  if (!message.value.trim() && attachments.value.length === 0) return

  const media = await Promise.all(
    attachments.value.map(file => uploadFile(file, chatId.value))
  )

  emit('send', message.value, {
    replyTo: replyTo.value || undefined,
    media: media.filter(Boolean),
    selfDestruct: selfDestruct.value ? { enabled: true, duration: selfDestruct.value } : undefined,
    scheduled: scheduleDate.value || undefined
  })

  // Clear input
  message.value = ''
  attachments.value = []
  replyTo.value = null
  selfDestruct.value = null
  scheduleDate.value = null
  showSchedule.value = false

  await clearDraft(chatId.value)
}

const handleFileSelect = (files: File[]) => {
  attachments.value.push(...files)
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1)
}

const insertEmoji = (emoji: string) => {
  message.value += emoji
  showEmoji.value = false
}

const insertSticker = (sticker: any) => {
  // Send sticker as message
  emit('send', '', { media: [{ type: 'sticker', ...sticker }] })
  addToRecent(sticker)
  showStickers.value = false
}

const startRecording = () => {
  isRecording.value = true
}

const stopRecording = async () => {
  isRecording.value = false
  // Handle voice recording upload
}

const selfDestructOptions = [
  { label: '1 day', value: 86400 },
  { label: '1 week', value: 604800 },
  { label: '1 month', value: 2592000 }
]
</script>

<template>
  <div class="border-t bg-background p-3">
    <!-- Reply preview -->
    <div v-if="replyTo" class="flex items-center gap-2 mb-2 p-2 bg-surface rounded">
      <span class="i-lucide-reply w-4 h-4 text-muted" />
      <span class="flex-1 text-sm text-muted truncate">Replying to message</span>
      <AtomsButton variant="ghost" size="icon-xs" @click="replyTo = null">
        <span class="i-lucide-x w-4 h-4" />
      </AtomsButton>
    </div>

    <!-- Attachments preview -->
    <div v-if="attachments.length" class="flex flex-wrap gap-2 mb-2">
      <div
        v-for="(file, i) in attachments"
        :key="i"
        class="flex items-center gap-2 px-2 py-1 bg-surface rounded"
      >
        <span class="i-lucide-file w-4 h-4" />
        <span class="text-sm truncate max-w-[150px]">{{ file.name }}</span>
        <AtomsButton variant="ghost" size="icon-xs" @click="removeAttachment(i)">
          <span class="i-lucide-x w-3 h-3" />
        </AtomsButton>
      </div>
    </div>

    <!-- Self-destruct indicator -->
    <div v-if="selfDestruct" class="flex items-center gap-2 mb-2 text-destructive text-sm">
      <span class="i-lucide-timer w-4 h-4" />
      Self-destruct in {{ selfDestructOptions.find(o => o.value === selfDestruct)?.label }}
      <AtomsButton variant="ghost" size="icon-xs" @click="selfDestruct = null">
        <span class="i-lucide-x w-3 h-3" />
      </AtomsButton>
    </div>

    <!-- Input area -->
    <div class="flex items-end gap-2">
      <!-- Attach button -->
      <MoleculesPopover>
        <MoleculesPopoverTrigger as-child>
          <AtomsButton variant="ghost" size="icon">
            <span class="i-lucide-paperclip w-5 h-5" />
          </AtomsButton>
        </MoleculesPopoverTrigger>
        <MoleculesPopoverContent class="w-auto">
          <div class="flex flex-col gap-1">
            <AtomsDropzone
              accept="*/*"
              @select="handleFileSelect"
            >
              <div class="flex items-center gap-2 p-2 hover:bg-surface-hover rounded cursor-pointer">
                <span class="i-lucide-file w-5 h-5" />
                <span>File</span>
              </div>
            </AtomsDropzone>
            <div class="flex items-center gap-2 p-2 hover:bg-surface-hover rounded cursor-pointer">
              <span class="i-lucide-image w-5 h-5" />
              <span>Photo/Video</span>
            </div>
          </div>
        </MoleculesPopoverContent>
      </MoleculesPopover>

      <!-- Emoji button -->
      <MoleculesPopover v-model:open="showEmoji">
        <MoleculesPopoverTrigger as-child>
          <AtomsButton variant="ghost" size="icon">
            <span class="i-lucide-smile w-5 h-5" />
          </AtomsButton>
        </MoleculesPopoverTrigger>
        <MoleculesPopoverContent class="w-auto p-2">
          <div class="grid grid-cols-8 gap-1 max-h-[200px] overflow-y-auto">
            <button
              v-for="emoji in ['😀','😂','🥰','😎','🤔','😭','😡','👍','❤️','🔥','🎉','🙏','👏','🤝','✨','🎊','💯','🚀']"
              :key="emoji"
              class="w-8 h-8 flex items-center justify-center text-xl hover:bg-surface-hover rounded"
              @click="insertEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </MoleculesPopoverContent>
      </MoleculesPopover>

      <!-- Sticker button -->
      <MoleculesPopover v-model:open="showStickers">
        <MoleculesPopoverTrigger as-child>
          <AtomsButton variant="ghost" size="icon">
            <span class="i-lucide-sticker w-5 h-5" />
          </AtomsButton>
        </MoleculesPopoverTrigger>
        <MoleculesPopoverContent class="w-[300px] h-[300px]">
          <div class="flex flex-col h-full">
            <MoleculesTabs default-value="recent" class="flex-1">
              <MoleculesTabsList class="grid w-full grid-cols-3">
                <MoleculesTabsTrigger value="recent">Recent</MoleculesTabsTrigger>
                <MoleculesTabsTrigger value="all">All</MoleculesTabsTrigger>
                <MoleculesTabsTrigger value="favorites">Favorites</MoleculesTabsTrigger>
              </MoleculesTabsList>
              <div class="flex-1 overflow-y-auto p-2">
                <!-- Sticker grid would go here -->
                <div class="text-center text-muted text-sm py-8">
                  Stickers will appear here
                </div>
              </div>
            </MoleculesTabs>
          </div>
        </MoleculesPopoverContent>
      </MoleculesPopover>

      <!-- Text input -->
      <div class="flex-1 relative">
        <AtomsTextarea
          v-model="message"
          placeholder="Type a message..."
          class="min-h-[44px] max-h-[150px] resize-none pr-24"
          @keydown.enter.prevent="handleSend"
        />
        <!-- Action buttons -->
        <div class="absolute right-2 bottom-2 flex items-center gap-1">
          <!-- Self-destruct -->
          <MoleculesPopover>
            <MoleculesPopoverTrigger as-child>
              <AtomsButton variant="ghost" size="icon-xs" :class="{ 'text-destructive': selfDestruct }">
                <span class="i-lucide-timer w-4 h-4" />
              </AtomsButton>
            </MoleculesPopoverTrigger>
            <MoleculesPopoverContent class="w-auto">
              <div class="flex flex-col gap-1">
                <button
                  v-for="opt in selfDestructOptions"
                  :key="opt.value"
                  class="px-3 py-2 text-left hover:bg-surface-hover rounded"
                  @click="selfDestruct = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </MoleculesPopoverContent>
          </MoleculesPopover>

          <!-- Schedule -->
          <MoleculesPopover v-model:open="showSchedule">
            <MoleculesPopoverTrigger as-child>
              <AtomsButton variant="ghost" size="icon-xs" :class="{ 'text-primary': scheduleDate }">
                <span class="i-lucide-calendar-clock w-4 h-4" />
              </AtomsButton>
            </MoleculesPopoverTrigger>
            <MoleculesPopoverContent class="w-auto p-4">
              <MoleculesDatePicker v-model="scheduleDate" />
            </MoleculesPopoverContent>
          </MoleculesPopover>
        </div>
      </div>

      <!-- Voice/Send button -->
      <AtomsButton
        v-if="message.trim() || attachments.length"
        variant="primary"
        size="icon"
        @click="handleSend"
      >
        <span class="i-lucide-send w-5 h-5" />
      </AtomsButton>
      <AtomsButton
        v-else
        variant="ghost"
        size="icon"
        :class="{ 'text-destructive': isRecording }"
        @mousedown="startRecording"
        @mouseup="stopRecording"
        @mouseleave="stopRecording"
      >
        <span class="i-lucide-mic w-5 h-5" :class="{ 'animate-pulse': isRecording }" />
      </AtomsButton>
    </div>
  </div>
</template>
