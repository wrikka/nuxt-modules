<script setup lang="ts">
import anime from 'animejs'

interface Props {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  separator?: string
  easing?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  decimals: 0,
  separator: ',',
  easing: 'easeOutExpo',
})

const displayValue = ref(props.value)
let animation: anime.AnimeInstance | null = null

const formatNumber = (num: number): string => {
  const fixed = num.toFixed(props.decimals)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)
  return parts.join('.')
}

const animateTo = (targetValue: number) => {
  if (animation) animation.pause()

  const startValue = displayValue.value
  const animObj = { value: startValue }

  animation = anime({
    targets: animObj,
    value: targetValue,
    duration: props.duration,
    easing: props.easing,
    update: () => {
      displayValue.value = animObj.value
    },
  })
}

watch(() => props.value, (newValue) => {
  animateTo(newValue)
})

onMounted(() => {
  displayValue.value = 0
  animateTo(props.value)
})
</script>

<template>
  <span class="w-animated-number">
    {{ prefix }}{{ formatNumber(displayValue) }}{{ suffix }}
  </span>
</template>
