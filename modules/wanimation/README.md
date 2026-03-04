# @wrikka/wanimation

Animation Module for Nuxt - Powerful animation engine inspired by anime.js

## Features

- 🎬 **Anime.js Integration** - Full anime.js animation library
- 🎯 **Composables** - Ready-to-use animation composables
- 🧩 **Components** - Pre-built animation components
- 📜 **Scroll Animations** - Intersection Observer & parallax support
- ⚡ **Auto-imports** - Automatic imports for Nuxt
- 🔥 **Timeline** - Chain animations with timelines
- 🎨 **Stagger Effects** - Create beautiful stagger animations

## Installation

```bash
bun add @wrikka/wanimation
```

## Configuration

```ts
export default defineNuxtConfig({
  modules: ['@wrikka/wanimation']
})
```

## Composables

### useAnimation

```vue
<script setup>
const { animate, pause, play, restart } = useAnimation()

onMounted(() => {
  animate('hero', {
    targets: '.hero',
    translateX: 250,
    rotate: '1turn',
    duration: 800,
  })
})
</script>
```

### useTimeline

```vue
<script setup>
const { create, add } = useTimeline()

onMounted(() => {
  const tl = create('intro')
  add('intro', {
    targets: '.box',
    translateX: 250,
    duration: 800,
  })
  add('intro', {
    targets: '.box',
    rotate: '1turn',
    duration: 800,
  }, '-=400')
})
</script>
```

### useStagger

```vue
<script setup>
const { stagger, staggerGrid } = useStagger()

onMounted(() => {
  anime({
    targets: '.grid-item',
    scale: stagger([0.5, 1], { grid: [5, 5], from: 'center' }),
    delay: stagger(100, { grid: [5, 5], from: 'center' }),
  })
})
</script>
```

### useFade

```vue
<script setup>
const { fadeIn, fadeOut, fadeToggle } = useFade()

const show = async () => {
  await fadeIn('.modal', 400)
}
</script>
```

### useSlide

```vue
<script setup>
const { slideUp, slideDown, slideLeft, slideRight } = useSlide()

onMounted(() => {
  slideUp('.card', 50, 600)
})
</script>
```

### useScrollAnimation

```vue
<script setup>
const { reveal, parallax } = useScrollAnimation()

onMounted(() => {
  reveal('.section', { duration: 800, distance: 60 })
  parallax('.bg', 0.5)
})
</script>
```

## Components

### WAnimation

```vue
<template>
  <WAnimation
    :options="{ translateX: 250, rotate: '1turn' }"
    :duration="1000"
    easing="easeOutElastic"
  >
    <div class="box">Animated</div>
  </WAnimation>
</template>
```

### WTransition

```vue
<template>
  <WTransition mode="out-in">
    <div v-if="show">Content</div>
  </WTransition>
</template>
```

### WStaggerList

```vue
<template>
  <WStaggerList :items="items" :stagger="50">
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </WStaggerList>
</template>
```

### WReveal

```vue
<template>
  <WReveal duration="800" origin="bottom" distance="50">
    <h1>Revealed on scroll</h1>
  </WReveal>
</template>
```

## Utilities

```ts
import { presets, easings, durations, springs } from '~/utils/animation'

// Use presets
anime({
  targets: '.element',
  ...presets.bounceIn,
})

// Use springs
anime({
  targets: '.element',
  translateX: 250,
  easing: springs.wobbly,
})
```

## License

MIT
