# @wrikka/wanimation

Animation Module for Nuxt - Powerful animation engine inspired by anime.js

## Features

- 🎬 **Anime.js Integration** - Full anime.js animation library
- 🎯 **Composables** - 25+ ready-to-use animation composables
- 🧩 **Components** - Pre-built animation components
- 📜 **Scroll Animations** - Intersection Observer & parallax support
- ⚡ **Auto-imports** - Automatic imports for Nuxt
- 🔥 **Timeline** - Chain animations with timelines
- 🎨 **Stagger Effects** - Create beautiful stagger animations
- 🌊 **SVG Morphing** - Path-to-path shape morphing
- ⚛️ **Physics Engine** - Spring, bounce, gravity effects
- 📱 **Gestures** - Swipe, pinch, pan support
- 🎭 **Text Animations** - Scramble, typewriter, decode effects
- 🎪 **3D Transforms** - Perspective, flip, cube effects
- 🎉 **Confetti** - Celebration particle effects
- ♿ **Reduced Motion** - Accessibility support
- 🌐 **Web Animations API** - Native WAAPI support
- 🎬 **View Transitions API** - Page transitions
- 🔥 **WebGL Particles** - GPU-accelerated particles
- 📊 **Performance Profiler** - FPS monitoring
- 🎪 **Effects** - Glitch, Neon, Liquid, Smoke, Fire

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

## Core Composables

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

## Advanced Composables

### useMorphing - SVG Path Morphing

```vue
<script setup>
const { morph, createMorphablePath } = useMorphing()

onMounted(async () => {
  const path = createMorphablePath('.morph-path')
  await path.to('M10 10 L90 90', { duration: 1000 })
})
</script>
```

### usePhysics - Spring & Physics

```vue
<script setup>
const { spring, bounce, gravity } = usePhysics()

onMounted(() => {
  spring('.box', { translateX: 200 }, { stiffness: 100 })
  bounce('.ball', 100)
})
</script>
```

### useGestures - Touch Gestures

```vue
<script setup>
const { swipe, pan } = useGestures()

onMounted(() => {
  swipe('.carousel', {
    onSwipeLeft: () => nextSlide(),
    onSwipeRight: () => prevSlide(),
  })
})
</script>
```

### use3DTransforms - 3D Effects

```vue
<script setup>
const { flip, card3D } = use3DTransforms()

onMounted(() => {
  card3D('.card', { intensity: 15 })
})
</script>
```

### useTextAnimation - Text Effects

```vue
<script setup>
const { scramble, typewriter } = useTextAnimation()

onMounted(() => {
  scramble('.text')
  typewriter('.type', 'Hello World!')
})
</script>
```

### useConfetti - Celebration Effects

```vue
<script setup>
const { fire, burst } = useConfetti()

const celebrate = () => {
  fire({ particleCount: 150 })
}
</script>
```

### useSkeleton - Loading States

```vue
<script setup>
const { createCard } = useSkeleton()

onMounted(() => {
  const { start, stop } = createCard('.card')
  start()
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

## Available Presets

- `fadeIn`, `fadeOut` - Opacity transitions
- `slideUp`, `slideDown`, `slideLeft`, `slideRight` - Directional slides
- `scaleIn`, `scaleOut` - Scale transitions
- `bounceIn`, `rotateIn`, `rotateOut` - Entrance/exit effects
- `flipInX`, `flipInY` - 3D flips
- `zoomIn`, `zoomOut` - Zoom effects
- `pulse`, `shake`, `swing`, `wobble`, `jello`, `heartBeat` - Attention effects

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
