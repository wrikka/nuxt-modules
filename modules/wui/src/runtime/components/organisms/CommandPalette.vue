<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'

export interface Command {
  id: string
  label: string
  description?: string
  icon?: string
  shortcut?: string
  section?: string
  action?: () => void | Promise<void>
  disabled?: boolean
}

interface Props {
  modelValue?: boolean
  commands?: Command[]
  placeholder?: string
  emptyText?: string
  grouped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  commands: () => [],
  placeholder: 'Type a command or search...',
  emptyText: 'No commands found',
  grouped: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [command: Command]
  close: []
}>()

const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement>()
const containerRef = ref<HTMLElement>()

// Filter commands based on search
const filteredCommands = computed(() => {
  if (!searchQuery.value.trim()) return props.commands

  const query = searchQuery.value.toLowerCase()
  return props.commands.filter(cmd =>
    !cmd.disabled && (
      cmd.label.toLowerCase().includes(query) ||
      cmd.description?.toLowerCase().includes(query) ||
      cmd.section?.toLowerCase().includes(query)
    )
  )
})

// Group commands by section
const groupedCommands = computed(() => {
  if (!props.grouped) {
    return [['All', filteredCommands.value] as [string, Command[]]]
  }

  const groups = new Map<string, Command[]>()
  for (const cmd of filteredCommands.value) {
    const section = cmd.section || 'General'
    if (!groups.has(section)) {
      groups.set(section, [])
    }
    groups.get(section)!.push(cmd)
  }
  return Array.from(groups.entries())
})

// Reset selection when search changes
watch(searchQuery, () => {
  selectedIndex.value = 0
})

// Focus input when opened
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

// Close on click outside
onClickOutside(containerRef, () => {
  if (props.modelValue) {
    close()
  }
})

// Keyboard shortcuts
onKeyStroke('Escape', () => {
  if (props.modelValue) close()
})

onKeyStroke('k', (e) => {
  if ((e.metaKey || e.ctrlKey) && !props.modelValue) {
    e.preventDefault()
    open()
  }
})

function open() {
  emit('update:modelValue', true)
}

function close() {
  searchQuery.value = ''
  selectedIndex.value = 0
  emit('update:modelValue', false)
  emit('close')
}

function selectNext() {
  const total = filteredCommands.value.length
  if (total > 0) {
    selectedIndex.value = (selectedIndex.value + 1) % total
  }
}

function selectPrev() {
  const total = filteredCommands.value.length
  if (total > 0) {
    selectedIndex.value = (selectedIndex.value - 1 + total) % total
  }
}

function getTotalIndex(sectionIndex: number, itemIndex: number): number {
  let count = 0
  for (let i = 0; i < sectionIndex; i++) {
    count += groupedCommands.value[i][1].length
  }
  return count + itemIndex
}

async function executeCommand(command: Command) {
  emit('select', command)
  close()
  if (command.action) {
    await command.action()
  }
}

async function executeSelected() {
  const allCommands = filteredCommands.value
  const command = allCommands[selectedIndex.value]
  if (command) {
    await executeCommand(command)
  }
}

function handleInputKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      selectNext()
      break
    case 'ArrowUp':
      e.preventDefault()
      selectPrev()
      break
    case 'Enter':
      e.preventDefault()
      executeSelected()
      break
  }
}

function isSelected(sectionIndex: number, itemIndex: number): boolean {
  return getTotalIndex(sectionIndex, itemIndex) === selectedIndex.value
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      >
        <div
          ref="containerRef"
          class="w-full max-w-2xl bg-background border rounded-lg shadow-2xl overflow-hidden"
        >
          <!-- Search Input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b">
            <span class="i-lucide-search text-muted-foreground" />
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="placeholder"
              class="flex-1 bg-transparent outline-none text-foreground"
              @keydown="handleInputKeydown"
            >
            <kbd class="px-2 py-1 text-xs bg-muted rounded">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="max-h-[60vh] overflow-y-auto p-2">
            <div v-if="filteredCommands.length === 0" class="px-4 py-8 text-center text-muted-foreground">
              {{ emptyText }}
            </div>

            <template v-else>
              <div
                v-for="([section, items], sectionIdx) in groupedCommands"
                :key="section"
                class="mb-2"
              >
                <div v-if="grouped && items.length > 0" class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {{ section }}
                </div>

                <button
                  v-for="(cmd, itemIdx) in items"
                  :key="cmd.id"
                  class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors hover:bg-accent"
                  :class="{ 'bg-accent': isSelected(sectionIdx, itemIdx) }"
                  @click="executeCommand(cmd)"
                  @mouseenter="selectedIndex = getTotalIndex(sectionIdx, itemIdx)"
                >
                  <span v-if="cmd.icon" :class="[cmd.icon, 'w-5 h-5 text-muted-foreground']" />
                  <div class="flex-1 min-w-0">
                    <div class="font-medium truncate">{{ cmd.label }}</div>
                    <div v-if="cmd.description" class="text-sm text-muted-foreground truncate">
                      {{ cmd.description }}
                    </div>
                  </div>
                  <span v-if="cmd.shortcut" class="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {{ cmd.shortcut }}
                  </span>
                </button>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
            <div class="flex gap-4">
              <span><kbd class="px-1 bg-background border rounded">↑↓</kbd> Navigate</span>
              <span><kbd class="px-1 bg-background border rounded">↵</kbd> Execute</span>
            </div>
            <span>{{ filteredCommands.length }} commands</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
