<script setup lang="ts">
const { open } = useCommandPalette()

useMagicKeys({
  passive: false,
  onEventFired(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k' && e.type === 'keydown') {
      e.preventDefault()
      open()
    }
  },
})
</script>

<template>
  <div class="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <ClientOnly>
      <Sidebar />
    </ClientOnly>
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
    <LazyCommandPalette />
    <ClientOnly>
      <Toaster rich-colors />
    </ClientOnly>
  </div>
</template>
