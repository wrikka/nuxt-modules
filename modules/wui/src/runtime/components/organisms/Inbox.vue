<script setup lang="ts">
import { ref, computed } from 'vue'

interface Message {
  id: string
  sender: { name: string; avatar?: string; email: string }
  subject: string
  preview: string
  time: Date
  unread: boolean
  starred: boolean
  labels?: string[]
}

interface Props {
  messages: Message[]
  loading?: boolean
  selectedId?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'select': [messageId: string]
  'star': [messageId: string]
  'archive': [messageIds: string[]]
  'delete': [messageIds: string[]]
}>()

const selectedIds = ref<string[]>(props.selectedId ? [props.selectedId] : [])
const selectAll = ref(false)
const filter = ref<'all' | 'unread' | 'starred'>('all')

const filteredMessages = computed(() => {
  switch (filter.value) {
    case 'unread': return props.messages.filter(m => m.unread)
    case 'starred': return props.messages.filter(m => m.starred)
    default: return props.messages
  }
})

const unreadCount = computed(() => props.messages.filter(m => m.unread).length)

const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
  selectedIds.value = selectAll.value ? filteredMessages.value.map(m => m.id) : []
}

const isSelected = (id: string) => selectedIds.value.includes(id)
</script>

<template>
  <div class="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center gap-4 border-b border-gray-200 p-3">
      <Checkbox :model-value="selectAll" @update:model-value="toggleSelectAll" />
      <div class="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          :class="filter === 'all' ? 'bg-gray-100' : ''"
          @click="filter = 'all'"
        >
          All
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :class="filter === 'unread' ? 'bg-gray-100' : ''"
          @click="filter = 'unread'"
        >
          Unread {{ unreadCount > 0 ? `(${unreadCount})` : '' }}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :class="filter === 'starred' ? 'bg-gray-100' : ''"
          @click="filter = 'starred'"
        >
          Starred
        </Button>
      </div>
      <div v-if="selectedIds.length > 0" class="ml-auto flex gap-2">
        <Button size="sm" variant="ghost" @click="$emit('archive', selectedIds)">
          <span class="i-lucide-archive mr-1" />
          Archive
        </Button>
        <Button size="sm" variant="ghost" @click="$emit('delete', selectedIds)">
          <span class="i-lucide-trash-2 mr-1" />
          Delete
        </Button>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="flex justify-center py-8">
        <Spinner />
      </div>
      
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="flex cursor-pointer items-center gap-3 border-b border-gray-100 p-3 transition-colors hover:bg-gray-50"
        :class="{ 'bg-blue-50/50': message.unread }"
        @click="$emit('select', message.id)"
      >
        <Checkbox
          :model-value="isSelected(message.id)"
          @click.stop
          @update:model-value="isSelected(message.id) ? selectedIds = selectedIds.filter(id => id !== message.id) : selectedIds.push(message.id)"
        />
        <button
          class="text-gray-400 hover:text-yellow-500"
          :class="message.starred ? 'text-yellow-500' : ''"
          @click.stop="$emit('star', message.id)"
        >
          <span :class="message.starred ? 'i-lucide-star fill-current' : 'i-lucide-star'" />
        </button>
        <Avatar
          :src="message.sender.avatar"
          :alt="message.sender.name"
          :fallback="message.sender.name.charAt(0)"
          size="sm"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="font-medium" :class="message.unread ? 'text-gray-900' : 'text-gray-600'">
              {{ message.sender.name }}
            </span>
            <BadgeGroup
              v-if="message.labels?.length"
              :badges="message.labels.map(l => ({ label: l, variant: 'secondary' }))"
              size="sm"
            />
          </div>
          <p class="truncate text-sm" :class="message.unread ? 'font-medium text-gray-900' : 'text-gray-600'">
            {{ message.subject }}
          </p>
          <p class="truncate text-xs text-gray-400">{{ message.preview }}</p>
        </div>
        <Time :value="message.time" format="relative" class="shrink-0 text-xs text-gray-400" />
      </div>
    </div>
  </div>
</template>
