<script setup lang="ts">
interface User {
  id: string | number
  name: string
  username: string
  avatar?: string
}

interface Props {
  modelValue?: string
  users: User[]
  placeholder?: string
  trigger?: string
  maxSuggestions?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Type @ to mention...',
  trigger: '@',
  maxSuggestions: 5,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  mention: [user: User]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const isOpen = ref(false)
const query = ref('')
const cursorPosition = ref(0)
const highlightedIndex = ref(0)

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const filteredUsers = computed(() => {
  if (!query.value) return props.users.slice(0, props.maxSuggestions)
  return props.users
    .filter(user =>
      user.name.toLowerCase().includes(query.value.toLowerCase()) ||
      user.username.toLowerCase().includes(query.value.toLowerCase())
    )
    .slice(0, props.maxSuggestions)
})

const onInput = () => {
  const textarea = textareaRef.value
  if (!textarea) return

  const text = textarea.value
  const cursor = textarea.selectionStart
  cursorPosition.value = cursor

  const beforeCursor = text.slice(0, cursor)
  const lastTrigger = beforeCursor.lastIndexOf(props.trigger)

  if (lastTrigger !== -1) {
    const afterTrigger = beforeCursor.slice(lastTrigger + 1)
    if (!afterTrigger.includes(' ')) {
      query.value = afterTrigger
      isOpen.value = true
      highlightedIndex.value = 0
      return
    }
  }

  isOpen.value = false
}

const insertMention = (user: User) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const text = textarea.value
  const cursor = textarea.selectionStart
  const beforeCursor = text.slice(0, cursor)
  const lastTrigger = beforeCursor.lastIndexOf(props.trigger)

  if (lastTrigger !== -1) {
    const before = text.slice(0, lastTrigger)
    const after = text.slice(cursor)
    const mention = `${props.trigger}${user.username} `
    value.value = before + mention + after

    nextTick(() => {
      const newCursor = lastTrigger + mention.length
      textarea.setSelectionRange(newCursor, newCursor)
      textarea.focus()
    })
  }

  isOpen.value = false
  emit('mention', user)
}

const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (highlightedIndex.value < filteredUsers.value.length - 1) {
        highlightedIndex.value++
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--
      }
      break
    case 'Enter':
    case 'Tab':
      e.preventDefault()
      if (filteredUsers.value[highlightedIndex.value]) {
        insertMention(filteredUsers.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      isOpen.value = false
      break
  }
}

const getMentionedUsers = (): User[] => {
  const mentionRegex = new RegExp(`${props.trigger}([\\w-]+)`, 'g')
  const mentions = value.value.match(mentionRegex) || []
  return mentions
    .map(m => {
      const username = m.slice(1)
      return props.users.find(u => u.username === username)
    })
    .filter(Boolean) as User[]
}

defineExpose({ getMentionedUsers })
</script>

<template>
  <div class="relative">
    <textarea
      ref="textareaRef"
      v-model="value"
      :placeholder="placeholder"
      :disabled="disabled"
      class="min-h-[100px] w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      @input="onInput"
      @keydown="onKeydown"
    />

    <div
      v-if="isOpen && filteredUsers.length > 0"
      class="absolute z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div
        v-for="(user, index) in filteredUsers"
        :key="user.id"
        class="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100"
        :class="{ 'bg-blue-50': index === highlightedIndex }"
        @click="insertMention(user)"
      >
        <Avatar
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
          size="sm"
        />
        <Avatar v-else :alt="user.name" size="sm" />
        <div>
          <div class="font-medium">{{ user.name }}</div>
          <div class="text-sm text-gray-500">{{ user.username }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
