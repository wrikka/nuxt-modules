<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-8">Guide</h1>

    <div class="prose max-w-none">
      <h2>Installation</h2>
      <pre class="bg-gray-900 text-white p-4 rounded-lg"><code>npm install @wrikka/wimage-editor</code></pre>

      <h2>Configuration</h2>
      <pre class="bg-gray-900 text-white p-4 rounded-lg"><code>// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wimage-editor'],
  wimageEditor: {
    defaultCanvasWidth: 800,
    defaultCanvasHeight: 600,
    defaultExportFormat: 'png',
    defaultExportQuality: 0.92,
    enableHistory: true,
    maxHistorySize: 20
  }
})</code></pre>

      <h2>Basic Usage</h2>
      <pre class="bg-gray-900 text-white p-4 rounded-lg"><code>&lt;script setup lang="ts"&gt;
const handleSave = (dataUrl: string, blob: Blob | null) =&gt; {
  // Upload to server or download
  console.log('Image saved:', dataUrl)
}

const handleCancel = () =&gt; {
  console.log('Editing cancelled')
}
&lt;/script&gt;

&lt;template&gt;
  &lt;WImageEditor
    src="/path/to/image.jpg"
    @save="handleSave"
    @cancel="handleCancel"
  /&gt;
&lt;/template&gt;</code></pre>

      <h2>Composables</h2>
      <h3>useImageEditor</h3>
      <p>Main composable for accessing the image editor programmatically.</p>
      <pre class="bg-gray-900 text-white p-4 rounded-lg"><code>&lt;script setup lang="ts"&gt;
const canvasRef = ref&lt;HTMLCanvasElement&gt;()
const { loadImage, exportImage, rotate, flip, setFilter } = useImageEditor()

onMounted(async () => {
  // Initialize with custom canvas
  // ...
  await loadImage('/image.jpg')
})
&lt;/script&gt;</code></pre>

      <h2>Props & Events</h2>
      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left">Name</th>
            <th class="border p-2 text-left">Type</th>
            <th class="border p-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border p-2">src</td>
            <td class="border p-2">string</td>
            <td class="border p-2">Initial image source URL</td>
          </tr>
          <tr>
            <td class="border p-2">width</td>
            <td class="border p-2">number</td>
            <td class="border p-2">Canvas width</td>
          </tr>
          <tr>
            <td class="border p-2">height</td>
            <td class="border p-2">number</td>
            <td class="border p-2">Canvas height</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
