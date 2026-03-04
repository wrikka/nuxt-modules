<script setup lang="ts">
import NuxtIcon from '@nuxt/icon'

interface Props {
  rating: number
  size?: number
  interactive?: boolean
  showCount?: boolean
  count?: number
  ratingCount?: number
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  interactive: false,
  showCount: false,
  containerClass: ''
})

const emit = defineEmits<{
  'update:rating': [rating: number]
  'rating-change': [rating: number]
}>()

const hoverRating = ref(0)

const displayRating = computed(() => {
  if (props.interactive && hoverRating.value > 0) {
    return hoverRating.value
  }
  return props.rating
})

const getStarClass = (star: number) => {
  const filled = star <= Math.floor(displayRating.value)
  const half = star === Math.ceil(displayRating.value) && displayRating.value % 1 !== 0
  
  if (filled) {
    return 'text-warning-400'
  } else if (half) {
    return 'text-warning-200'
  } else {
    return 'text-secondary-300'
  }
}

const getStarFill = (star: number) => {
  const filled = star <= Math.floor(displayRating.value)
  const half = star === Math.ceil(displayRating.value) && displayRating.value % 1 !== 0
  
  if (filled) {
    return 'currentColor'
  } else if (half) {
    return 'currentColor'
  } else {
    return 'none'
  }
}

const handleClick = (star: number) => {
  if (!props.interactive) return
  
  emit('update:rating', star)
  emit('rating-change', star)
}

const handleMouseEnter = (star: number) => {
  if (!props.interactive) return
  hoverRating.value = star
}

const handleMouseLeave = () => {
  if (!props.interactive) return
  hoverRating.value = 0
}
</script>

<template>
  <div 
    class="flex items-center gap-1" 
    :class="containerClass"
    role="img"
    :aria-label="`Rating: ${rating} out of 5 stars`"
  >
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :class="[
        'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-warning-500 focus-visible:ring-offset-2 rounded',
        interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default',
        star <= Math.floor(displayRating.value) ? 'text-warning-400' : 'text-secondary-300'
      ]"
      :disabled="!interactive"
      :aria-label="`Rate ${star} stars`"
      @click="handleClick(star)"
      @mouseenter="handleMouseEnter(star)"
      @mouseleave="handleMouseLeave"
    >
      <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </button>
    
    <span 
      v-if="showCount" 
      class="ml-2 text-sm text-secondary-600"
      aria-label="Number of ratings"
    >
      ({{ count || ratingCount }})
    </span>
  </div>
</template>
