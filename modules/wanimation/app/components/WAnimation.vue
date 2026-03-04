<script setup lang="ts">
import anime from 'animejs'
import type { AnimationOptions } from '~/types/animation'

interface Props {
  options?: Partial<AnimationOptions>
  autoplay?: boolean
  duration?: number
  delay?: number
  easing?: string
  tag?: string
  trigger?: 'mount' | 'hover' | 'click' | 'scroll'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  autoplay: true,
  duration: 1000,
  delay: 0,
  easing: 'easeOutElastic',
  trigger: 'mount',
})

const emit = defineEmits<{
  begin: []
  complete: []
  update: [progress: number]
}>()

const elementRef = ref<HTMLElement | null>(null)
let animation: anime.AnimeInstance | null = null

const createAnimation = (): void => {
  if (!elementRef.value) return

  const baseOptions: AnimationOptions = {
    targets: elementRef.value,
    duration: props.duration,
    delay: props.delay,
    easing: props.easing,
    autoplay: false,
    begin: () => emit('begin'),
    complete: () => emit('complete'),
    update: (anim) => emit('update', (anim.currentTime / anim.duration) * 100),
    ...props.options,
  }

  animation = anime(baseOptions)

  if (props.autoplay && props.trigger === 'mount') {
    nextTick(() => animation?.play())
  }
}

const play = (): void => animation?.play()
const pause = (): void => animation?.pause()
const restart = (): void => animation?.restart()
const reverse = (): void => {
  animation?.reverse()
  animation?.play()
}

const handleHover = (): void => {
  if (props.trigger === 'hover') {
    animation?.restart()
  }
}

const handleClick = (): void => {
  if (props.trigger === 'click') {
    animation?.restart()
  }
}

onMounted(() => {
  createAnimation()
})

onBeforeUnmount(() => {
  if (animation) {
    anime.remove(animation.animatables.map(a => a.target))
  }
})

defineExpose({
  play,
  pause,
  restart,
  reverse,
  animation: () => animation,
})
</script>

<template>
  <component
    :is="tag"
    ref="elementRef"
    class="w-animate"
    @mouseenter="handleHover"
    @click="handleClick"
  >
    <slot />
  </component>
</template>
