<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-8">Examples</h1>

    <div class="space-y-8">
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Basic Editor</h2>
        <p class="text-gray-600 mb-4">Simple image editor with default settings.</p>
        <pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto"><code>&lt;template&gt;
  &lt;WImageEditor
    src="/sample-image.jpg"
    @save="handleSave"
    @cancel="handleCancel"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>

      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Custom Canvas Size</h2>
        <p class="text-gray-600 mb-4">Editor with custom canvas dimensions.</p>
        <pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto"><code>&lt;template&gt;
  &lt;WImageEditor
    src="/sample-image.jpg"
    :width="1200"
    :height="800"
    @save="handleSave"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>

      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Programmatic Control</h2>
        <p class="text-gray-600 mb-4">Using composable for advanced control.</p>
        <pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto"><code>&lt;script setup lang="ts"&gt;
const { loadImage, rotate, setFilter, exportImage } = useImageEditor()

const applySepiaAndRotate = async () =&gt; {
  await loadImage('/image.jpg')
  setFilter('sepia', 100)
  rotate(90)
  const result = exportImage({ format: 'jpeg', quality: 0.9 })
  console.log(result)
}
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="applySepiaAndRotate"&gt;
    Apply Effects
  &lt;/button&gt;
&lt;/template&gt;</code></pre>
      </div>

      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">File Upload</h2>
        <p class="text-gray-600 mb-4">Editor with file upload capability.</p>
        <pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto"><code>&lt;script setup lang="ts"&gt;
const editorRef = ref()

const onFileSelect = async (event: Event) =&gt; {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // File will be loaded via the editor's upload button
  }
}
&lt;/script&gt;

&lt;template&gt;
  &lt;WImageEditor
    ref="editorRef"
    @save="handleSave"
  /&gt;
&lt;/template&gt;</code></pre>
      </div>
    </div>
  </div>
</template>
