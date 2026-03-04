<script setup lang="ts">
import { ref } from 'vue'

interface Action {
  label: string
  icon?: string
  value: string
  disabled?: boolean
}

interface Props {
  mainAction: Action
  actions: Action[]
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const emit = defineEmits<{
  click: [value: string]
}>()

const open = ref(false)

const handleMain = () => emit('click', props.mainAction.value)
const handleAction = (action: Action) => {
  if (action.disabled) return
  emit('click', action.value)
  open.value = false
}
</script>

<template>
  <div class="relative inline-flex">
    <Button
      :variant="variant"
      :size="size"
      class="rounded-r-none"
      @click="handleMain"
    >
      <span v-if="mainAction.icon" :class="`i-lucide-${mainAction.icon} mr-1`" />
      {{ mainAction.label }}
    </Button>
    <div class="relative">
      <Button
        :variant="variant"
        :size="size"
        class="rounded-l-none border-l-0 px-2"
        @click="open = !open"
      >
        <span class="i-lucide-chevron-down size-4" />
      </Button>
      <div
        v-if="open"
        class="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded border border-gray-200 bg-white shadow-lg"
      >
        <button
          v-for="action in actions"
          :key="action.value"
          type="button"
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100"
          :class="{ 'opacity-50 cursor-not-allowed': action.disabled }"
          @click="handleAction(action)"
        >
          <span v-if="action.icon" :class="`i-lucide-${action.icon} size-4`" />
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>
