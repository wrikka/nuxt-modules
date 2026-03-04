<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface CarouselItem {
  id: string
  src?: string
  content?: string
  title?: string
  description?: string
}

interface Props {
  items: CarouselItem[]
  autoplay?: boolean
  interval?: number
  loop?: boolean
  showIndicators?: boolean
  showArrows?: boolean
  height?: string
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  interval: 5000,
  loop: true,
  showIndicators: true,
  showArrows: true,
  height: '300px'
})

const emit = defineEmits<{
  change: [index: number]
}>()

const _currentIndex = ref(0)
const _direction = ref<'next' | 'prev'>('next')
let _autoplayTimer: ReturnType<typeof setInterval> | null = null

const _hasItems = computed(() => _props.items.length > 0)
const _isFirst = computed(() => _currentIndex.value === 0)
const _isLast = computed(() => _currentIndex.value === _props.items.length - 1)

const _goTo = (index: number) => {
  if (index < 0) {
    _currentIndex.value = _props.loop ? _props.items.length - 1 : 0
  }
  else if (index >= _props.items.length) {
    _currentIndex.value = _props.loop ? 0 : _props.items.length - 1
  }
  else {
    _currentIndex.value = index
  }
  emit('change', _currentIndex.value)
}

const _next = () => {
  _direction.value = 'next'
  _goTo(_currentIndex.value + 1)
}

const _prev = () => {
  _direction.value = 'prev'
  _goTo(_currentIndex.value - 1)
}

const _startAutoplay = () => {
  if (_props.autoplay && _props.items.length > 1) {
    _autoplayTimer = setInterval(_next, _props.interval)
  }
}

const _stopAutoplay = () => {
  if (_autoplayTimer) {
    clearInterval(_autoplayTimer)
    _autoplayTimer = null
  }
}

onMounted(_startAutoplay)
onUnmounted(_stopAutoplay)
</script>

<template>
  <div
    :class="['relative overflow-hidden rounded-lg', _props.class]"
    :style="{ height }"
    @mouseenter="_stopAutoplay"
    @mouseleave="_startAutoplay"
  >
    <div
      class="flex transition-transform duration-500 ease-out h-full"
      :style="{ transform: `translateX(-${_currentIndex * 100}%)` }"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="w-full flex-shrink-0 h-full"
      >
        <slot :item="item" :index="_currentIndex">
          <div class="relative h-full w-full bg-muted">
            <img
              v-if="item.src"
              :src="item.src"
              :alt="item.title || ''"
              class="h-full w-full object-cover"
            />
            <div
              v-else-if="item.content"
              class="flex h-full items-center justify-center p-8"
              v-html="item.content"
            />
            
            <div
              v-if="item.title || item.description"
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white"
            >
              <h3 v-if="item.title" class="font-semibold">{{ item.title }}</h3>
              <p v-if="item.description" class="mt-1 text-sm opacity-90">{{ item.description }}</p>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <button
      v-if="showArrows && items.length > 1"
      type="button"
      class="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-md hover:bg-background"
      @click="_prev"
    >
      <span class="i-lucide-chevron-left h-5 w-5" />
    </button>

    <button
      v-if="showArrows && items.length > 1"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-md hover:bg-background"
      @click="_next"
    >
      <span class="i-lucide-chevron-right h-5 w-5" />
    </button>

    <div
      v-if="showIndicators && items.length > 1"
      class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5"
    >
      <button
        v-for="(_, index) in items"
        :key="index"
        type="button"
        :class="[
          'h-2 rounded-full transition-all',
          index === _currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
        ]"
        @click="_goTo(index)"
      />
    </div>
  </div>
</template>
