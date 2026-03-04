<script setup lang="ts">
interface Props {
  src?: string
  page?: number
  scale?: number
  rotate?: number
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  scale: 1,
  rotate: 0
})

const emit = defineEmits<{
  load: [pageCount: number]
  error: [error: Error]
}>()

const iframeRef = ref<HTMLIFrameElement>()
const isLoading = ref(true)
const hasError = ref(false)

const onLoad = () => {
  isLoading.value = false
  emit('load', 1)
}

const onError = () => {
  isLoading.value = false
  hasError.value = true
  emit('error', new Error('Failed to load PDF'))
}

const zoomIn = () => {
  if (!iframeRef.value?.contentDocument?.body) return
  const current = parseFloat(iframeRef.value.style.zoom || '1')
  iframeRef.value.style.zoom = String(current + 0.1)
}

const zoomOut = () => {
  if (!iframeRef.value?.contentDocument?.body) return
  const current = parseFloat(iframeRef.value.style.zoom || '1')
  iframeRef.value.style.zoom = String(Math.max(0.1, current - 0.1))
}
</script>

<template>
  <div class="relative rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-2">
      <div class="flex items-center gap-2">
        <Button size="sm" variant="ghost" @click="zoomOut">
          <span class="i-lucide-zoom-out size-4" />
        </Button>
        <span class="text-sm">{{ Math.round((scale || 1) * 100) }}%</span>
        <Button size="sm" variant="ghost" @click="zoomIn">
          <span class="i-lucide-zoom-in size-4" />
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <Button size="sm" variant="ghost" @click="page > 1 && $emit('update:page', page - 1)">
          <span class="i-lucide-chevron-left size-4" />
        </Button>
        <span class="text-sm">Page {{ page }}</span>
        <Button size="sm" variant="ghost" @click="$emit('update:page', page + 1)">
          <span class="i-lucide-chevron-right size-4" />
        </Button>
      </div>
    </div>
    
    <div class="relative aspect-[3/4] w-full overflow-auto">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <Spinner />
      </div>
      
      <div v-else-if="hasError" class="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
        <span class="i-lucide-file-x size-12 mb-2" />
        <p>Failed to load PDF</p>
      </div>
      
      <iframe
        v-if="src"
        ref="iframeRef"
        :src="src"
        class="h-full w-full"
        @load="onLoad"
        @error="onError"
      />
      
      <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
        <span class="i-lucide-file-text size-12 mb-2" />
        <p>No PDF source provided</p>
      </div>
    </div>
  </div>
</template>
