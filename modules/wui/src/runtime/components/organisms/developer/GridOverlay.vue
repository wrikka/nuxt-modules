<script setup lang="ts">
interface GridConfig {
  columns?: number
  gutter?: number
  margin?: number
  opacity?: number
  color?: string
}

interface Props {
  columns?: number
  gutter?: number
  margin?: number
  opacity?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  columns: 12,
  gutter: 24,
  margin: 0,
  opacity: 0.1,
  color: '#3b82f6'
})

const isVisible = ref(false)
const isLocked = ref(false)

const toggle = () => isVisible.value = !isVisible.value
const lock = () => isLocked.value = !isLocked.value

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'g' && e.ctrlKey && e.shiftKey) {
      e.preventDefault()
      toggle()
    }
  })
})

defineExpose({ toggle, lock, isVisible, isLocked })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="pointer-events-none fixed inset-0 z-[9998]"
      :class="{ 'pointer-events-auto': isLocked }"
      @click="!isLocked && (isVisible = false)"
    >
      <div
        class="mx-auto flex h-full"
        :style="{ maxWidth: '100%', padding: `0 ${margin}px` }"
      >
        <div
          v-for="i in columns"
          :key="i"
          class="flex-1 border-x"
          :style="{
            margin: `0 ${gutter / 2}px`,
            backgroundColor: color,
            opacity: opacity,
            borderColor: color
          }"
        />
      </div>
    </div>
  </Teleport>

  <div
    v-if="isVisible"
    class="fixed bottom-2 left-2 z-[9999] flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-white shadow-lg"
  >
    <span class="text-xs">{{ columns }} cols</span>
    <button
      class="rounded p-1 hover:bg-gray-700"
      :class="{ 'bg-blue-600': isLocked }"
      @click="lock"
    >
      <span class="i-lucide-lock size-4" :class="{ 'i-lucide-unlock': !isLocked }" />
    </button>
    <button class="rounded p-1 hover:bg-gray-700" @click="isVisible = false">
      <span class="i-lucide-x size-4" />
    </button>
  </div>
</template>
