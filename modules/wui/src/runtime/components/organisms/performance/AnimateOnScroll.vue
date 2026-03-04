<script setup lang="ts">
interface AnimationClass {
  enter?: string
  leave?: string
}

interface Props {
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'flip'
  threshold?: number
  rootMargin?: string
  once?: boolean
  delay?: number
  duration?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animation: 'fade',
  threshold: 0.1,
  rootMargin: '0px',
  once: true,
  delay: 0,
  duration: 500,
  disabled: false
})

const elementRef = ref<HTMLDivElement>()
const isVisible = ref(props.disabled)
const hasAnimated = ref(false)

let observer: IntersectionObserver | null = null

const animationClasses: Record<string, AnimationClass> = {
  fade: { enter: 'opacity-100', leave: 'opacity-0' },
  'slide-up': { enter: 'opacity-100 translate-y-0', leave: 'opacity-0 translate-y-8' },
  'slide-down': { enter: 'opacity-100 translate-y-0', leave: 'opacity-0 -translate-y-8' },
  'slide-left': { enter: 'opacity-100 translate-x-0', leave: 'opacity-0 translate-x-8' },
  'slide-right': { enter: 'opacity-100 translate-x-0', leave: 'opacity-0 -translate-x-8' },
  zoom: { enter: 'opacity-100 scale-100', leave: 'opacity-0 scale-95' },
  flip: { enter: 'opacity-100 rotate-0', leave: 'opacity-0 rotate-x-90' }
}

const currentClasses = computed(() => {
  if (props.disabled) return animationClasses[props.animation].enter
  return isVisible.value
    ? animationClasses[props.animation].enter
    : animationClasses[props.animation].leave
})

const setupObserver = () => {
  if (!elementRef.value || props.disabled) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            isVisible.value = true
            hasAnimated.value = true
          }, props.delay)

          if (props.once) {
            observer?.disconnect()
          }
        } else if (!props.once) {
          isVisible.value = false
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  )

  observer.observe(elementRef.value)
}

onMounted(() => {
  if (!props.disabled) {
    setupObserver()
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="elementRef"
    class="transition-all"
    :class="currentClasses"
    :style="{ transitionDuration: `${duration}ms` }"
  >
    <slot :is-visible="isVisible" :has-animated="hasAnimated" />
  </div>
</template>
