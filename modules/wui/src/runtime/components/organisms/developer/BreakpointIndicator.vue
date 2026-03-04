<script setup lang="ts">
interface Breakpoint {
  name: string
  width: number
}

const breakpoints: Breakpoint[] = [
  { name: 'xs', width: 0 },
  { name: 'sm', width: 640 },
  { name: 'md', width: 768 },
  { name: 'lg', width: 1024 },
  { name: 'xl', width: 1280 },
  { name: '2xl', width: 1536 }
]

const currentWidth = ref(0)
const currentBreakpoint = ref('')
const isVisible = ref(false)

const updateInfo = () => {
  currentWidth.value = window.innerWidth
  for (let i = breakpoints.length - 1; i >= 0; i--) {
    if (currentWidth.value >= breakpoints[i].width) {
      currentBreakpoint.value = breakpoints[i].name
      break
    }
  }
}

onMounted(() => {
  updateInfo()
  window.addEventListener('resize', updateInfo)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'b' && e.ctrlKey && e.shiftKey) {
      e.preventDefault()
      isVisible.value = !isVisible.value
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateInfo)
})

const toggle = () => isVisible.value = !isVisible.value

defineExpose({ toggle })
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed bottom-2 right-2 z-[9999] flex items-center gap-3 rounded-lg bg-gray-900 px-3 py-2 text-white shadow-lg"
  >
    <span class="text-sm font-mono">{{ currentWidth }}px</span>
    <span class="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold">{{ currentBreakpoint }}</span>
    <button class="text-gray-400 hover:text-white" @click="isVisible = false">
      <span class="i-lucide-x size-4" />
    </button>
  </div>
</template>
