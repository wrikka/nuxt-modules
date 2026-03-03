<template>
  <div>
    <h1 class="text-primary">Valid Theme Class</h1>
    <p class="bg-secondary text-foreground">Also Valid</p>
    <div class="bg-red-500 text-white">Invalid - not theme color</div>
    <button class="rounded-lg dark:bg-gray-800">Invalid - has dark</button>
    <div class="bg-blue-500 p-4 text-red-500">Invalid - tailwind classes</div>
    <div v-html="'<p>Inner HTML content</p>'">Dangerous - uses v-html</div>
  </div>
</template>

<script setup lang="ts">
// Console log violation
console.log('Debug message')

// Eval violation
eval('console.log("Eval executed")')

// Global mutation violation
;(window as any).globalVar = 'test'

// Recursive function violation
function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

// Large object violation (simplified)
const largeData = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: Math.random() }))
</script>

<style scoped>
</style>
