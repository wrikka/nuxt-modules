<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

export interface ContextMenuOption {
  label: string
  icon?: string
  action?: () => void | Promise<void>
  children?: ContextMenuOption[]
  disabled?: boolean
  divider?: boolean
}

interface Props {
  modelValue?: boolean
  x?: number
  y?: number
  options?: ContextMenuOption[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  x: 0,
  y: 0,
  options: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [option: ContextMenuOption]
  close: []
}>()

const menuRef = ref<HTMLElement>()

onClickOutside(menuRef, () => {
  close()
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

async function handleAction(option: ContextMenuOption) {
  if (option.disabled || option.divider) return

  emit('select', option)
  close()

  if (option.action) {
    await option.action()
  }
}

// Close on Escape
onKeyStroke('Escape', () => {
  if (props.modelValue) {
    close()
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      ref="menuRef"
      class="fixed z-50 min-w-[160px] bg-popover border rounded-md shadow-lg p-1"
      :style="{ top: `${y}px`, left: `${x}px` }"
    >
      <ul class="space-y-0.5">
        <template v-for="(option, index) in options" :key="index">
          <!-- Divider -->
          <li v-if="option.divider">
            <Separator class="my-1" />
          </li>

          <!-- Menu Item with Children (Submenu) -->
          <li
            v-else-if="option.children && option.children.length > 0"
            class="relative group"
          >
            <button
              class="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
              :class="{ 'opacity-50 cursor-not-allowed': option.disabled }"
              :disabled="option.disabled"
              @click="handleAction(option)"
            >
              <div class="flex items-center gap-2">
                <span v-if="option.icon" :class="[option.icon, 'w-4 h-4']" />
                <span>{{ option.label }}</span>
              </div>
              <span class="i-lucide-chevron-right w-4 h-4 text-muted-foreground" />
            </button>

            <!-- Submenu -->
            <div class="absolute left-full top-0 ml-1 min-w-[160px] bg-popover border rounded-md shadow-lg p-1 hidden group-hover:block">
              <ul class="space-y-0.5">
                <li v-for="(child, childIndex) in option.children" :key="childIndex">
                  <button
                    class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                    :class="{ 'opacity-50 cursor-not-allowed': child.disabled }"
                    :disabled="child.disabled"
                    @click="handleAction(child)"
                  >
                    <span v-if="child.icon" :class="[child.icon, 'w-4 h-4']" />
                    <span>{{ child.label }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <!-- Regular Menu Item -->
          <li v-else>
            <button
              class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': option.disabled }"
              :disabled="option.disabled"
              @click="handleAction(option)"
            >
              <span v-if="option.icon" :class="[option.icon, 'w-4 h-4']" />
              <span>{{ option.label }}</span>
            </button>
          </li>
        </template>
      </ul>
    </div>
  </Teleport>
</template>
