<script setup lang="ts">
const features = [
  { icon: '✂️', title: 'Crop & Resize', desc: 'Intuitive cropping with aspect ratio control' },
  { icon: '🔄', title: 'Rotate & Flip', desc: 'Transform images at any angle' },
  { icon: '🎨', title: 'Filters', desc: 'Apply preset filters and custom effects' },
  { icon: '↩️', title: 'Undo/Redo', desc: 'Full history stack with unlimited steps' },
  { icon: '📱', title: 'Mobile Ready', desc: 'Touch gestures and responsive design' },
  { icon: '⚡', title: 'Fast Export', desc: 'Export to PNG, JPEG, WebP formats' }
]
</script>

<template>
  <div class="py-12">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">wimage-editor</h1>
      <p class="text-xl text-gray-600 mb-8">
        Powerful image editing module for Nuxt.js with canvas-based manipulation
      </p>
      <div class="flex justify-center gap-4">
        <NuxtLink
          to="/guide"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Get Started
        </NuxtLink>
        <NuxtLink
          to="/examples"
          class="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
        >
          View Examples
        </NuxtLink>
      </div>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="border rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <div class="text-3xl mb-4">{{ feature.icon }}</div>
        <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
        <p class="text-gray-600">{{ feature.desc }}</p>
      </div>
    </div>

    <div class="mt-16 bg-gray-50 rounded-lg p-8">
      <h2 class="text-2xl font-bold mb-4">Quick Start</h2>
      <pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto"><code>// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wimage-editor']
})

// In your component
&lt;WImageEditor
  src="/path/to/image.jpg"
  @save="handleSave"
  @cancel="handleCancel"
/&gt;</code></pre>
    </div>
  </div>
</template>
