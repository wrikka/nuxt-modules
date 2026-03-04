<script setup lang="ts">
import anime from 'animejs'

interface Props {
  trigger?: 'hover' | 'click' | 'scroll'
  direction?: 'left' | 'right' | 'up' | 'down'
  duration?: number
  delay?: number
  easing?: string
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'hover',
  direction: 'up',
  duration: 400,
  delay: 0,
  easing: 'easeOutQuad',
})

const contentRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)

const getTransform = () => {
  switch (props.direction) {
    case 'left': return 'translateX(100%)'
    case 'right': return 'translateX(-100%)'
    case 'up': return 'translateY(100%)'
    case 'down': return 'translateY(-100%)'
    default: return 'translateY(100%)'
  }
}

const reveal = () => {
  if (!overlayRef.value) return
  anime({
    targets: overlayRef.value,
    translateX: 0,
    translateY: 0,
    duration: props.duration,
    delay: props.delay,
    easing: props.easing,
  })
}

const hide = () => {
  if (!overlayRef.value) return
  anime({
    targets: overlayRef.value,
    ...getTransform(),
    duration: props.duration,
    easing: props.easing,
  })
}

onMounted(() => {
  if (overlayRef.value) {
    anime.set(overlayRef.value, getTransform())
  }
})
</script>

<template>
  <div
    class="w-hover-reveal relative overflow-hidden cursor-pointer"
    @mouseenter="trigger === 'hover' && reveal()"
    @mouseleave="trigger === 'hover' && hide()"
    @click="trigger === 'click' && (overlayRef?.style.transform === getTransform() ? reveal() : hide())"
  >
    <div ref="contentRef" class="w-hover-reveal-content">
      <slot name="default" />
    </div>
    <div
      ref="overlayRef"
      class="w-hover-reveal-overlay absolute inset-0 flex items-center justify-center"
      :style="{ transform: getTransform() }"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>

<style scoped>
.w-hover-reveal-overlay {
  will-change: transform;
}
</style>
