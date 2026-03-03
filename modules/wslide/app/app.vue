<script setup lang="ts">
import { parseSlideDeck } from '#wslide/utils/parser'

// โหลด slides จากไฟล์ markdown
const slidesContent = await import('../slides/presentation.md?raw')
const deck = parseSlideDeck(slidesContent.default)
</script>

<template>
  <div>
    <WSlideDeck :deck="deck" />
  </div>
</template>

