<script setup lang="ts">
import { ref, computed } from 'vue'

interface Image {
  src: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

interface Props {
  images: Image[]
  layout?: 'grid' | 'masonry' | 'carousel'
  columns?: number
  gap?: number
  lightbox?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'grid',
  columns: 3,
  gap: 4,
  lightbox: true
})

const lightboxOpen = ref(false)
const currentIndex = ref(0)

const openLightbox = (index: number) => {
  if (!props.lightbox) return
  currentIndex.value = index
  lightboxOpen.value = true
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const gridClass = computed(() => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'sm:grid-cols-2 md:grid-cols-3',
    4: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }
  return `grid ${cols[props.columns as keyof typeof cols] || cols[3]} gap-${props.gap}`
})
</script>

<template>
  <div>
    <div v-if="layout === 'grid'" :class="gridClass">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="group relative cursor-pointer overflow-hidden rounded-lg"
        @click="openLightbox(index)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="aspect-square w-full object-cover transition-transform group-hover:scale-105"
        />
        <div
          v-if="image.caption"
          class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <p class="text-sm text-white">{{ image.caption }}</p>
        </div>
      </div>
    </div>
    
    <div
      v-else-if="layout === 'masonry'"
      :class="`columns-${columns} gap-${gap} space-y-${gap}`"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="break-inside-avoid cursor-pointer overflow-hidden rounded-lg"
        @click="openLightbox(index)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="w-full"
        />
      </div>
    </div>
    
    <Carousel
      v-else-if="layout === 'carousel'"
      :items="images"
      class="rounded-lg"
    >
      <template #item="{ item }">
        <img
          :src="item.src"
          :alt="item.alt"
          class="aspect-video w-full object-cover"
        />
      </template>
    </Carousel>
    
    <Teleport v-if="lightbox" to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        @click="lightboxOpen = false"
      >
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          @click.stop="prevImage"
        >
          <span class="i-lucide-chevron-left size-6" />
        </button>
        <img
          :src="images[currentIndex].src"
          :alt="images[currentIndex].alt"
          class="max-h-[90vh] max-w-[90vw] object-contain"
          @click.stop
        />
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          @click.stop="nextImage"
        >
          <span class="i-lucide-chevron-right size-6" />
        </button>
        <button
          class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          @click="lightboxOpen = false"
        >
          <span class="i-lucide-x size-6" />
        </button>
        <p
          v-if="images[currentIndex].caption"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white"
        >
          {{ images[currentIndex].caption }}
        </p>
      </div>
    </Teleport>
  </div>
</template>
