<script setup lang="ts">
interface Command {
  id: string
  text: string
  type?: 'input' | 'output' | 'error' | 'success'
}

interface Props {
  commands?: Command[]
  prompt?: string
  welcomeMessage?: string
  height?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  commands: () => [],
  prompt: '$',
  welcomeMessage: 'Welcome to Terminal',
  height: '300px',
  readonly: false
})

const emit = defineEmits<{
  command: [text: string]
}>()

const inputRef = ref<HTMLInputElement>()
const currentInput = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)
const allCommands = ref<Command[]>([...props.commands])

const containerRef = ref<HTMLDivElement>()

onUpdated(() => {
  scrollToBottom()
})

const scrollToBottom = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
  }
}

const executeCommand = () => {
  const text = currentInput.value.trim()
  if (!text) return

  allCommands.value.push({
    id: Math.random().toString(36).substr(2, 9),
    text,
    type: 'input'
  })

  history.value.push(text)
  historyIndex.value = history.value.length
  emit('command', text)
  currentInput.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    executeCommand()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentInput.value = history.value[historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      currentInput.value = history.value[historyIndex.value]
    } else {
      historyIndex.value = history.value.length
      currentInput.value = ''
    }
  }
}

const focus = () => {
  inputRef.value?.focus()
}

const addOutput = (text: string, type: Command['type'] = 'output') => {
  allCommands.value.push({
    id: Math.random().toString(36).substr(2, 9),
    text,
    type
  })
}

defineExpose({ focus, addOutput, clear: () => allCommands.value = [] })
</script>

<template>
  <div
    class="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden font-mono text-sm"
  >
    <div class="flex items-center gap-2 border-b border-gray-700 bg-gray-800 px-4 py-2">
      <span class="i-lucide-terminal size-4 text-gray-400" />
      <span class="text-gray-300">Terminal</span>
      <div class="ml-auto flex gap-1.5">
        <div class="h-3 w-3 rounded-full bg-red-500" />
        <div class="h-3 w-3 rounded-full bg-yellow-500" />
        <div class="h-3 w-3 rounded-full bg-green-500" />
      </div>
    </div>

    <div
      ref="containerRef"
      class="overflow-auto p-4"
      :style="{ height }"
      @click="focus"
    >
      <div v-if="welcomeMessage" class="mb-4 text-gray-400">
        {{ welcomeMessage }}
      </div>

      <div
        v-for="cmd in allCommands"
        :key="cmd.id"
        class="mb-1"
      >
        <div v-if="cmd.type === 'input'" class="flex items-center gap-2">
          <span class="text-green-400">{{ prompt }}</span>
          <span class="text-gray-200">{{ cmd.text }}</span>
        </div>
        <div
          v-else
          class="pl-6"
          :class="{
            'text-gray-300': cmd.type === 'output',
            'text-red-400': cmd.type === 'error',
            'text-green-400': cmd.type === 'success'
          }"
        >
          {{ cmd.text }}
        </div>
      </div>

      <div v-if="!readonly" class="flex items-center gap-2">
        <span class="text-green-400">{{ prompt }}</span>
        <input
          ref="inputRef"
          v-model="currentInput"
          type="text"
          class="flex-1 bg-transparent text-gray-200 outline-none"
          spellcheck="false"
          autocomplete="off"
          @keydown="handleKeydown"
        />
      </div>
    </div>
  </div>
</template>
