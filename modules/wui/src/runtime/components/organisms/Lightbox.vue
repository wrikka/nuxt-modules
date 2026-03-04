<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface LightboxImage {
  src: string
  thumbnail?: string
  alt?: string
  caption?: string
}

interface Props {
  images: LightboxImage[]
  modelValue?: boolean
  startIndex?: number
  loop?: boolean
  keyboard?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  startIndex: 0,
  loop: true,
  keyboard: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [index: number]
}>()

const _currentIndex = ref(_props.startIndex)
const _isOpen = computed({
  get: () => _props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const _currentImage = computed(() => _props.images[_currentIndex.value])

const _close = () => {
  _isOpen.value = false
}

const _goTo = (index: number) => {
  if (index < 0) {
    _currentIndex.value = _props.loop ? _props.images.length - 1 : 0
  }
  else if (index >= _props.images.length) {
    _currentIndex.value = _props.loop ? 0 : _props.images.length - 1
  }
  else {
    _currentIndex.value = index
  }
  emit('change', _currentIndex.value)
}

const _next = () => _goTo(_currentIndex.value + 1)
const _prev = () => _goTo(_currentIndex.value - 1)

const _handleKeydown = (event: KeyboardEvent) => {
  if (!_props.keyboard || !_isOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      _close()
      break
    case 'ArrowLeft':
      _prev()
      break
    case 'ArrowRight':
      _next()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', _handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', _handleKeydown)
})

watch(() => _props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="_isOpen"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        @click="_close"
      >
        <button
          type="button"
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          @click="_close"
        >
          <span class="i-lucide-x h-6 w-6" />
        </button>

        <button
          v-if="images.length > 1"
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          @click.stop="_prev"
        >
          <span class="i-lucide-chevron-left h-8 w-8" />
        </button>

        <button
          v-if="images.length > 1"
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          @click.stop="_next"
        >
          <span class="i-lucide-chevron-right h-8 w-8" />
        </button>

        <div class="max-h-[80vh] max-w-[90vw]" @click.stop>
          <img
            v-if="_currentImage"
            :src="_currentImage.src"
            :alt="_currentImage.alt || ''"
            class="max-h-[80vh] max-w-[90vw] object-contain"
          >
          
          <p
            v-if="_currentImage?.caption"
            class="mt-4 text-center text-white/80"
          >
            {{ _currentImage.caption }}
          </p>
        </div>

        <div
          v-if="images.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
        >
          <button
            v-for="(_, index) in images"
            :key="index"
            type="button"
            :class="[
              'h-2 rounded-full transition-all',
              index === _currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            ]"
            @click.stop="_goTo(index)"
          />
        </div>

        <div class="absolute bottom-4 right-4 text-white/60 text-sm">
          {{ _currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
