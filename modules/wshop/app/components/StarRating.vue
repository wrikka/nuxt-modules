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
    return 'text-yellow-400'
  } else if (half) {
    return 'text-yellow-200'
  } else {
    return 'text-gray-300'
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

  <div class="flex items-center" :class="containerClass">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :class="[
        'transition-colors duration-200',
        interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
      ]"
      :disabled="!interactive"
      @click="handleClick(star)"
      @mouseenter="handleMouseEnter(star)"
      @mouseleave="handleMouseLeave"
    >
      <NuxtIcon
        :name="getStarFill(star) === 'none' ? 'i-mdi-star-outline' : 'i-mdi-star'"
        :size="String(size)"
        :class="getStarClass(star)"
      />
    </button>
    
    <span v-if="showCount" class="ml-2 text-sm text-gray-600">
      ({{ count || ratingCount }})
    </span>
  </div>

</template>
