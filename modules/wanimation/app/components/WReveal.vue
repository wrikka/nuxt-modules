<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import anime from 'animejs'

interface Props {
  duration?: number
  distance?: number
  origin?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  easing?: string
  threshold?: number
  once?: boolean
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 600,
  distance: 50,
  origin: 'bottom',
  delay: 0,
  easing: 'easeOutCubic',
  threshold: 0.1,
  once: true,
  tag: 'div',
})

const elementRef = ref<HTMLElement | null>(null)
const hasAnimated = ref(false)

const getTransform = () => {
  switch (props.origin) {
    case 'top':
      return { translateY: -props.distance }
    case 'bottom':
      return { translateY: props.distance }
    case 'left':
      return { translateX: -props.distance }
    case 'right':
      return { translateX: props.distance }
    default:
      return { translateY: props.distance }
  }
}

const animate = (): void => {
  if (!elementRef.value || (props.once && hasAnimated.value)) return

  hasAnimated.value = true

  anime({
    targets: elementRef.value,
    opacity: [0, 1],
    ...getTransform(),
    duration: props.duration,
    delay: props.delay,
    easing: props.easing,
  })
}

onMounted(() => {
  if (!elementRef.value) return

  elementRef.value.style.opacity = '0'

  useIntersectionObserver(
    elementRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        animate()
      }
    },
    {
      threshold: props.threshold,
    }
  )
})
</script>

<template>
  <component
    :is="tag"
    ref="elementRef"
    class="w-reveal"
  >
    <slot />
  </component>
</template>

<style scoped>
.w-reveal {
  will-change: transform, opacity;
}
</style>
